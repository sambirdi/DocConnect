import React, { useEffect, useState } from "react";
import { FiSearch, FiMapPin, FiCpu, FiShield, FiStar, FiMessageSquare } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import Footer from "../components/footer/footer";
import Header from "../components/header/header";
import { motion } from "framer-motion";
//import SearchResults from "../pages/SearchResults"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Chatbot from '../components/chatbot/Chatbot';

const imgPath = require("../images/home1.png");

export const features = [
  { title: "AI-Powered Recommendations", description: "Our advanced AI suggests the best doctors based on your needs.", icon: FiCpu },
  { title: "Verified Doctors", description: "We ensure all listed doctors are verified professionals.", icon: FiShield },
  { title: "Doctor Reviews & Ratings", description: "See reviews and ratings from other patients.", icon: FiStar },
  { title: "Quick Chat Support", description: "Have questions? Our chatbot is here to assist you anytime.", icon: FiMessageSquare },
];

export const specializations = [
  {
    name: "Primary Care Physicians",
    id: "primary-care-physicians",
    altId: "general-physician",
    icon: "https://img.icons8.com/ios-filled/100/0A2647/stethoscope.png",
  },
  { name: "Psychiatrists", id: "psychiatrists", icon: "https://img.icons8.com/ios-filled/100/0A2647/brain.png" },
  { name: "Dentists", id: "dentists", icon: "https://img.icons8.com/ios-filled/100/0A2647/tooth.png" },
  { name: "OBGYNs", id: "obgyns", icon: "https://img.icons8.com/ios-filled/100/0A2647/pregnant.png" },
  { name: "Dermatologists", id: "dermatologists", icon: "https://img.icons8.com/ios-filled/100/0A2647/skin.png" },
  { name: "Ophthalmologists", id: "ophthalmologists", icon: "https://img.icons8.com/ios-filled/100/0A2647/glasses.png" },
];

const testimonials = [
  { name: "Sarah M.", role: "Patient", text: "DocConnect made finding a specialist so easy! The recommendations were spot-on.", rating: 5 },
  { name: "Dr. John K.", role: "Physician", text: "As a doctor, I appreciate how this platform connects me with patients who need my expertise.", rating: 4.5 },
  { name: "Emily R.", role: "Patient", text: "The chatbot support was a lifesaver when I had questions late at night.", rating: 5 },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState({
    symptoms: "",
    location: "",
  });
  const [featuredDoctors, setFeaturedDoctors] = useState([]);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  // Fetch recent doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/doctor/all-doctors`);
        setFeaturedDoctors(response.data.doctors); // Use the 4 most recent doctors directly
      } catch (error) {
        console.error("Error fetching recent doctors:", error);
      }
    };
    fetchDoctors();
  }, []);

  const handleSearch = () => {
    if (!searchInput.symptoms && !searchInput.location) return;

    navigate(`/search-results?symptoms=${encodeURIComponent(searchInput.symptoms)}&location=${encodeURIComponent(searchInput.location)}`);
  };

  // Handle Enter key press for search
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Enhanced Hero Section */}
      <div className="relative h-[85vh] bg-gradient-to-br from-navy/90 to-gray-700">
        <div className="absolute inset-0 z-0">
          <img
            src="https://img.freepik.com/free-photo/medical-banner-with-doctor-wearing-goggles_23-2149611193.jpg"
            alt="Hero background"
            className="w-full h-full object-cover mix-blend-overlay"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-navy/80 via-navy/60 to-navy/80" />
        <Header />
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Find Your Perfect Doctor
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl">
            Connect with trusted healthcare professionals with simple click.
          </p>
          
          {/* Enhanced Search Section */}
          <div className="w-full max-w-2xl mx-auto bg-white/30 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/20">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search doctors, specialties..."
                  value={searchInput.symptoms}
                  onChange={(e) => setSearchInput({ ...searchInput, symptoms: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/90 border-2 border-transparent focus:border-navy focus:ring-2 focus:ring-navy transition-all duration-300"
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Location"
                  value={searchInput.location}
                  onChange={(e) => setSearchInput({ ...searchInput, location: e.target.value })}
                  onKeyDown={handleKeyDown}
                  className="w-full px-4 py-3 rounded-xl bg-white/90 border-2 border-transparent focus:border-navy focus:ring-2 focus:ring-navy transition-all duration-300"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-8 py-3 bg-navy/90 hover:bg-navy/80 text-white rounded-xl font-semibold transition-all duration-300 "
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <motion.section
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeIn}
        className="container mx-auto px-4 py-24 md:py-32 bg-gray-50"
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-8">
            <span className="inline-flex items-center px-3 py-1.5 bg-navy/20 text-navy rounded-full text-sm font-medium tracking-wide">
              Why Choose Us
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Healthcare Made Simple for Your Family
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed pb-4">
              Discover trusted doctors tailored to your needs with our intuitive platform. Search by specialization,
              symptoms, or location, and let our AI-powered tools guide you to the best care. With detailed profiles,
              reviews, and ratings, making informed healthcare decisions has never been easier.
            </p>
            <NavLink to="/about">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-navy text-white rounded-lg font-medium hover:bg-navy/90 hover:shadow-lg transition-all duration-300 flex items-center gap-4"
              >
                Learn More
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </NavLink>
          </div>
          <motion.div 
            whileHover={{ scale: 1.03 }} 
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-navy/10 rounded-full -z-10 opacity-70"></div>
            <img
              src={imgPath}
              alt="Healthcare professional"
              className="relative z-10 w-full h-auto rounded-3xl shadow-2xl"
            />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-navy/10 rounded-full -z-10 opacity-70"></div>
          </motion.div>
        </div>
      </motion.section>

      {/* Popular Specializations Section */}
      <motion.section
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeIn}
        className="container mx-auto px-4 py-24 md:py-32 bg-navy/5"
      >
        <div className="max-w-6xl mx-auto text-center space-y-10">
          <h2 className="text-4xl md:text-5xl font-bold text-navy">
            Explore <span className="text-gray-800">Specialties</span>
          </h2>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            Access world-class care from top medical experts in various fields.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {specializations.map((specialization) => (
              <NavLink
                key={specialization.id}
                to={`/doc-list/${specialization.altId || specialization.id}`}
                className="group relative p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-navy/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative space-y-4 flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center group-hover:bg-navy transition-colors duration-300">
                    <img
                      src={specialization.icon}
                      alt={`${specialization.name} icon`}
                      className="w-8 h-8 group-hover:filter group-hover:brightness-0 group-hover:invert transition-all duration-300"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-navy/90">{specialization.name}</h3>
                </div>
              </NavLink>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Featured Doctors Section */}
      <motion.section
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeIn}
        className="container mx-auto px-4 py-24 md:py-32 bg-navy/5"
      >
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-navy">
              Meet Our <span className="text-gray-800">Best Doctors</span>
            </h2>
            <p className="text-gray-700 text-lg max-w-2xl mx-auto">
              Connect with top-rated healthcare professionals of our platform.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
            {featuredDoctors.map((doctor) => (
              <motion.div
                key={doctor.id}
                whileHover={{ y: -5, boxShadow: "0 12px 24px rgba(10, 38, 71, 0.1)" }}
                className="group relative bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300"
              >
                <NavLink to={`/doctor/${doctor.id}`}>
                  <div className="relative">
                    <div className="w-full h-52 bg-navy/5 overflow-hidden">
                      {doctor.photo ? (
                        <img
                        src={`data:${doctor.photo.contentType};base64,${doctor.photo.data}`}
                        alt={doctor.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 bg-white p-2"
                      />
                      ) : (
                        <div className="h-full w-full bg-navy/10 flex items-center justify-center text-navy font-bold text-3xl">
                          {doctor.name?.charAt(0) || "D"}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-8 space-y-3 text-center">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-navy transition-colors duration-300">
                      {doctor.name}
                    </h3>
                    <p className="text-gray-600 font-medium">{doctor.practice}</p>
                    <p className="text-gray-500">{doctor.location}</p>
                  </div>
                </NavLink>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeIn}
        className="container mx-auto px-4 py-24 bg-gradient-to-br from-navy/10 to-gray-100"
      >
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-navy">
              What <span className="text-gray-800">People Say</span>
            </h2>
            <p className="text-gray-700 text-lg max-w-2xl mx-auto">
              Hear from our users about their experiences with DocConnect.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -8, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                className="p-6 bg-white rounded-2xl shadow-md transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  {[...Array(Math.floor(testimonial.rating))].map((_, i) => (
                    <FiStar key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                  {testimonial.rating % 1 !== 0 && (
                    <FiStar className="w-5 h-5 text-yellow-400 fill-current opacity-50" />
                  )}
                </div>
                <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
                <div>
                  <h4 className="text-lg font-semibold text-navy">{testimonial.name}</h4>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <Footer />
      <Chatbot /> 
    </div>
  );
};

export default HomePage;