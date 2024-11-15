import React, { useState } from "react";

const OtpRequest = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false); // State to handle button disable

  const handleSendOtp = async () => {
    setIsSending(true);
    try {
      const response = await fetch("http://localhost:8000/users/getOtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      if (response.ok) {
        setShowOtpForm(true);
        setMessage("OTP sent successfully!");
      } else {
        setMessage(result.error || "Failed to send OTP");
      }
    } catch (error) {
      setMessage("An error occurred while sending OTP");
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyOtp = async () => {
    setIsSending(true);
    try {
      const response = await fetch("http://localhost:8000/users/verifyOtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage("OTP verified successfully!");
      } else {
        setMessage(result.error || "Failed to verify OTP");
      }
    } catch (error) {
      setMessage("An error occurred while verifying OTP");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {!showOtpForm ? (
        <div className="w-96 p-6 bg-white shadow-lg rounded-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Enter Your Email</h2>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
          />
          <button
            onClick={handleSendOtp}
            disabled={isSending}
            className={`w-full py-2 rounded-md transition duration-200 ${
              isSending
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {isSending ? "Sending..." : "Send OTP"}
          </button>
        </div>
      ) : (
        <div className="w-96 p-6 bg-white shadow-lg rounded-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Enter the OTP</h2>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="OTP"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
          />
          <button
            onClick={handleVerifyOtp}
            disabled={isSending}
            className={`w-full py-2 rounded-md transition duration-200 ${
              isSending
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {isSending ? "Verifying..." : "Verify OTP"}
          </button>
        </div>
      )}

      {message && (
        <p className="mt-4 text-blue-600 text-center">{message}</p>
      )}
    </div>
  );
};

export default OtpRequest;
