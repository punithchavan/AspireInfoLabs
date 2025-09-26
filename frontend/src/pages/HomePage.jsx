import React, { useEffect, useState, useRef } from "react";
import { Header } from "../components/header";
import { getUserDevices, removeDevice } from "../api/deviceApi";

const HomePage = () => {
  // Hardcoded laptop (your logged-in device)
  const hardcodedLaptop = {
    _id: "local-laptop-0001",
    user: "local-user",
    ip: "192.168.1.100", // change to your laptop IP if you want
    userAgent: "Chrome (User Laptop)",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    device: "Lenovo IdeaPad (Windows 11, Chrome)",
  };

  const [devices, setDevices] = useState([hardcodedLaptop]);
  const [loadingDevices, setLoadingDevices] = useState(true);
  const [flagStatus, setFlagStatus] = useState("green"); // "green" | "red"
  const [flagMessage, setFlagMessage] = useState(
    "✅ System secure. No suspicious activity."
  );
  const [suspiciousLogs, setSuspiciousLogs] = useState([]);
  const [blockedIp, setBlockedIp] = useState(null); // ip that gets auto blocked after check

  // refs to keep track of timers for cleanup
  const resetTimerRef = useRef(null);

  // Merge helper: ensure hardcoded laptop is present in the list (without duplicates)
  const mergeWithHardcoded = (serverDevices = []) => {
    // consider uniqueness by ip + userAgent (or _id if server provided one)
    const exists = serverDevices.some(
      (d) => d.ip === hardcodedLaptop.ip && d.userAgent === hardcodedLaptop.userAgent
    );
    if (exists) return serverDevices;
    return [hardcodedLaptop, ...serverDevices];
  };

  // Fetch devices from backend
  const fetchDevices = async () => {
    try {
      setLoadingDevices(true);
      const res = await getUserDevices(); // expects the API you showed
      const serverDevices = (res && res.data && res.data.data) || [];
      setDevices(mergeWithHardcoded(serverDevices));
    } catch (err) {
      console.error("Failed to fetch devices", err);
      // keep the hardcoded device shown even if fetch fails
    } finally {
      setLoadingDevices(false);
    }
  };

  useEffect(() => {
    fetchDevices();
    return () => {
      // cleanup timers on unmount
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Remove device
  const handleRemoveDevice = async (deviceId) => {
    try {
      await removeDevice(deviceId); // call your remove API
      setDevices((prev) => prev.filter((d) => d._id !== deviceId));
    } catch (err) {
      console.error("Failed to remove device", err);
    }
  };

  // Simulate cyber attack check
  const handleCyberAttackCheck = (options = {}) => {
    // pick a suspicious ip to report — either from options or first non-local device
    const detected =
      options.ip ||
      devices.find((d) => d._id !== hardcodedLaptop._id)?.ip ||
      devices[0]?.ip ||
      "unknown-ip";

    setBlockedIp(detected);

    setFlagStatus("red");
    setFlagMessage("⚠️ Suspicious activity detected!");
    setSuspiciousLogs([
      `Multiple failed login attempts detected (source IP: ${detected})`,
      `Unusual access pattern from IP: ${detected}`,
      `Attempted injection payloads detected and blocked — NoSQL injection attempts prevented by input sanitization (mongo-sanitize)`,
      `Unauthorized device tried to connect (User Agent: ${devices[0]?.userAgent || "unknown"})`,
    ]);

    // Clear any existing timer
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);

    // After 45 seconds, reset flag and show final secured + auto-blocked message
    resetTimerRef.current = setTimeout(() => {
      setFlagStatus("green");
      setFlagMessage(
        `✅ System secure. Suspicious user at IP ${detected} has been auto-blocked.`
      );
      // optionally keep a final log entry for audit before clearing (we'll show it briefly)
      setSuspiciousLogs((prev) => [
        ...prev,
        `Auto-blocked IP ${detected} and applied temporary firewall rule.`,
      ]);

      // clear logs after a short grace so user can see final log (e.g., 6s)
      const clearLogsTimer = setTimeout(() => {
        setSuspiciousLogs([]);
      }, 6 * 1000);

      // cleanup nested timer on unmount as well
      resetTimerRef.current = clearLogsTimer;
    }, 30 * 1000); // 45 seconds
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="p-6 space-y-6">
        {/* Security Flag */}
        <div className="flex items-center justify-between bg-white p-4 rounded shadow">
          <div className="flex items-center space-x-4">
            <div
              className={`w-6 h-6 rounded-full ${
                flagStatus === "green" ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="font-semibold">{flagMessage}</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleCyberAttackCheck()}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Check Cyber Attacks
            </button>
            <button
              onClick={fetchDevices}
              className="px-3 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
            >
              Refresh Devices
            </button>
          </div>
        </div>

        {/* Devices List */}
        <div className="bg-white p-4 rounded shadow space-y-4">
          <h2 className="text-lg font-semibold">Logged-in Devices</h2>

          {loadingDevices ? (
            <p>Loading devices...</p>
          ) : devices.length === 0 ? (
            <p>No active devices.</p>
          ) : (
            <ul className="space-y-2">
              {devices.map((device) => (
                <li
                  key={device._id}
                  className="flex justify-between items-center border rounded px-4 py-2"
                >
                  <div>
                    <p className="font-medium">
                      {device.device || `Device (${device._id})`}
                    </p>
                    <p className="text-sm text-gray-500">IP: {device.ip}</p>
                    <p className="text-sm text-gray-500">
                      User Agent: {device.userAgent}
                    </p>
                    <p className="text-sm text-gray-500">
                      Logged In At: {new Date(device.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleRemoveDevice(device._id)}
                      className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition"
                    >
                      Remove
                    </button>

                    {/* Quick "flag this IP" button to simulate blocking specific device */}
                    <button
                      onClick={() => handleCyberAttackCheck({ ip: device.ip })}
                      title="Simulate attack from this device"
                      className="px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600 transition"
                    >
                      Flag IP
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Suspicious activity logs */}
        {suspiciousLogs.length > 0 && (
          <div className="bg-white p-4 rounded shadow space-y-2">
            <h3 className="font-semibold text-red-600">Suspicious Activity Logs:</h3>
            <ul className="list-disc list-inside text-sm text-gray-700">
              {suspiciousLogs.map((log, idx) => (
                <li key={idx}>{log}</li>
              ))}
            </ul>
            {blockedIp && (
              <p className="text-xs text-gray-500 mt-2">
                IP under investigation: {blockedIp}
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export { HomePage };
