import React from "react";
import { FiSearch, FiMapPin, FiCpu, FiShield, FiStar, FiMessageSquare } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import Footer from "../components/footer/footer";
import Header from "../components/header/header";
import { motion } from "framer-motion";

const imgPath = require("../images/home1.png");

export const features = [
  { title: "AI-Powered Recommendations", description: "Our advanced AI suggests the best doctors based on your needs.", icon: FiCpu },
  { title: "Verified Doctors", description: "We ensure all listed doctors are verified professionals.", icon: FiShield },
  { title: "Doctor Reviews & Ratings", description: "See reviews and ratings from other patients.", icon: FiStar },
  { title: "Quick Chat Support", description: "Have questions? Our chatbot is here to assist you anytime.", icon: FiMessageSquare },
];

export const specializations = [
  { name: "Primary Care", icon: "https://img.icons8.com/ios-filled/100/0A2647/stethoscope.png" },
  { name: "Dentist", icon: "https://img.icons8.com/ios-filled/100/0A2647/tooth.png" },
  { name: "OB-GYN", icon: "https://img.icons8.com/ios-filled/100/0A2647/pregnant.png" },
  { name: "Dermatologist", icon: "https://img.icons8.com/ios-filled/100/0A2647/skin.png" },
  { name: "Psychiatrist", icon: "https://img.icons8.com/ios-filled/100/0A2647/brain.png" },
  { name: "Eye Doctor", icon: "https://img.icons8.com/ios-filled/100/0A2647/glasses.png" },
];

const testimonials = [
  { name: "Sarah M.", role: "Patient", text: "DocConnect made finding a specialist so easy! The recommendations were spot-on.", rating: 5 },
  { name: "Dr. John K.", role: "Physician", text: "As a doctor, I appreciate how this platform connects me with patients who need my expertise.", rating: 4.5 },
  { name: "Emily R.", role: "Patient", text: "The chatbot support was a lifesaver when I had questions late at night.", rating: 5 },
];

export default function HomePage() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-navy/90 via-navy/70 to-gray-800">
        <Header />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="container mx-auto px-4 pt-24 pb-32"
        >
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <motion.h1
              {...fadeIn}
              className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight"
            >
              Find Your <span className="text-gray-200">Perfect Doctor</span>
            </motion.h1>
            <motion.p
              {...fadeIn}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto"
            >
              Discover trusted healthcare professionals tailored to your needs with ease.
            </motion.p>
            <motion.div
              {...fadeIn}
              transition={{ delay: 0.4 }}
              className="bg-white p-4 rounded-xl flex items-center gap-4 max-w-4xl mx-auto shadow-xl"
            >
              <div className="flex-1 flex items-center gap-3 px-4">
                <FiSearch className="w-6 h-6 text-navy" />
                <input
                  type="text"
                  placeholder="Search Specialist or Symptoms"
                  className="w-full border-0 focus:outline-none focus:ring-0 text-gray-700 placeholder-navy/50"
                />
              </div>
              <div className="h-8 w-px bg-navy/20" />
              <div className="flex-1 flex items-center gap-3 px-4">
                <FiMapPin className="w-6 h-6 text-navy" />
                <input
                  type="text"
                  placeholder="Near You or Enter City"
                  className="w-full border-0 focus:outline-none focus:ring-0 text-gray-700 placeholder-navy/50"
                />
              </div>
              <button className="px-8 py-3 bg-navy text-white rounded-lg font-medium hover:bg-navy/90 hover:shadow-lg transition-all duration-300">
                Find Now
              </button>
            </motion.div>
          </div>
        </motion.main>
      </div>

      {/* Why Choose Us Section */}
      <motion.section
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeIn}
        className="container mx-auto px-4 py-24 md:py-32 bg-navy/5"
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-8">
            <span className="inline-flex items-center px-3 py-1.5 bg-navy/20 text-navy rounded-full text-sm font-medium tracking-wide">
              Why Choose Us
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy leading-tight">
              Healthcare, <span className="text-gray-800">Simplified</span>
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed max-w-lg">
              Connect effortlessly with top doctors through our intuitive platform, featuring AI-driven recommendations, verified profiles, and real patient reviews.
            </p>
            <NavLink to="/about">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-navy text-white rounded-lg font-medium hover:bg-navy/90 hover:shadow-lg transition-all duration-300 flex items-center gap-2"
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
          <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.3 }}>
            <img
              src={imgPath}
              alt="Healthcare professionals"
              className="w-full h-[28rem] object-cover rounded-2xl shadow-xl"
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Popular Specializations Section */}
      <motion.section
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeIn}
        className="container mx-auto px-4 py-24 bg-white"
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
              <NavLink to="/physician" key={specialization.name}>
                <motion.div
                  whileHover={{ y: -8, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                  className="p-6 bg-navy/5 rounded-2xl shadow-md hover:bg-navy/10 transition-all duration-300 flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-navy/20 flex items-center justify-center">
                    <img src={specialization.icon} alt={`${specialization.name} icon`} className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-navy hover:text-gray-800 transition-colors duration-300">
                    {specialization.name}
                  </h3>
                </motion.div>
              </NavLink>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Key Features Section */}
      <motion.section
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeIn}
        className="container mx-auto px-4 py-24 bg-navy/5"
      >
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-navy">Key Features</h2>
            <p className="text-gray-700 text-lg max-w-2xl mx-auto">
              Discover how we make your healthcare journey seamless and efficient.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -8, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                className="p-6 bg-white rounded-2xl shadow-md hover:bg-navy/10 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-navy/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-navy" />
                </div>
                <h3 className="text-xl font-semibold text-navy mb-2">{feature.title}</h3>
                <p className="text-gray-700">{feature.description}</p>
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
    </div>
  );
}