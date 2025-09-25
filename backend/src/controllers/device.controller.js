import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Session } from "../models/session.model.js";

const getUserDevices = asyncHandler(async (req, res) => {
  const sessions = await Session.find({ user: req.user._id }).select(
    "-refreshToken"
  );
  return res
    .status(200)
    .json(new ApiResponse(200, sessions, "Active devices fetched"));
});

// --- Remove a specific device ---
const removeDevice = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  const session = await Session.findOne({
    _id: sessionId,
    user: req.user._id,
  });

  if (!session) {
    throw new ApiError(404, "Device not found");
  }

  await session.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Device removed successfully"));
});

export {
    getUserDevices,
    removeDevice
}