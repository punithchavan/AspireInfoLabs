import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    device: {
      ip: String,
      userAgent: String,
      deviceId: String, // fingerprint
    },
    refreshToken: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: "30d", // auto delete after 30 days
    },
  },
  { timestamps: true }
);

export const Session = mongoose.model("Session", sessionSchema);
