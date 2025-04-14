import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaStar } from "react-icons/fa";
import { FiStar } from "react-icons/fi";
import Header from "../components/header/header";
import axios from "axios";

const DoctorList = () => {
  const { specialty } = useParams();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Convert to singular form and capitalize
  const formattedSpecialty = specialty
    ?.replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/s$/, "") || "Doctor"; // Remove trailing "s" for singular

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/doctor/doc-specialty", {
          params: { specialty: formattedSpecialty },
        });
        // console.log("Data Info:", response);
        setDoctors(response.data.doctors || []);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        if (error.response) {
          console.log("Error response data:", error.response.data);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [specialty]);

  const handleDoctorClick = (doctor) => {
    navigate(`/doctor/${doctor.id}`);
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
          <h1 className="text-2xl font-bold text-gray-900 px-6">
            Top {formattedSpecialty} Results
          </h1>
          <p className="mt-2 text-gray-600 px-6">
            {doctors.length} {formattedSpecialty}s found
          </p>
        </div>
        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : (
          <div className="space-y-6">
            {doctors.length > 0 ? (
              doctors.map((doctor) => (
                <div
                  key={doctor.id}
                  onClick={() => handleDoctorClick(doctor)} // Make the entire card clickable
                  className="flex items-start p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 cursor-pointer mx-4" // Added mx-4 for left/right padding
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
                      {doctor.name}
                    </h2>
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
                      <span>{doctor.location}</span>
                    </div>
                    <p className="mt-2 text-gray-600 italic">
                      "{truncateText(doctor.about || 'No information provided.')}"
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent the card's onClick from firing when clicking the button
                      handleDoctorClick(doctor);
                    }}
                    className="ml-4 px-4 py-2 bg-navy text-white rounded-md font-medium hover:bg-blue-900 transition-all duration-300"
                  >
                    View Profile
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600 col-span-full">
                {/* No {formattedSpecialty.toLowerCase()} found. */}
                Try searching for a different specialty.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorList;