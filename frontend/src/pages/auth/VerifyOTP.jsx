import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(600); // 10 minutes in seconds
  const navigate = useNavigate();
  const location = useLocation();

  const { email } = location.state || {};

  // Validate access and redirect if email is missing
  useEffect(() => {
    if (!email) {
      setError("Invalid access. Please register again.");
      setTimeout(() => navigate("/signup"), 2000);
    }
  }, [email, navigate]);

  // Timer countdown logic
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // Format timer as MM:SS
  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(otp)) {
      setError("OTP must be a 6-digit number");
      return;
    }
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email,
        otp,
      });
      setMessage(response.data.message);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to verify OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    setError("");
    setMessage("");
    setTimer(600); // Reset timer to 10 minutes

    try {
      const response = await axios.post("http://localhost:5000/api/auth/resend-otp", {
        email,
      });
      setMessage(response.data.message);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to resend OTP. Please try again."
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="w-full md:w-1/2 bg-navy text-white flex flex-col items-center justify-center px-12">
        <h1 className="text-4xl font-bold mb-4">DocConnect</h1>
        <ul className="space-y-4 text-lg">
          <li className="flex items-center">
            <p className="text-lg font-medium italic">
              Your health journey begins here.
            </p>
          </li>
        </ul>
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 px-12">
        <div className="w-full max-w-md space-y-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Verify OTP</h2>
          <p className="text-sm font text-gray-600 mb-4">
            Enter the 6-digit OTP sent to your email ({email || "your email"}).
          </p>
          <p className="text-sm text-gray-600 mb-4">
            Time remaining: <span className="font-medium">{formatTimer(timer)}</span>
            {timer <= 0 && " (OTP expired, please resend)"}
          </p>
          {message && (
            <p className="text-green-500 text-center font-medium mb-4">
              {message}
            </p>
          )}
          {error && (
            <p className="text-red-500 text-center font-medium mb-4">
              {error}
            </p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="otp"
                className="block text-gray-700 font-medium mb-1"
              >
                OTP Code
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter the 6-digit OTP"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-navy text-white py-3 rounded-md hover:bg-blue-700 transition"
              disabled={loading || timer <= 0}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
          <p className="text-sm text-center text-gray-700 mt-4">
            Didn't receive the OTP?{" "}
            <button
              onClick={handleResendOTP}
              className="text-navy hover:underline font-medium"
              disabled={resendLoading}
            >
              {resendLoading ? "Resending..." : "Resend OTP"}
            </button>
          </p>
          <p className="text-sm text-center text-gray-700 mt-4">
            Already verified?{" "}
            <a href="/login" className="text-navy hover:underline">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;