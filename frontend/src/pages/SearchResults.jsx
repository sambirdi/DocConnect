import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiStar, FiMapPin, FiArrowLeft } from "react-icons/fi";
import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import axios from "axios";
import { motion } from "framer-motion";

const SearchResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useState({
        symptoms: "",
        location: ""
    });

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const symptoms = params.get("symptoms") || "";
        const locationParam = params.get("location") || "";

        setSearchParams({
            symptoms,
            location: locationParam
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
                            location: locationParam
                        }
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
        return null;
    };

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: "easeOut" }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans antialiased ">
            <div className="bg-gradient-to-br from-navy/90 to-gray-800">
                <Header />
            </div>
            <main className="container mx-auto px-4 pt-8 pb-16">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-6xl mx-auto"
                >
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-navy hover:text-navy/80 mb-8"
                    >
                        <FiArrowLeft className="mr-2" />
                        Back to search
                    </button>

                    <motion.h1
                        {...fadeIn}
                        className="text-3xl md:text-4xl font-bold text-gray-900 mb-2"
                    >
                        Search Results
                    </motion.h1>
                    <motion.p
                        {...fadeIn}
                        transition={{ delay: 0.1 }}
                        className="text-gray-600 mb-8"
                    >
                        {searchParams.symptoms && (
                            <span>Showing results for "{searchParams.symptoms}"</span>
                        )}
                        {searchParams.location && (
                            <span> in {searchParams.location}</span>
                        )}
                    </motion.p>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-navy"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-16">
                            <h3 className="text-xl font-medium text-gray-700 mb-2">
                                {error}
                            </h3>
                            <button
                                onClick={() => navigate(-1)}
                                className="mt-4 px-6 py-2 bg-navy text-white rounded-lg hover:bg-navy/90"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : doctors.length === 0 ? (
                        <div className="text-center py-16">
                            <h3 className="text-xl font-medium text-gray-700 mb-2">
                                No doctors found
                            </h3>
                            <p className="text-gray-500 mb-4">
                                Try adjusting your search criteria
                            </p>
                            <button
                                onClick={() => navigate(-1)}
                                className="px-6 py-2 bg-navy text-white rounded-lg hover:bg-navy/90"
                            >
                                Back to Search
                            </button>
                        </div>
                    ) : (
                        <motion.div
                            {...fadeIn}
                            transition={{ delay: 0.2 }}
                            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                        >
                            {doctors.map((doctor) => (
                                <motion.div
                                    key={doctor._id || doctor.id}
                                    whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
                                >
                                    <div className="p-6">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 h-16 w-16 rounded-full bg-gray-200 overflow-hidden">
                                                {getDoctorImage(doctor) ? (
                                                    <img
                                                        src={getDoctorImage(doctor)}
                                                        alt={doctor.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-full w-full bg-navy/10 flex items-center justify-center text-navy font-bold">
                                                        {doctor.name?.charAt(0) || "D"}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-4">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {doctor.name || "Doctor Name"}
                                                </h3>
                                                <p className="text-gray-600">{doctor.practice || "General Practice"}</p>
                                                <div className="flex items-center mt-1">
                                                    <FiStar className="text-yellow-400 fill-current" />
                                                    <span className="ml-1 text-gray-700">
                                                        {doctor.reviews?.averageRating
                                                            ? `${doctor.reviews.averageRating} (${doctor.reviews.totalReviews})`
                                                            : "No reviews"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <div className="flex items-center text-gray-600">
                                                <FiMapPin className="mr-2" />
                                                <span>{doctor.location || "City, State"}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/doctor/${doctor._id || doctor.id}`)}
                                            className="mt-6 w-full bg-navy text-white py-2 px-4 rounded-lg hover:bg-navy/90 transition-colors"
                                        >
                                            View Profile
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default SearchResults;