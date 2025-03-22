import React, { useRef, useState, useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom'; // Added useParams
import { FaBell } from 'react-icons/fa';
import Footer from '../../components/footer/footer';
import axios from 'axios'; // Added axios
import ReviewModal from '../../components/review/review';

const Profile = () => {
    const { id } = useParams(); // Get the doctor ID from the URL
    const [activeTab, setActiveTab] = useState("SUMMARY");
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [doctor, setDoctor] = useState(null); // State for fetched doctor data
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    // Create references for sections
    const summaryRef = useRef(null);
    const reviewsRef = useRef(null);
    const locationRef = useRef(null);
    const navRef = useRef(null);

    // Fetch doctor data from the backend
    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/doctor/doc/${id}`);
                setDoctor(response.data.doctor);
            } catch (err) {
                console.error("Error fetching doctor:", err);
                setError("Failed to load doctor details. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchDoctor();
    }, [id]);

    // Handle sticky navigation
    useEffect(() => {
        const handleScroll = () => {
            if (navRef.current) {
                const offsetTop = navRef.current.offsetTop;
                if (window.scrollY > offsetTop) {
                    navRef.current.classList.add("sticky-nav");
                } else {
                    navRef.current.classList.remove("sticky-nav");
                }
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        let targetRef;
        switch (tab) {
            case "SUMMARY":
                targetRef = summaryRef;
                break;
            case "PATIENT REVIEWS":
                targetRef = reviewsRef;
                break;
            case "LOCATIONS":
                targetRef = locationRef;
                break;
            default:
                return;
        }
        targetRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Track the sticky navigation state
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (navRef.current) {
                const offsetTop = navRef.current.offsetTop;
                setIsSticky(window.scrollY > offsetTop);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleReviewClick = () => {
        setIsReviewOpen(true);
    };

    const handleCloseReviewModal = () => {
        setIsReviewOpen(false);
    };

    // Show loading or error states if applicable
    if (loading) {
        return <div className="text-center py-16">Loading...</div>;
    }

    if (error || !doctor) {
        return (
            <div className="text-center py-16 text-red-600">
                {error || "Doctor not found."}
            </div>
        );
    }

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            {/* Navbar */}
            <div className="bg-gradient-to-br from-navy/90 to-gray-800">
                <Header />
            </div>

            {/* Doctor Profile Section */}
            <main className="container mx-auto px-4 py-8">
                <div className="overflow-hidden rounded-lg bg-white shadow-md">
                    <div className="border-b bg-navye-50 p-6">
                        <div className="flex flex-col items-start gap-6 md:flex-row">
                            <img
                                src={
                                    doctor.photo?.data
                                        ? `data:${doctor.photo.contentType};base64,${doctor.photo.data}`
                                        : "https://via.placeholder.com/64"
                                }
                                alt={doctor.name}
                                className="h-48 w-48 rounded-lg border-4 border-white object-cover shadow-lg"
                            />
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-navy">{doctor.name}</h1>
                                <p className="mt-2 text-lg text-gray-600">{doctor.practice}</p>
                                {/* <p className="mt-1 text-gray-500">{doctor.city}, {doctor.state}</p> */}
                                <div className="mt-4 flex items-center gap-2">
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className={`text-2xl ${i < doctor.rating ? "text-yellow-400" : "text-gray-300"}`}>
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-500">({doctor.reviewsCount} reviews)</span>
                                </div>
                                <div className="mt-4 flex flex-wrap gap-4">
                                    {doctor.status === "Open Now" && (
                                        <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                                            ● Open Now
                                        </span>
                                    )}
                                    {doctor.acceptingPatients && (
                                        <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                                            ✓ Accepting New Patients
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col gap-4">
                                {/* Add buttons if needed */}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6 p-6">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">About</h2>
                            <p className="mt-2 text-gray-600 leading-relaxed">{doctor.description}</p>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Contact Information</h2>
                            <div className="mt-2 space-y-2">
                                <p className="text-gray-600">
                                    Email:{" "}
                                    <a href={`mailto:${doctor.email}`} className="text-navy hover:underline">
                                        {doctor.email}
                                    </a>
                                </p>
                                <p className="text-gray-600">
                                    Phone:{" "}
                                    <a href={`tel:${doctor.phone}`} className="text-navy hover:underline">
                                        {doctor.phone}
                                    </a>
                                </p>
                            </div>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="border-b">
                            <div
                                ref={navRef}
                                className={`bg-white shadow-md ${isSticky ? "fixed top-0 left-0 w-full z-50" : ""}`}
                            >
                                <div className="flex space-x-8 px-6">
                                    {["SUMMARY", "PATIENT REVIEWS", "LOCATIONS"].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => handleTabClick(tab)}
                                            className={`border-b-2 px-1 py-4 text-sm font-medium ${activeTab === tab
                                                ? "border-blue-500 text-blue-500"
                                                : "border-transparent text-gray-500 hover:text-gray-700"
                                                }`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-8 p-6">
                            {/* Quick Facts Section */}
                            <div ref={summaryRef}>
                                <h2 className="text-2xl font-semibold text-navy">Quick Facts</h2>
                                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    <div className="flex items-center gap-3">
                                        <span className="text-navy-600">📅</span>
                                        <span>{doctor.quickFacts?.experience || "Not specified"}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-navy">💼</span>
                                        <span>{doctor.quickFacts?.expertise || 0} Areas Of Expertise</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-navy">🏥</span>
                                        <span>{doctor.quickFacts?.hospitalAffiliations || 0} Hospital Affiliation</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-navy">🏫</span>
                                        <span>{doctor.quickFacts?.medicalCenter || "Not specified"}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-navy">👨‍⚕️</span>
                                        <span>{doctor.quickFacts?.specialties || 0} Specialties</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-navy">📍</span>
                                        <span>{doctor.quickFacts?.locations || 0} Location</span>
                                    </div>
                                </div>
                            </div>
                            {/* Patients' Perspective Section */}
                            <div>
                                <h2 className="text-2xl font-semibold text-navy">Patients' Perspective</h2>
                                <div className="mt-4 space-y-3">
                                    {doctor.patientPerspective?.onTime && (
                                        <div className="flex items-center gap-2 text-green-600">
                                            <span>✓</span>
                                            <span>On-time consultations</span>
                                        </div>
                                    )}
                                    {doctor.patientPerspective?.bedsideManner && (
                                        <div className="flex items-center gap-2 text-green-600">
                                            <span>✓</span>
                                            <span>Good bedside manner</span>
                                        </div>
                                    )}
                                    <p className="mt-4 text-sm text-gray-600">
                                        Based on patient feedback.{" "}
                                        <a href="#" className="text-navy hover:underline">
                                            Read the reviews
                                        </a>
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="border-t pt-6">
                                    <div ref={reviewsRef}>
                                        <div className="flex justify-between items-start mb-4">
                                            <h2 className="text-2xl font-semibold text-navy">{doctor.name}'s Ratings and Reviews</h2>
                                            <button onClick={handleReviewClick} className="bg-navy text-white px-6 py-2 rounded-md border-2 border-transparent hover:bg-transparent hover:text-navy hover:border-navy">
                                                Write a Review
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-4 mb-4">
                                            <span className="text-6xl font-bold">{doctor.reviews?.overall || 0}</span>
                                            <div>
                                                <div className="flex text-yellow-400 mb-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <span
                                                            key={i}
                                                            className={`text-2xl ${i < (doctor.reviews?.overall || 0) ? "text-yellow-400" : "text-gray-300"}`}
                                                        >
                                                            ★
                                                        </span>
                                                    ))}
                                                </div>
                                                <p className="text-gray-600">
                                                    {doctor.reviews?.totalRatings || 0} Ratings
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t pt-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-semibold">{doctor.reviews?.totalRatings || 0} RATINGS & REVIEWS</h3>
                                    </div>

                                    <div className="space-y-6">
                                        {(doctor.reviews?.reviewList || []).map((review, index) => (
                                            <div key={index} className="border-b pb-6">
                                                <div className="flex text-yellow-400 mb-2">
                                                    {[...Array(5)].map((_, i) => (
                                                        <span key={i} className={`${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}>
                                                            ★
                                                        </span>
                                                    ))}
                                                </div>
                                                <p className="text-gray-600 mb-2">{review.date}</p>
                                                <p className="text-gray-700">{review.comment}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div ref={locationRef}>
                                    <h2 className="text-2xl font-semibold text-navy">Location</h2>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-semibold text-navy">
                                            <a href="#" className="hover:underline">
                                                {doctor.practiceName}
                                            </a>
                                        </h3>
                                        <p className="text-gray-700">{doctor.location}</p>
                                        <p className="text-gray-700">
                                            {doctor.city}, {doctor.state} {doctor.zipCode || ""}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            {/* Review Modal */}
            <ReviewModal isOpen={isReviewOpen} onClose={handleCloseReviewModal} />
            <Footer />
        </div>
    );
};

export default Profile;