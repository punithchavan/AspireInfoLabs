import crypto from "crypto";

export const getDeviceFingerprint = (req) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const userAgent = req.headers["user-agent"];

  // Generate unique fingerprint hash
  const deviceId = crypto
    .createHash("sha256")
    .update(ip + userAgent)
    .digest("hex");

  return {
    ip,
    userAgent,
    deviceId,
  };
};
