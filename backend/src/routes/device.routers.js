import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getUserDevices, removeDevice } from "../controllers/device.controller.js";

const router = Router();

router.use(verifyJWT);
router.get("/", getUserDevices); // GET /api/devices
router.delete("/:sessionId", removeDevice); // DELETE /api/devices/:sessionId

export default router;
