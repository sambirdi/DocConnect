import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmitNewPassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      return;
    }

    try {
      const searchParams = new URLSearchParams(window.location.search);
      const token = searchParams.get("token");
      const email = searchParams.get("email");

      await axios.post("http://localhost:5000/api/auth/reset-password", {
        token,
        email,
        newPassword,
      });

      setPasswordSuccess("Your password has been successfully updated.");

      // Redirect to login page after a short delay
      setTimeout(() => navigate("/login"), 2000); // 2-second delay
    } catch (err) {
      setPasswordError(
        err.response?.data?.message || "Error updating password. Please try again."
      );
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
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-left">Set New Password</h2>
          <p className="text-sm text-gray-600 mb-4 text-left">
            Enter your new password below to complete the reset process.
          </p>

          {/* New Password Section */}
          {passwordError && <p className="text-red-500 font-medium mb-4">{passwordError}</p>}
          {passwordSuccess && <p className="text-green-500 font-medium mb-4">{passwordSuccess}</p>}

          <form onSubmit={handleSubmitNewPassword}>
            {/* New Password Input */}
            <div className="mb-4">
              <label htmlFor="new-password" className="block text-gray-700 font-medium mb-1">
                New Password
              </label>
              <input
                type="password"
                id="new-password"
                name="new-password"
                value={newPassword}
                onChange={handleNewPasswordChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter new password"
                required
              />
            </div>

            {/* Confirm Password Input */}
            <div className="mb-4">
              <label htmlFor="confirm-password" className="block text-gray-700 font-medium mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm-password"
                name="confirm-password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Confirm new password"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-navy text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
