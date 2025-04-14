import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaStar } from "react-icons/fa";
import { FiStar } from "react-icons/fi";
import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import axios from "axios";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({
    symptoms: "",
    location: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const symptoms = params.get("symptoms") || "";
    const locationParam = params.get("location") || "";

    setSearchParams({
      symptoms,
      location: locationParam,
    });

    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!symptoms && !locationParam) {
          setDoctors([]);
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/doctor/search-doctor",
          {
            params: {
              symptoms,
              location: locationParam,
            },
          }
        );

        if (response.data.success) {
          setDoctors(response.data.data || []);
        } else {
          setError(response.data.message || "Failed to fetch doctors");
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setError(error.response?.data?.message || "Failed to search for doctors");
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchDoctors, 500); // Small delay for better UX
    return () => clearTimeout(timer);
  }, [location.search]);

  const getDoctorImage = (doctor) => {
    if (doctor.photo?.data) {
      return `data:${doctor.photo.contentType};base64,${doctor.photo.data}`;
    }
    return "https://via.placeholder.com/64";
  };

  const handleDoctorClick = (doctor) => {
    navigate(`/doctor/${doctor._id || doctor.id}`);
  };

  // Function to truncate the about text
  const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "....";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-navy/90 to-gray-800">
        <Header />
      </div>
      <div className="container mx-auto px-4 py-16">
        <div className="text-left mb-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-navy hover:text-navy/80 mb-4 px-6"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to search
          </button>
          <h1 className="text-2xl font-bold text-gray-900 px-6">
            Search Results
          </h1>
          <p className="mt-2 text-gray-600 px-6">
            {doctors.length} doctors found
            {searchParams.symptoms && (
              <span> for "{searchParams.symptoms}"</span>
            )}
            {searchParams.location && <span> in {searchParams.location}</span>}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-navy"></div>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium text-gray-700 mb-2">{error}</h3>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 px-6 py-2 bg-navy text-white rounded-md hover:bg-blue-900"
            >
              Try Again
            </button>
          </div>
        ) : doctors.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No doctors found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria
            </p>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-navy text-white rounded-md hover:bg-blue-900"
            >
              Back to Search
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {doctors.map((doctor) => (
              <div
                key={doctor._id || doctor.id}
                onClick={() => handleDoctorClick(doctor)}
                className="flex items-start p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 cursor-pointer mx-4"
              >
                <div className="relative">
                  <div className="flex-shrink-0 h-16 w-16 rounded-full bg-gray-200 overflow-hidden mx-auto mt-4">
                    {doctor.photo ? (
                      <img
                        src={`data:${doctor.photo.contentType};base64,${doctor.photo.data}`}
                        alt={doctor.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="h-full w-full bg-navy/10 flex items-center justify-center text-navy font-bold text-lg">
                        {doctor.name?.charAt(0) || "D"}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-navy/90">
                    {doctor.name || "Doctor Name"}
                  </h2>
                  <p className="text-gray-600">
                    {doctor.practice || "General Practice"}
                  </p>
                  <div className="flex items-center mt-1">
                    <FiStar className="text-yellow-400 fill-current" />
                    <span className="ml-1 text-gray-700">
                      {doctor.reviews?.averageRating
                        ? `${doctor.reviews.averageRating} (${doctor.reviews.totalReviews})`
                        : "No reviews"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-gray-700">
                    <FaMapMarkerAlt className="text-navy w-5 h-5" />
                    <span>{doctor.location || "City, State"}</span>
                  </div>
                  <p className="mt-2 text-gray-600 italic">
                    "{truncateText(doctor.about || 'No information provided.')}"
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDoctorClick(doctor);
                  }}
                  className="ml-4 px-4 py-2 bg-navy text-white rounded-md font-medium hover:bg-blue-900 transition-all duration-300"
                >
                  View Profile
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SearchResults;