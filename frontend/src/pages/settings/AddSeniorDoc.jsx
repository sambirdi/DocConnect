import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/auth";
import SidebarAdmin from "../../components/Sidebar/SidebarAdmin";
import AdminHeader from "../../components/header/adminHeader";
import { UserPlusIcon } from "@heroicons/react/24/outline";

const AddSeniorDoc = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    practice: "",
    location: "",
    licenseNo: "",
  });
  const [auth] = useAuth(); // Removed setAuth as it's not used
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/add-senior-doctor",
        formData,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      setSuccess(response.data.message);
      setFormData({
        name: "",
        email: "",
        phone: "",
        practice: "",
        location: "",
        licenseNo: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An error occurred while adding the doctor."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex">
      {/* Sidebar */}
      <SidebarAdmin />

      {/* Main Content */}
      <main className="flex-1 ml-64">
        <AdminHeader />

        {/* Form Section */}
        <div className="p-8 max-w-lg mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-full">
                <UserPlusIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Add Senior Doctor
              </h2>
            </div>

            {/* Feedback Messages */}
            {error && (
              <div
                className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center"
                role="alert"
              >
                <svg
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {error}
              </div>
            )}
            {success && (
              <div
                className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg flex items-center"
                role="alert"
              >
                <svg
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {success}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name 
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  placeholder="Dr. John Doe"
                  aria-required="true"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email 
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  placeholder="doctor@example.com"
                  aria-required="true"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone 
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  placeholder="+1234567890"
                  aria-required="true"
                />
              </div>

              <div>
                <label
                  htmlFor="practice"
                  className="block text-sm font-medium text-gray-700"
                >
                  Practice 
                </label>
                <input
                  id="practice"
                  name="practice"
                  type="text"
                  value={formData.practice}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  placeholder="Cardiology"
                  aria-required="true"
                />
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700"
                >
                  Location 
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  placeholder="New York, NY"
                  aria-required="true"
                />
              </div>

              <div>
                <label
                  htmlFor="licenseNo"
                  className="block text-sm font-medium text-gray-700"
                >
                  License Number 
                </label>
                <input
                  id="licenseNo"
                  name="licenseNo"
                  type="text"
                  value={formData.licenseNo}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  placeholder="123456"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2.5 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                aria-label={loading ? "Adding senior doctor" : "Add senior doctor"}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                      />
                    </svg>
                    Adding...
                  </span>
                ) : (
                  "Add Senior Doctor"
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddSeniorDoc;