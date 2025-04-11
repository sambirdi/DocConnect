import React, { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/auth'; // Import useAuth
import axios from 'axios';
import ReviewModal from '../../components/review/review';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';

const Profile = () => {
  const { id } = useParams();
  const [auth] = useAuth(); // Get authentication data
  const [activeTab, setActiveTab] = useState("SUMMARY");
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [doctor, setDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null); // State for editing review
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Refs for sections
  const summaryRef = useRef(null);
  const reviewsRef = useRef(null);
  const locationRef = useRef(null);
  const navRef = useRef(null);

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

  // Handle review submission (add or update)
  const handleReviewSubmitted = (review, action) => {
    if (action === 'add') {
      setReviews([review, ...reviews]);
    } else if (action === 'update') {
      setReviews(reviews.map(r => r.id === review.id ? review : r));
    }
    setSelectedReview(null); // Clear selected review
    setIsReviewOpen(false); // Close modal
  };

  // Open modal for editing
  const handleEditReview = (review) => {
    setSelectedReview(review);
    setIsReviewOpen(true);
  };

  // Delete review
  const handleDeleteReview = async (reviewId) => {
    if (!auth?.token) {
      alert('Please log in to delete a review.');
      return;
    }
    try {
      const response = await axios.delete(`http://localhost:5000/api/patient/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      if (response.data.success) {
        setReviews(reviews.filter(r => r.id !== reviewId));
      }
    } catch (err) {
      console.error('Error deleting review:', err);
      alert('Failed to delete review. You may not have permission.');
    }
  };

  const handleCloseReviewModal = () => {
    setIsReviewOpen(false);
    setSelectedReview(null);
  };

  // Sticky navigation logic
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

  if (loading) return <div className="text-center py-16">Loading...</div>;
  if (error || !doctor) return <div className="text-center py-16 text-red-600">{error || "Doctor not found."}</div>;

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
                src={doctor.photo?.data ? `data:${doctor.photo.contentType};base64,${doctor.photo.data}` : "https://via.placeholder.com/64"}
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
                  Email: <a href={`mailto:${doctor.email}`} className="text-navy hover:underline">{doctor.email}</a>
                </p>
                <p className="text-gray-600">
                  Phone: <a href={`tel:${doctor.phone}`} className="text-navy hover:underline">{doctor.phone}</a>
                </p>
              </div>
            </div>
            <div className="border-b">
              <div ref={navRef} className="bg-white shadow-md">
                <div className="flex space-x-8 px-6">
                  {["SUMMARY", "PATIENT REVIEWS", "LOCATIONS"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => handleTabClick(tab)}
                      className={`border-b-2 px-1 py-4 text-sm font-medium ${activeTab === tab ? "border-blue-500 text-blue-500" : "border-transparent text-gray-500 hover:text-gray-700"}`}
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
                    Based on patient feedback. <a href="#" className="text-navy hover:underline">Read the reviews</a>
                  </p>
                </div>
              </div>
              <div className="border-t pt-6">
                <div ref={reviewsRef}>
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-semibold text-navy">{doctor.name}'s Ratings and Reviews</h2>
                    <button onClick={() => setIsReviewOpen(true)} className="bg-navy text-white px-6 py-2 rounded-md border-2 border-navy hover:bg-transparent hover:text-navy">
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
                  <div className="space-y-4">
                    {reviews.length ? (
                      reviews.map((review, index) => (
                        <div key={index} className="rounded-2xl border border-gray-200 p-4 shadow-sm bg-white">
                          <div className="flex items-center mb-2">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`text-lg ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}>
                                ★
                              </span>
                            ))}
                          </div>
                          <p className="text-gray-800 mb-3">{review.reviewText}</p>
                          <div className="text-sm text-gray-500 flex justify-between">
                            <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                            <span>By: {review.patientName}</span>
                          </div>
                          {auth?.user && review.patientId === auth.user._id && (
                            <div className="mt-2 flex gap-2">
                              <button onClick={() => handleEditReview(review)} className="text-blue-500 hover:underline">Edit</button>
                              <button onClick={() => handleDeleteReview(review.id)} className="text-red-500 hover:underline">Delete</button>
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
                      <a href="#" className="hover:underline">{doctor.practiceName}</a>
                    </h3>
                    <p className="text-gray-700">{doctor.location}</p>
                    <p className="text-gray-700">{doctor.city}, {doctor.state} {doctor.zipCode || ""}</p>
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
        reviewToEdit={selectedReview}
        onReviewSubmitted={handleReviewSubmitted}
      />
      <Footer />
    </div>
  );
};

export default Profile;