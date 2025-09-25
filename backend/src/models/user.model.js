import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true,
    default: null,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  fullName: { type: String, required: true, trim: true, index: true },
  profilePicture: {
    public_id: String,
    url: String,
  },
  password: { type: String, required: false },
  DOB: { type: Date, required: true },
  bio: { type: String, trim: true },
  isVerified: { type: Boolean, default: false },
//   searchHistory: [
//     { keyword: String, searchedAt: { type: Date, default: Date.now } },
//   ],
  refreshToken: String,
  emailVerificationToken: String,
  emailVerificationTokenExpiry: { type: Date, index: true },

  /* --- Additional Security Fields --- */
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorSecret: { type: String },

  devices: [
    {
      deviceId: String,
      lastUsed: Date,
      ip: String,
      location: String,
      browser: String,
    },
  ],

  loginAttempts: { type: Number, default: 0 },
  lastLoginAttempt: { type: Date },
}, { timestamps: true });


userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


userSchema.methods.isPasswordCorrect = async function(password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function() {
  return jwt.sign(
    { _id: this._id, email: this.email, username: this.username, fullName: this.fullName },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

userSchema.methods.generateRefreshToken = function() {
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

userSchema.methods.generateEmailVerificationToken = function() {
  return jwt.sign(
    { _id: this._id, email: this.email },
    process.env.EMAIL_VERIFICATION_TOKEN_SECRET,
    { expiresIn: process.env.EMAIL_VERIFICATION_TOKEN_EXPIRY }
  );
};


userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ "emailVerificationTokenExpiry": 1 }, { expireAfterSeconds: 0 });

export const User = mongoose.model("User", userSchema);
