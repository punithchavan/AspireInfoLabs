import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendVerificationEmail } from "../utils/sendVerificationEmail.js";
import { isValidObjectId } from "mongoose";
import { parseTimeToMs } from "../utils/timeConverter.js";
import jwt from "jsonwebtoken";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import { Session } from "../models/session.model.js";
import { getDeviceFingerprint } from "../utils/device.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
// Helper for access + refresh tokens
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens.");
  }
};

// Register
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, DOB, email } = req.body;
  if ([fullName, DOB, email].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({ email: email.trim() });
  if (existedUser) {
    throw new ApiError(400, "User with this email already exists");
  }

  const user = await User.create({
    fullName: fullName.trim(),
    DOB,
    email: email.trim(),
    isVerified: false,
  });

  if (!user || !user._id) {
    throw new ApiError(400, "User creation failed");
  }

  const emailVerificationToken = user.generateEmailVerificationToken();
  user.emailVerificationToken = emailVerificationToken;
  const expiryMs = parseTimeToMs(process.env.EMAIL_VERIFICATION_TOKEN_EXPIRY);
  user.emailVerificationTokenExpiry = Date.now() + expiryMs
  await user.save({ validateBeforeSave: false });

  console.log(`Verification URL: http://localhost:5173/verify/${emailVerificationToken}`);

  await sendVerificationEmail(user.email, emailVerificationToken);

  return res
    .status(201)
    .json(new ApiResponse(201, {}, "User registered. Verification email sent."));
});

// Verify Email
const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.body;
  if (!token) throw new ApiError(400, "Verification token is required");

  console.log("Received token from frontend:", req.body.token);

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.EMAIL_VERIFICATION_TOKEN_SECRET);
  } catch (error) {
    throw new ApiError(401, "Token is invalid or expired");
  }

  const user = await User.findById(decodedToken._id);
  if (!user) throw new ApiError(404, "User not found");

  if (user.isVerified) {
    return res.status(200).json(new ApiResponse(200, {}, "Email is already verified"));
  }

  if (user.emailVerificationToken !== token) {
    throw new ApiError(400, "Invalid or expired verification token");
  }

  if (user.emailVerificationTokenExpiry < Date.now()) {
    throw new ApiError(400, "Verification token has expired");
  }

  user.isVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationTokenExpiry = undefined;
  await user.save({ validateBeforeSave: false });

  
  const accessToken = user.generateAccessToken(); // assuming this method exists on your user schema

  
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Email verified successfully"));
});

const completeUserProfile = asyncHandler(async (req, res) => {  
  const { username, password, bio } = req.body;
  const userId = req.user._id;

  // console.log("req.body =>", req.body);
  // console.log("req.files =>", req.files);

  if (!userId || !isValidObjectId(userId)) {
    throw new ApiError(404, "Wrong user ID");
  }

 if ([username, password, bio].some((field) => !field || field.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  const existingUserName = await User.findOne({username});
  if(existingUserName){
    throw new ApiError(400, "Username already taken");
  }

  const profilePictureLocalPath = req.files?.profilePicture?.[0]?.path;
  if (!profilePictureLocalPath) {
    throw new ApiError(400, "profilePicture is missing");
  }

  //console.log("Uploading file from path:", profilePictureLocalPath);


  const profilePicture = await uploadOnCloudinary(profilePictureLocalPath);

  //console.log("Cloudinary response:", profilePicture);

  if (!profilePicture?.url || !profilePicture?.public_id) {
    throw new ApiError(400, "Failed to upload profile picture");
  }

  if (user.isVerified) {
    user.username = username.trim();
    user.password = password;
    user.bio = bio.trim();
    user.profilePicture = {
      url: profilePicture.url,
      public_id: profilePicture.public_id,
    };
  }

  await user.save();
  const updatedUser = await User.findById(userId).select("-password -refreshToken -emailVerificationToken -emailVerificationTokenExpiry");

 // console.log("Updated user response =>", updatedUser);


  return res.status(200).json(new ApiResponse(200, updatedUser, "User profile completed successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  if ([email, username].every((field) => !field?.trim())) {
    throw new ApiError(400, "Email or username is required");
  }

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) throw new ApiError(404, "User not found");
  if (!user.isVerified) throw new ApiError(403, "Please verify your email first.");

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(401, "Invalid user credentials");

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  };

  const deviceInfo = getDeviceFingerprint(req);

  await Session.create({
  user: user._id,
  device: deviceInfo,
  refreshToken,
  });



  if (user.twoFactorEnabled) {
    const temp2FAToken = jwt.sign(
    { _id: user._id },
    process.env.TWO_FA_SECRET,
    { expiresIn: "5m" } // valid only for 5 minutes
  );

  return res.status(200).json(
    new ApiResponse(200, { requires2FA: true, temp2FAToken }, "2FA required")
  );
}

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully"));
});

// Logout
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $unset: { refreshToken: 1 },
  });

  await Session.deleteOne({ user: req.user._id});

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

// Refresh Token
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken || req.header['authorization']?.replace("Bearer ", "");
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

    const session = await Session.findOne({
      user: decodedToken._id,
      refreshToken: incomingRefreshToken,
    });
    if (!session) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const user = await User.findById(decodedToken._id);
    if (!user) throw new ApiError(404, "User not found");

    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Refresh token is invalid or reused");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(200, { accessToken, refreshToken }, "Access token refreshed successfully"));
  } catch (error) {
    throw new ApiError(401, error.message || "Invalid refresh token");
  }
});

//2FA
const enable2FA = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, "User not found");

  const secret = speakeasy.generateSecret({ name: "AspireInfoLabsApp" });
  user.twoFactorSecret = secret.base32;
  user.twoFactorEnabled = false; // will enable after verification
  await user.save();

  // Send QR code to frontend
  const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);

  return res
    .status(200)
    .json(new ApiResponse(200, { qrCodeUrl }, "Scan QR with Google Authenticator"));
});

//verify and enable 2FA
const verify2FA = asyncHandler(async (req, res) => {
  const { token } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, "User not found");

  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: "base32",
    token,
    window: 1, // allow small time drift
  });

  if (!verified) throw new ApiError(400, "Invalid 2FA token");

  user.twoFactorEnabled = true;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Two-factor authentication enabled"));
});

const loginWith2FA = asyncHandler(async (req, res) => {
  const { userId, token } = req.body; // frontend should send this after step 1
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: "base32",
    token,
  });

  if (!verified) throw new ApiError(401, "Invalid or expired 2FA code");

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

  return res
    .status(200)
    .cookie("accessToken", accessToken, { httpOnly: true })
    .cookie("refreshToken", refreshToken, { httpOnly: true })
    .json(new ApiResponse(200, { user, accessToken, refreshToken }, "2FA login successful"));
});

export {
    registerUser,
    verifyEmail,
    completeUserProfile,
    loginUser,
    logoutUser,
    refreshAccessToken,
    enable2FA,
    verify2FA,
    loginWith2FA
};