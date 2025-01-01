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
        { withCredentials: true }
      );
      
      if (response.data.message?.toLowerCase().includes("already verified")) {
        showAlert("success", "Verified", response.data.message);
        return;
      }

      setMessage(response.data.message || "OTP sent to your email please check.");
      showAlert("success", "Success", "OTP sent to your email");
      setStep(2);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error requesting OTP.";
      setMessage(errorMessage);
      showAlert("error", "Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerification = async () => {
    if (!otp.trim()) {
      showAlert("error", "Error", "Please enter the OTP");
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/OtpVerification`,
        { otp },
        { withCredentials: true }
      );
      setMessage(response.data.message || "OTP verified successfully.");
      if (response.data.type === 'success') {
        showAlert("success", "Success", response.data.message || "OTP verified successfully.");
        setStep(1);
        setOtp("");
      } else {
        showAlert("error", "Error", response.data.message || "OTP verification failed.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error verifying OTP.";
      setMessage(errorMessage);
      showAlert("error", "Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      {alertProps && (
        <Alert
          type={alertProps.type}
          title={alertProps.title}
          message={alertProps.message}
          onClose={() => setAlertProps(null)}
        />
      )}

      <div className="bg-white p-8 rounded-2xl shadow-xl w-96 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {step === 1 ? "Email Verification" : "Enter OTP"}
          </h1>
          <p className="text-gray-600">
            {step === 1 
              ? "We'll send a verification code to your email"
              : "Please enter the verification code sent to your email"
            }
          </p>
        </div>

        {step === 1 ? (
          <button
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 
                     transition-all duration-200 focus:outline-none focus:ring-2 
                     focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            onClick={handleOtpRequest}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Verification Code"}
          </button>
        ) : (
          <div className="space-y-4">
            <input
              type="text"
              maxLength="6"
              className="w-full text-center text-2xl tracking-widest font-mono border-2 
                       border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 
                       focus:ring-blue-500 focus:border-transparent"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
              onKeyPress={(e) => e.key === 'Enter' && handleOtpVerification()}
              autoFocus
            />
            <button
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg 
                       hover:bg-green-700 transition-all duration-200 
                       focus:outline-none focus:ring-2 focus:ring-green-500 
                       focus:ring-offset-2 disabled:opacity-50"
              onClick={handleOtpVerification}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OtpComponent;