import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  registerUser,
  verifyEmail,
  completeUserProfile,
  loginUser,
  logoutUser,
  refreshAccessToken,
  enable2FA,
  verify2FA,
  loginWith2FA,
  getCurrentUser
} from "../controllers/user.controller.js";

const router = Router();

// Public routes
router.post("/register", registerUser);
router.post("/verify-email", verifyEmail);
router.post("/login", loginUser);
router.post("/login-2fa", loginWith2FA);
router.post("/refresh-token", refreshAccessToken);

//protected routes
router.use(verifyJWT);
router.post("/complete-profile", verifyJWT, upload.fields([{ name: "profilePicture", maxCount: 1}]), completeUserProfile);
router.post("/logout", logoutUser);
router.post("/2fa/enable", enable2FA);
router.post("/2fa/verify", verify2FA);
router.get("/me", getCurrentUser);


export default router;