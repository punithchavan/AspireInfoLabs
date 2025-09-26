import { useState } from "react";
import { enable2FA } from "../api/userApi";
import { verify2FA } from "../api/userApi";

const Preferences = () => {
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [token, setToken] = useState("");
  const [step, setStep] = useState("idle"); // idle | qr | verify

  const handleEnable2FA = async () => {
    try {
      const res = await enable2FA();
      setQrCode(res.data.data.qrCodeUrl); // from backend ApiResponse
      setStep("qr");
    } catch (err) {
      console.error("Enable 2FA failed:", err);
    }
  };

  const handleVerify2FA = async () => {
    try {
      await verify2FA(token);
      setTwoFAEnabled(true);
      setStep("idle");
      alert("✅ Two-factor authentication enabled!");
    } catch (err) {
      console.error("Verify failed:", err);
      alert("❌ Invalid token, try again");
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Preferences</h2>

      {/* Toggle */}
      <div className="flex items-center space-x-2">
        <label className="font-medium">Enable 2FA:</label>
        <button
          onClick={handleEnable2FA}
          disabled={twoFAEnabled}
          className={`px-4 py-1 rounded ${
            twoFAEnabled ? "bg-gray-400" : "bg-green-600 text-white"
          }`}
        >
          {twoFAEnabled ? "Enabled" : "Enable"}
        </button>
      </div>

      {/* Step 1: Show QR */}
      {step === "qr" && qrCode && (
        <div className="space-y-2">
          <p className="text-sm">Scan this QR in Google Authenticator:</p>
          <img src={qrCode} alt="2FA QR" className="w-48 h-48 mx-auto" />

          {/* Input token */}
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter 6-digit code"
            className="border rounded px-2 py-1 w-40"
          />
          <button
            onClick={handleVerify2FA}
            className="ml-2 px-3 py-1 rounded bg-blue-600 text-white"
          >
            Verify
          </button>
        </div>
      )}
    </div>
  );
};

export {
    Preferences
}
