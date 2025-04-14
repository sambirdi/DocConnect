import React, { useState, useCallback } from 'react';
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
    experience: "",
    about: "",
  });
  const [photo, setPhoto] = useState(null);
  const [auth] = useAuth();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  // Handle text input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  // Handle photo file input
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file (e.g., PNG, JPEG).");
        setPhoto(null);
        setPreview(null);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should not exceed 5MB.");
        setPhoto(null);
        setPreview(null);
        return;
      }
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPhoto(null);
      setPreview(null);
    }
  };

  // Handle form submission
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (loading) return; // Prevent multiple submissions

      setLoading(true);
      setError("");
      setSuccess("");

      // Validate required fields
      if (
        !formData.name ||
        !formData.email ||
        !formData.phone ||
        !formData.practice ||
        !formData.location ||
        !formData.licenseNo
      ) {
        setError("All required fields must be filled.");
        setLoading(false);
        return;
      }

      // Create FormData
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("practice", formData.practice);
      data.append("location", formData.location);
      data.append("licenseNo", formData.licenseNo);
      data.append("about", formData.about);
      if (photo) {
        data.append("photo", photo);
      }

      try {
        const response = await axios.post(
          "http://localhost:5000/api/admin/add-senior-doctor",
          data,
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
          experience: "",
          about: "",
        });
        setPhoto(null);
        setPreview(null);
        // Reset file input
        if (document.getElementById("photo")) {
          document.getElementById("photo").value = "";
        }
      } catch (err) {
        console.error("Submission error:", err);
        setError(
          err.response?.data?.message ||
            "An error occurred while adding the doctor."
        );
      } finally {
        setLoading(false);
      }
    },
    [formData, photo, auth.token, loading]
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <SidebarAdmin />

      {/* Main Content */}
      <main className="flex-1 ml-64">
        <AdminHeader />

        {/* Form Section */}
        <div className="p-8 w-full max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-10">
            <div className="flex items-center space-x-4 mb-8">
              <div className="p-3 bg-blue-100 rounded-full">
                <UserPlusIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                Add Senior Doctor
              </h2>
            </div>

            {/* Feedback Messages */}
            {error && (
              <div
                className="mb-6 p-4 bg-red-50 text-red-800 rounded-lg flex items-center"
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
                className="mb-6 p-4 bg-green-50 text-green-800 rounded-lg flex items-center"
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
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Dr. John Doe"
                    aria-required="true"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="doctor@example.com"
                    aria-required="true"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="+977 XXXXXXXXXX"
                    aria-required="true"
                  />
                </div>

                <div>
                  <label
                    htmlFor="practice"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Practice <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="practice"
                    name="practice"
                    type="text"
                    value={formData.practice}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Cardiology"
                    aria-required="true"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="New York, NY"
                    aria-required="true"
                  />
                </div>

                <div>
                  <label
                    htmlFor="experience"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Experience <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="experience"
                    name="experience"
                    type="text"
                    value={formData.experience}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="XX Years"
                    aria-required="true"
                  />
                </div>


                <div>
                  <label
                    htmlFor="licenseNo"
                    className="block text-sm font-medium text-gray-700"
                  >
                    License Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="licenseNo"
                    name="licenseNo"
                    type="text"
                    value={formData.licenseNo}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="NPXXX"
                    aria-required="true"
                  />
                </div>

                <div>
                  <label
                    htmlFor="photo"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Photo (Optional)
                  </label>
                  <input
                    id="photo"
                    name="photo"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition duration-200"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Upload a PNG or JPEG image (max 5MB).
                  </p>
                  {preview && (
                    <div className="mt-4">
                      <img
                        src={preview}
                        alt="Photo preview"
                        className="h-40 w-40 object-cover rounded-lg shadow-sm"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="col-span-1 lg:col-span-2">
                <label
                  htmlFor="about"
                  className="block text-sm font-medium text-gray-700"
                >
                  About
                </label>
                <textarea
                  id="about"
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  placeholder="Describe the doctor's expertise and experience..."
                  rows="5"
                />
              </div>

              <div className="col-span-1 lg:col-span-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ${
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
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddSeniorDoc;