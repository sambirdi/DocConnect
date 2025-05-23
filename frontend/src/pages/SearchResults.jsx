import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaStar } from "react-icons/fa";
import { FiStar } from "react-icons/fi";
import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import axios from "axios";
import Chatbot from '../components/chatbot/Chatbot';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({
    symptoms: "",
    location: "",
  });
  const [filters, setFilters] = useState({
    gender: "",
    experience: "",
    rating: "",
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
          setFilteredDoctors([]);
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/doctor/search-doctor",
          {
            params: {
              symptoms,
              location: locationParam,
              gender: filters.gender,
              experience: filters.experience,
              rating: filters.rating,
            },
          }
        );

        if (response.data.success) {
          const fetchedDoctors = response.data.data || [];
          setDoctors(fetchedDoctors);
          setFilteredDoctors(fetchedDoctors);
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

    const timer = setTimeout(fetchDoctors, 500);
    return () => clearTimeout(timer);
  }, [location.search, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getDoctorImage = (doctor) => {
    if (doctor.photo?.data) {
      return `data:${doctor.photo.contentType};base64,${doctor.photo.data}`;
    }
    return "https://via.placeholder.com/64";
  };

  const handleDoctorClick = (doctor) => {
    navigate(`/doctor/${doctor._id || doctor.id}`);
  };

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
            {filteredDoctors.length} doctors found
            {searchParams.symptoms && (
              <span> for "{searchParams.symptoms}"</span>
            )}
            {searchParams.location && <span> in {searchParams.location}</span>}
          </p>
        </div>

        <div className="mb-8 px-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={filters.gender}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-navy"
              >
                <option value="">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Experience
              </label>
              <select
                name="experience"
                value={filters.experience}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-navy"
              >
                <option value="">All Experience Levels</option>
                <option value="0-5">0-5 years</option>
                <option value="5-10">5-10 years</option>
                <option value="10-20">10-20 years</option>
                <option value="20-999">20+ years</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Rating
              </label>
              <select
                name="rating"
                value={filters.rating}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-navy"
              >
                <option value="">All Ratings</option>
                <option value="1">1+ Stars</option>
                <option value="2">2+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="4">4+ Stars</option>
              </select>
            </div>
          </div>
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
        ) : filteredDoctors.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No doctors found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or filters
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
            {filteredDoctors.map((doctor) => (
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
      <Chatbot />
    </div>
  );
};

export default SearchResults;