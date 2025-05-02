import React, { useRef, useState, useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { FaSpinner, FaMapMarkerAlt, FaEdit, FaTrash, FaQuestionCircle, FaGraduationCap, FaBriefcase, FaAward, FaLanguage, FaMapMarkedAlt, FaFlag } from 'react-icons/fa';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import ReviewModal from '../../components/review/review';
import axios from 'axios';
import { useAuth } from '../../context/auth';
import { toast } from 'react-hot-toast';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

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
    const [flagDialog, setFlagDialog] = useState({
        isOpen: false,
        review: null,
        reason: '',
        otherReason: '',
    });
    const [deleteDialog, setDeleteDialog] = useState({
        isOpen: false,
        reviewId: null
    });

    const calculateAverageRating = (reviews) => {
        if (!reviews || reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
        return sum / reviews.length;
    };

    const formatRating = (rating) => {
        return Number(rating).toFixed(1);
    };

    const summaryRef = useRef(null);
    const reviewsRef = useRef(null);
    const locationRef = useRef(null);
    const navRef = useRef(null);
    const faqsRef = useRef(null);

    // Add new state for FAQs
    const [faqs, setFaqs] = useState([
        {
            question: "What are your consultation hours?",
            answer: "Monday to Friday: 9:00 AM - 5:00 PM, Saturday: 9:00 AM - 1:00 PM"
        },
        {
            question: "Do you provide online consultations?",
            answer: "Online consultations may be available depending on the doctor. Please contact the doctor's office directly for details."
        },
        {
            question: "What insurance providers do you accept?",
            answer: "We accept most major insurance providers. Please contact our office for details."
        },
        {
            question: "How can I book an appointment?",
            answer: "DocConnect is a doctor recommendation system. To book an appointment, please contact the doctor's office directly or visit the hospital."
        }
    ]);

    // Update the Location Section with proper API key handling
    // const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

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
            case "FAQS":
                targetRef = faqsRef;
                break;
            case "PROFESSIONAL INFO":
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
            toast.error('Please log in to delete a review.');
            return;
        }

        setDeleteDialog({
            isOpen: true,
            reviewId: reviewId
        });
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/patient/reviews/${deleteDialog.reviewId}`, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            setReviews((prevReviews) => prevReviews.filter((review) => review._id !== deleteDialog.reviewId));
            toast.success('Review deleted successfully');
            setDeleteDialog({ isOpen: false, reviewId: null });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete review');
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

    const handleFlagClick = (review) => {
        if (!auth?.user) {
            toast.error('Please log in to report a review');
            return;
        }

        if (auth?.user?.name === review.patientName) {
            toast.error('You cannot report your own review');
            return;
        }

        setFlagDialog({
            isOpen: true,
            review,
            reason: '',
            otherReason: '',
        });
    };

    const handleFlagSubmit = async () => {
        if (!flagDialog.reason) {
            toast.error('Please select a reason for reporting');
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:5000/api/reviews/flag/${id}`,
                {
                    reviewId: flagDialog.review._id,
                    reason: flagDialog.reason === 'Other' ? flagDialog.otherReason : flagDialog.reason,
                    reporterRole: auth?.user?.role,
                    reporterId: auth?.user?._id,
                },
                {
                    headers: { Authorization: `Bearer ${auth.token}` },
                }
            );

            if (response.data.success) {
                toast.success('Review has been reported for admin review');
                setFlagDialog({ isOpen: false, review: null, reason: '', otherReason: '' });
            }
        } catch (err) {
            console.error('Error flagging review:', err);
            toast.error(err.response?.data?.message || 'Failed to report review');
        }
    };

    const renderReviewActions = (review) => {
        const isOwnReview = auth?.user?.name === review.patientName;

        return (
            <div className="flex items-center gap-2">
                {isOwnReview ? (
                    <>
                        <button
                            onClick={() => handleEditReviewClick(review)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit Review"
                        >
                            <FaEdit />
                        </button>
                        <button
                            onClick={() => handleDeleteReview(review._id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete Review"
                        >
                            <FaTrash />
                        </button>
                    </>
                ) : (
                    auth?.user && (
                        <button
                            onClick={() => handleFlagClick(review)}
                            className="text-gray-600 hover:text-red-600"
                            title="Report Review"
                        >
                            <FaFlag />
                        </button>
                    )
                )}
            </div>
        );
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

    // Map configuration
    const GOOGLE_MAPS_API_KEY = "AIzaSyCR_7wZGIOrt6R-L1ff_aG8hVq3TTuAao4";
    const mapContainerStyle = {
        width: '100%',
        height: '400px',
    };
    const defaultCenter = {
        lat: 27.7172, // Default to Kathmandu if no coordinates
        lng: 85.3240,
    };

    // Determine map center based on latitude and longitude
    // const mapCenter = doctor.latitude && doctor.longitude
    //     ? { lat: doctor.latitude, lng: doctor.longitude }
    //     : defaultCenter;

    const isValidCoordinates = doctor.latitude && doctor.longitude && !isNaN(doctor.latitude) && !isNaN(doctor.longitude);
    const mapCenter = isValidCoordinates
        ? { lat: doctor.latitude, lng: doctor.longitude }
        : null;    

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <div className="bg-navy">
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
                                            <span key={i} className={`text-2xl ${i < Math.round(calculateAverageRating(reviews)) ? "text-yellow-400" : "text-gray-300"}`}>
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-gray-600">{reviews.length} {reviews.length === 1 ? 'Rating' : 'Ratings'}</p>
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
                                <div className="flex space-x-8 px-6 overflow-x-auto">
                                    {["SUMMARY", "PATIENT REVIEWS", "LOCATIONS", "FAQS", "PROFESSIONAL INFO"].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => handleTabClick(tab)}
                                            className={`border-b-2 px-1 py-4 text-sm font-medium whitespace-nowrap ${activeTab === tab
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
                            {activeTab === "SUMMARY" && (
                                <div ref={summaryRef}>
                                    <h2 className="text-2xl font-semibold text-navy mb-6">Quick Facts</h2>
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="bg-gray-50 rounded-lg p-6">
                                            <h3 className="text-xl font-semibold text-navy mb-4">Professional Information</h3>
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <FaGraduationCap className="text-navy/80" />
                                                    <div>
                                                        <p className="font-medium">Education</p>
                                                        <p className="text-gray-600">{doctor.qualification}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <FaBriefcase className="text-navy/80" />
                                                    <div>
                                                        <p className="font-medium">Experience</p>
                                                        <p className="text-gray-600">{doctor.experience} years</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <FaAward className="text-navy/80" />
                                                    <div>
                                                        <p className="font-medium">License</p>
                                                        <p className="text-gray-600">{doctor.licenseNo}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-6">
                                            <h3 className="text-xl font-semibold text-navy mb-4">Practice Information</h3>
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <FaMapMarkerAlt className="text-navy/80" />
                                                    <div>
                                                        <p className="font-medium">Location</p>
                                                        <p className="text-gray-600">{doctor.location}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <FaBriefcase className="text-navy/80" />
                                                    <div>
                                                        <p className="font-medium">Institution</p>
                                                        <p className="text-gray-600">{doctor.workplace}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <FaLanguage className="text-navy/80" />
                                                    <div>
                                                        <p className="font-medium">Languages</p>
                                                        <p className="text-gray-600">English, Nepali</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "LOCATIONS" && (
                                <div ref={locationRef} className="space-y-6">
                                    <h2 className="text-2xl font-semibold text-navy mb-4">Practice Location</h2>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-4">
                                            <FaMapMarkerAlt className="text-navy/80" />
                                            <span className="font-medium">{doctor.workplace}</span>
                                        </div>
                                        <div className="h-96 w-full rounded-lg overflow-hidden" aria-label={`Map showing location of ${doctor.workplace}`}>
                                            {loadMap && GOOGLE_MAPS_API_KEY && isValidCoordinates ? (
                                                <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
                                                    <GoogleMap
                                                        mapContainerStyle={mapContainerStyle}
                                                        center={mapCenter}
                                                        zoom={15}
                                                        aria-label={`Map centered at ${doctor.workplace}`}
                                                    >
                                                        <Marker
                                                            position={mapCenter}
                                                            onClick={() => window.open(`https://www.google.com/maps?q=${doctor.latitude},${doctor.longitude}`, '_blank')}
                                                        />
                                                    </GoogleMap>
                                                </LoadScript>
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500" role="alert">
                                                    <p>{isValidCoordinates ? "Map is loading..." : "Doctor’s location is not available."}</p>
                                                </div>
                                            )}
                                        </div>
                                        {isValidCoordinates && (
                                            <a
                                                href={`https://www.google.com/maps?q=${doctor.latitude},${doctor.longitude}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-navy hover:underline mt-2 inline-block"
                                            >
                                                Get Directions
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === "FAQS" && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-semibold text-navy mb-4">Frequently Asked Questions</h2>
                                    <div className="space-y-4">
                                        {faqs.map((faq, index) => (
                                            <div key={index} className="bg-gray-50 rounded-lg p-4">
                                                <h3 className="text-lg font-medium text-navy mb-2">{faq.question}</h3>
                                                <p className="text-gray-600">{faq.answer}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === "PROFESSIONAL INFO" && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-semibold text-navy mb-4">Professional Details</h2>
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="bg-gray-50 rounded-lg p-6">
                                            <h3 className="text-xl font-semibold text-navy mb-4">Education & Training</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="font-medium">Medical School</p>
                                                    <p className="text-gray-600">{doctor.institution}</p>
                                                </div>
                                                <div>
                                                    <p className="font-medium">Residency</p>
                                                    <p className="text-gray-600">{doctor.workplace}</p>
                                                </div>
                                                <div>
                                                    <p className="font-medium">Board Certification</p>
                                                    <p className="text-gray-600">{doctor.licenseNo}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-6">
                                            <h3 className="text-xl font-semibold text-navy mb-4">Practice Details</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="font-medium">Specialization</p>
                                                    <p className="text-gray-600">{doctor.practice}</p>
                                                </div>
                                                <div>
                                                    <p className="font-medium">Years of Experience</p>
                                                    <p className="text-gray-600">{doctor.experience} years</p>
                                                </div>
                                                <div>
                                                    <p className="font-medium">Current Practice</p>
                                                    <p className="text-gray-600">{doctor.workplace}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

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
                                            <span className="text-6xl font-bold">{formatRating(calculateAverageRating(reviews))}</span>
                                            <div>
                                                <div className="flex text-yellow-400 mb-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <span key={i} className={`text-2xl ${i < Math.round(calculateAverageRating(reviews)) ? "text-yellow-400" : "text-gray-300"}`}>
                                                            ★
                                                        </span>
                                                    ))}
                                                </div>
                                                <p className="text-gray-600">{reviews.length} {reviews.length === 1 ? 'Rating' : 'Ratings'}</p>
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
                                            reviews.map((review) => (
                                                <div key={review._id} className="mb-6 rounded-lg border bg-white p-4 shadow-sm">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <h4 className="font-semibold">{review.patientName}</h4>
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex">
                                                                    {[...Array(5)].map((_, index) => (
                                                                        <span
                                                                            key={index}
                                                                            className={`text-lg ${index < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                                                                }`}
                                                                        >
                                                                            ★
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                                <span className="text-sm text-gray-600">
                                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {renderReviewActions(review)}
                                                    </div>
                                                    <p className="mt-2 text-gray-700">{review.reviewText}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-center text-gray-500 py-4">No reviews yet. Be the first to review!</p>
                                        )}
                                    </div>
                                </div>

                                {/* Location Section */}
                                <div ref={locationRef} className="border-t pt-6 mt-8">
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-semibold text-navy mb-4">Practice Location</h2>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-4">
                                                <FaMapMarkedAlt className="text-navy/80" />
                                                <span className="font-medium">{doctor?.workplace}</span>
                                            </div>
                                            <div className="h-96 w-full rounded-lg overflow-hidden">
                                                {GOOGLE_MAPS_API_KEY ? (
                                                    <iframe
                                                        src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(doctor?.workplace || '')}`}
                                                        width="100%"
                                                        height="100%"
                                                        style={{ border: 0 }}
                                                        allowFullScreen=""
                                                        loading="lazy"
                                                        referrerPolicy="no-referrer-when-downgrade"
                                                    ></iframe>
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
                                                        <p>Map loading is currently unavailable. Please check back later.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* FAQs Section */}
                                <div ref={faqsRef} className="border-t pt-6 mt-8">
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-semibold text-navy mb-4">Frequently Asked Questions</h2>
                                        <div className="space-y-4">
                                            {faqs.map((faq, index) => (
                                                <div key={index} className="bg-gray-50 rounded-lg p-4">
                                                    <h3 className="text-lg font-medium text-navy/90 mb-2">{faq.question}</h3>
                                                    <p className="text-gray-600">{faq.answer}</p>
                                                </div>
                                            ))}
                                        </div>
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
            {/* Flag Review Dialog */}
            {flagDialog.isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-semibold">Report Inappropriate Review</h3>
                            <button
                                onClick={() => setFlagDialog({ isOpen: false, review: null, reason: '', otherReason: '' })}
                                className="p-1 text-gray-400 hover:text-gray-600 rounded-full transition-colors duration-200"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="mb-4">
                            <p className="text-gray-600 mb-2">Review being reported:</p>
                            <div className="bg-gray-50 p-4 rounded-md">
                                <div className="flex items-center mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <span
                                            key={i}
                                            className={`text-sm ${i < flagDialog.review?.rating ? "text-yellow-400" : "text-gray-300"}`}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                                <p className="text-sm text-gray-700 mb-2">{flagDialog.review?.reviewText}</p>
                                <div className="text-xs text-gray-500 flex items-center gap-2">
                                    <span>By: {flagDialog.review?.patientName}</span>
                                    <span>•</span>
                                    <span>{new Date(flagDialog.review?.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Reason for reporting
                            </label>
                            <select
                                value={flagDialog.reason}
                                onChange={(e) => setFlagDialog(prev => ({ ...prev, reason: e.target.value }))}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select a reason</option>
                                <option value="Spam">Spam or Advertising</option>
                                <option value="Inappropriate Content">Inappropriate Content</option>
                                <option value="Harassment">Harassment or Bullying</option>
                                <option value="False Information">False or Misleading Information</option>
                                <option value="Hate Speech">Hate Speech</option>
                                <option value="Personal Attack">Personal Attack</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        {flagDialog.reason === 'Other' && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Please provide additional details
                                </label>
                                <textarea
                                    value={flagDialog.otherReason}
                                    onChange={(e) => setFlagDialog(prev => ({ ...prev, otherReason: e.target.value }))}
                                    placeholder="Please explain why you're reporting this review..."
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="3"
                                />
                            </div>
                        )}
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setFlagDialog({ isOpen: false, review: null, reason: '', otherReason: '' })}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-all duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleFlagSubmit}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all duration-200 flex items-center gap-2"
                            >
                                <FaFlag className="w-4 h-4" />
                                Report Review
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Delete Confirmation Dialog */}
            {deleteDialog.isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                        <h3 className="text-xl font-semibold mb-4">Delete Review</h3>
                        <p className="text-gray-600 mb-6">Are you sure you want to delete this review? This action cannot be undone.</p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteDialog({ isOpen: false, reviewId: null })}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default Profile;