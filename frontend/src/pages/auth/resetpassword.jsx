import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom

const ResetPassword = () => {
  const [resetEmail, setResetEmail] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const navigate = useNavigate(); // Initialize the navigate function

  const handleResetChange = (e) => {
    setResetEmail(e.target.value);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetError("");
    setResetMessage("");

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(resetEmail)) {
      setResetError("Please enter a valid email address.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/forgot-password", { email: resetEmail });
      setResetMessage("A password reset link has been sent to your email.");
      setTimeout(() => {
        navigate("/login"); // Navigate to the login page after 3 seconds
      }, 3000);
    } catch (err) {
      setResetError("Error sending reset link. Please try again.");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="w-1/2 bg-navy text-white flex flex-col items-center justify-center px-12">
        <h1 className="text-4xl font-bold mb-4">DocConnect</h1>
        <ul className="space-y-4 text-lg">
          <li className="flex items-center">
            <p className="text-lg font-medium italic">Your health journey begins here.</p>
          </li>
        </ul>
      </div>

      {/* Right Section */}
      <div className="w-1/2 flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-left">Reset Password</h2>
          <p className="text-sm text-gray-600 mb-4 text-left">
            Enter your email address below, and we’ll send you a link to reset your password.
          </p>

          {/* Reset Error Message */}
          {resetError && <p className="text-red-500 font-medium mb-4">{resetError}</p>}
          {resetMessage && <p className="text-green-500 font-medium mb-4">{resetMessage}</p>}

          <form onSubmit={handleResetPassword}>
            {/* Email Input */}
            <div className="mb-4">
              <label htmlFor="reset-email" className="block text-gray-700 font-medium mb-1">
                Your Email
              </label>
              <input
                type="email"
                id="reset-email"
                name="reset-email"
                value={resetEmail}
                onChange={handleResetChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Reset Button */}
            <button
              type="submit"
              className="w-full bg-navy text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              Send Reset Link
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
