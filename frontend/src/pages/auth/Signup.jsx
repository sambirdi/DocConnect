import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
  
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", formData);
      setMessage("OTP sent to your email. Please verify to complete registration.");
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
  
      setTimeout(() => {
        navigate("/verify-otp", {
          state: { userId: response.data.userId, email: formData.email },
        });
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to create an account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="w-1/2 bg-navy text-white flex flex-col items-center justify-center px-12">
        <h1 className="text-4xl font-bold mb-4">DocConnect</h1>
        <ul className="space-y-4 text-lg">
          <li className="flex items-center">
            <p className="text-lg font-medium italic">
              Your health journey begins here.
            </p>
          </li>
        </ul>
      </div>

      {/* Right Section */}
      <div className="w-1/2 flex items-center justify-center bg-gray-50 px-12">
        <div className="w-full max-w-md space-y-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Sign Up For Patients</h2>
          <p className="text-sm font text-gray-600 mb-4">
            Create an patient account to get started.
          </p>

          {/* Success and Error Messages */}
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
            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-gray-700 font-medium mb-1"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Create a password"
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-gray-700 font-medium mb-1"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Confirm your password"
                required
              />
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full bg-navy text-white py-3 rounded-md hover:bg-navy/80 transition"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <p className="text-sm text-center text-gray-700 mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-navy hover:underline">
              Log in
            </a>
          </p>

          <div>
            <p className="text-sm text-center text-gray-700 mt-4">
              Are you a doctor?{" "}
              <a href="/doctorsignup" className="text-navy hover:underline font-bold">
                Register here
              </a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Signup;
