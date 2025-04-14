import React, { useRef, useState, useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import ReviewModal from '../../components/review/review';
import axios from 'axios';
import { useAuth } from '../../context/auth'; 

const Profile = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState("SUMMARY");
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [doctor, setDoctor] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [auth] = useAuth();
    const [editReview, setEditReview] = useState(null);
    const [isSticky, setIsSticky] = useState(false);

    const summaryRef = useRef(null);
    const reviewsRef = useRef(null);
    const locationRef = useRef(null);
    const navRef = useRef(null);

    // Fetch doctor data and reviews
    useEffect(() => {
        const fetchData = async () => {
            try {
                const doctorResponse = await axios.get(`http://localhost:5000/api/doctor/doc/${id}`);
                setDoctor(doctorResponse.data.doctor);

                const reviewsResponse = await axios.get(`http://localhost:5000/api/patient/doc-reviews/${id}`);
                if (reviewsResponse.data.success) {
                    setReviews(reviewsResponse.data.reviews);
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load profile or reviews. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    // Handle sticky navigation and prevent scroll interference
    useEffect(() => {
        const handleScroll = () => {
            if (isReviewOpen) return; // Skip when modal is open

            if (navRef.current) {
                const offsetTop = navRef.current.offsetTop;
                setIsSticky(window.scrollY > offsetTop);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isReviewOpen]);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isReviewOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isReviewOpen]);

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

    const handleReviewClick = () => {
        setEditReview(null);
        setIsReviewOpen(true);
    };

    const handleEditReviewClick = (review) => {
        setEditReview(review);
        setIsReviewOpen(true);
    };

    const handleDeleteReview = async (reviewId) => {
        if (!auth.token) {
            alert('Please log in to delete a review.');
            return;
        }

        if (!window.confirm('Are you sure you want to delete this review?')) return;

        try {
            await axios.delete(`http://localhost:5000/api/patient/reviews/${reviewId}`, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            setReviews((prevReviews) => prevReviews.filter((review) => review._id !== reviewId));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete review');
        }
    };

    const handleCloseReviewModal = () => {
        setIsReviewOpen(false);
        setEditReview(null);
    };

    const handleReviewSubmitted = (updatedReview) => {
        if (editReview) {
            // Update existing review
            setReviews((prevReviews) =>
                prevReviews.map((review) =>
                    review._id === updatedReview._id ? { ...review, ...updatedReview } : review
                )
            );
        } else {
            // Add new review
            setReviews((prevReviews) => [updatedReview, ...prevReviews]);
        }
    };

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
            <div className="bg-gradient-to-br from-navy/90 to-gray-800">
                <Header />
            </div>

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
                                <div>
                                    <div className="flex text-yellow-400 mb-1">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className={`text-2xl ${i < (reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0) ? "text-yellow-400" : "text-gray-300"}`}>
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-gray-600">{reviews.length} Ratings</p>
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
                            <p className="mt-2 text-gray-600 leading-relaxed">{doctor.about || "No description available."}</p>
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
                                            className={`border-b-2 px-1 py-4 text-sm font-medium ${
                                                activeTab === tab
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
                                            <button onClick={handleReviewClick} className="bg-navy text-white px-6 py-2 rounded-md border-2 border-navy hover:bg-transparent hover:text-navy">
                                                Write a Review
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-4 mb-4">
                                            <span className="text-6xl font-bold">{reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0'}</span>
                                            <div>
                                                <div className="flex text-yellow-400 mb-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <span key={i} className={`text-2xl ${i < (reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0) ? "text-yellow-400" : "text-gray-300"}`}>
                                                            ★
                                                        </span>
                                                    ))}
                                                </div>
                                                <p className="text-gray-600">{reviews.length} Ratings</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t pt-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xl font-semibold">{reviews.length || 0} RATINGS & REVIEWS</h3>
                                    </div>

                                    <div className="space-y-4">
                                        {reviews.length ? (
                                            reviews.map((review, index) => (
                                                <div
                                                    key={index}
                                                    className="rounded-2xl border border-gray-200 p-4 shadow-sm bg-white"
                                                >
                                                    <div className="flex items-center mb-2">
                                                        {[...Array(5)].map((_, i) => (
                                                            <span
                                                                key={i}
                                                                className={`text-lg ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                                                            >
                                                                ★
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <p className="text-gray-800 mb-3">{review.reviewText}</p>
                                                    <div className="text-sm text-gray-500 flex justify-between">
                                                        <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                                                        <span>By: {review.patientName}</span>
                                                    </div>
                                                    {auth.user?.name === review.patientName && (
                                                        <div className="mt-2 flex justify-end gap-2">
                                                            <button
                                                                onClick={() => handleEditReviewClick(review)}
                                                                className="p-1 text-navy hover:bg-navy/10 rounded-full focus:outline-none focus:ring-2 focus:ring-navy focus:ring-offset-1 transition-colors duration-150"
                                                                aria-label="Edit review"
                                                                title="Edit review"
                                                            >
                                                                <svg
                                                                    className="w-5 h-5"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="2"
                                                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                                    ></path>
                                                                </svg>
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteReview(review._id)}
                                                                className="p-1 text-red-600 hover:bg-red-600/10 rounded-full focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-1 transition-colors duration-150"
                                                                aria-label="Delete review"
                                                                title="Delete review"
                                                            >
                                                                <svg
                                                                    className="w-5 h-5"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="2"
                                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4M9 7v12m6-12v12M3 7h18"
                                                                    ></path>
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 italic text-center">No reviews yet.</p>
                                        )}
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
            <ReviewModal
                isOpen={isReviewOpen}
                onClose={handleCloseReviewModal}
                doctorId={id}
                onReviewSubmitted={handleReviewSubmitted}
                review={editReview}
                isEditMode={!!editReview}
            />
            <Footer />
        </div>
    );
};

export default Profile;