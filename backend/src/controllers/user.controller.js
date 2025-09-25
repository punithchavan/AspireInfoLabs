import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendVerificationEmail } from "../utils/sendVerificationEmail.js";
import { isValidObjectId } from "mongoose";
import { parseTimeToMs } from "../utils/timeConverter.js";
import jwt from "jsonwebtoken";

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