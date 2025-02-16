import React, { useState } from "react";
import { useAuth } from "../../context/auth";  // Import your custom hook
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [auth, setAuth] = useAuth();  // Use the auth context
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear any existing error messages
  
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", formData);
      console.log(response.data);  // Add this to log the response data
      const { user, token } = response.data;
  
      if (token) {
        // Set the auth context and store data in localStorage
        setAuth({ user, token });
  
        // Redirect based on user role
        if (user.role === "admin") {
          navigate("/dashboard/admin");
        } else if (user.role === "doctor") {
          if (!user.isApproved) {
            setError("Your account is awaiting approval from the admin.");
          } else {
            navigate("/"); // Redirect to homepage if doctor is approved
          }
        } else {
          navigate("/"); // Default redirect for other roles
        }
      }
    } catch (err) {
      console.error(err);  // Log the full error object
      // Check for specific error codes (e.g., 403 for unapproved doctor)
      if (err.response?.status === 403) {
        setError("Your account is awaiting approval from the admin.");
      } else {
        setError("Invalid email or password. Please try again.");
      }
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
            <p className="text-lg font-medium italic">Your health journey begins here.</p>
          </li>
        </ul>
      </div>

      {/* Right Section */}
      <div className="w-1/2 flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-left">Log in</h2>
          <p className="text-sm text-gray-600 mb-4 text-left">
            Sign in if you have an account in here.
          </p>

          {/* Error Message */}
          {error && <p className="text-red-500 text-center font-medium mb-4">{error}</p>}

          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
                Your Email
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

            {/* Password Input */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end mb-4">
              <a href="/reset-password" className="text-navy hover:underline font-bold">
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-navy text-white py-2 rounded-md hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          {/* Signup Link */}
          <p className="text-sm text-center text-gray-700 mt-4">
            Not a member?{" "}
            <a href="/signup" className="text-navy hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;