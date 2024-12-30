import React, { useState } from "react";
import axios from "axios";
import Alert from "../AiComps/Alert"; 

const OtpComponent = () => {
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertProps, setAlertProps] = useState(null); 

  const showAlert = (type, title, message) => {
    setAlertProps({ type, title, message });
    setTimeout(() => setAlertProps(null), 4000);
  };

  const handleOtpRequest = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/OtpRequest`,
        {
          withCredentials: true,
        }
      );
      setMessage(response.data.message || "OTP sent to your email please check.");
      showAlert("success", "OTP Sent", response.data.message || "OTP sent to your email.");
      setStep(2);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error requesting OTP.";
      setMessage(errorMessage);
      showAlert("error", "OTP Request Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerification = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/OtpVerification`,
        { otp },
        {
          withCredentials: true,
        }
      );
      setMessage(response.data.message || "OTP verified successfully.");
      showAlert("success", "OTP Verified", response.data.message || "OTP verified successfully.");
      setStep(1);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error verifying OTP.";
      setMessage(errorMessage);
      showAlert("error", "OTP Verification Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {alertProps && (
        <Alert
          type={alertProps.type}
          title={alertProps.title}
          message={alertProps.message}
          onClose={() => setAlertProps(null)}
        />
      )}
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h1 className="text-xl font-semibold text-gray-700 mb-4">
          {step === 1 ? "Request OTP" : "Verify OTP"}
        </h1>

        {step === 1 ? (
          <>
            <button
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
              onClick={handleOtpRequest}
              disabled={loading}
            >
              {loading ? "Requesting..." : "Request OTP"}
            </button>
          </>
        ) : (
          <>
            <label htmlFor="otp" className="block text-sm text-gray-600 mb-2">
              Enter the OTP:
            </label>
            <input
              type="text"
              id="otp"
              className="w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring focus:border-blue-500"
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300"
              onClick={handleOtpVerification}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {message && (
          <div
            className={`mt-4 text-sm ${
              message.toLowerCase().includes("error")
                ? "text-red-500"
                : "text-green-500"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default OtpComponent;
