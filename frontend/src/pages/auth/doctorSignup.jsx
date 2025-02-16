import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ListYourPractice = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    practice: "",
    location: "",
    password: "",
    licenseNo: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await axios.post("http://localhost:5000/api/auth/docregister", formData);
      setMessage("Your practice has been successfully listed!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        practice: "",
        location: "",
        password: "",
        licenseNo:"",
      });

      // Redirect to login page after success
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Failed to list your practice. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen overflow-auto">
      {/* Left Section */}
      <div className="w-full sm:w-1/2 bg-navy text-white flex flex-col items-center justify-center px-12 py-8">
        <h1 className="text-4xl font-bold mb-4">DocConnect</h1>
        <ul className="space-y-4 text-lg">
          <li className="flex items-center">
            <p className="text-lg font-medium italic">
              List your practice and connect with patients today.
            </p>
          </li>
        </ul>
      </div>

      {/* Right Section */}
      <div className="w-full sm:w-1/2 flex items-center justify-center bg-gray-50 px-8 py-12">
        <div className="w-full max-w-md space-y-6">
          <h2 className="text-3xl font-bold text-gray-800">List Your Practice</h2>
          <p className="text-sm text-gray-600">
            Register your practice to connect with patients.
          </p>

          {/* Success and Error Messages */}
          {message && (
            <p className="text-green-500 text-center font-medium">{message}</p>
          )}
          {error && (
            <p className="text-red-500 text-center font-medium">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First and Last Name */}
            <div className="flex flex-col sm:flex-row sm:space-x-4">
              <div className="w-full">
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
                  placeholder="John Doe"
                  required
                />
              </div>

            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="example@domain.com"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-gray-700 font-medium mb-1"
              >
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="+977-9876543210"
                required
              />
            </div>

            {/* Practice */}
            <div>
              <label
                htmlFor="practice"
                className="block text-gray-700 font-medium mb-1"
              >
                Practice/Speciality
              </label>
              <input
                type="text"
                id="practice"
                name="practice"
                value={formData.practice}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Dermatology"
                required
              />
            </div>
            {/* License NO */}
            <div>
              <label
                htmlFor="licenseNo"
                className="block text-gray-700 font-medium mb-1"
              >
                License No.
              </label>
              <input
                type="text"
                id="licenseNo"
                name="licenseNo"
                value={formData.licenseNo}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="XXXXXX"
                required
              />
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="block text-gray-700 font-medium mb-1"
              >
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Kathmandu, Nepal"
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
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-navy text-white py-3 rounded-md hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
          <p className="text-sm text-center text-gray-700">
            Already have an account?{" "}
            <a href="/login" className="text-navy hover:underline">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ListYourPractice;