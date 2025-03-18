import React from "react";
import { FiSearch, FiMapPin, FiCpu, FiShield, FiStar, FiMessageSquare } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import Footer from "../components/footer/footer";
import Header from "../components/header/header";

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

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-navy/90 to-gray-800">
        <Header />
        <main className="container mx-auto px-4 pt-24 pb-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
              Find the <span className="text-white/80">Right Doctor</span> for You
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Discover trusted healthcare professionals tailored to your needs with ease.
            </p>
            <div className="bg-white p-3 rounded-full flex items-center gap-3 max-w-3xl mx-auto shadow-lg">
              <div className="flex-1 flex items-center gap-3 px-4">
                <FiSearch className="w-6 h-6 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Specialist or Symptoms"
                  className="w-full border-0 focus:outline-none focus:ring-0 text-gray-700 placeholder-gray-400"
                />
              </div>
              <div className="h-8 w-px bg-gray-200" />
              <div className="flex-1 flex items-center gap-3 px-4">
                <FiMapPin className="w-6 h-6 text-gray-400" />
                <input
                  type="text"
                  placeholder="Near You or Enter City"
                  className="w-full border-0 focus:outline-none focus:ring-0 text-gray-700 placeholder-gray-400"
                />
              </div>
              <button className="px-6 py-2 bg-navy text-white rounded-full font-medium hover:bg-navy/80 hover:shadow-md transition-all duration-300">
                Find
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Enhanced Why Choose Us Section */}
      <section className="container mx-auto px-4 py-28 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <span className="text-navy uppercase tracking-widest font-semibold text-sm bg-navy/10 px-3 py-1 rounded-full inline-block">
              Why Choose Us
            </span>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Healthcare Made <span className="text-navy">Simple</span> for You
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed max-w-lg py-4">
              Effortlessly connect with top doctors using our intuitive platform. From AI-driven recommendations to verified profiles and patient reviews, we simplify your healthcare journey.
            </p>
            <NavLink to="/about">
              <button className="px-10 py-4 bg-navy text-white rounded-lg font-semibold text-lg hover:bg-navy/80 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
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
              </button>
            </NavLink>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-navy/5 to-gray-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <img
              src={imgPath}
              alt="Healthcare professionals"
              className="relative z-10 w-full h-auto rounded-2xl shadow-xl group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </section>

      {/* Popular Specializations Section */}
      <section className="container mx-auto px-4 py-24 bg-white">
        <div className="max-w-6xl mx-auto text-center space-y-10">
          <h2 className="text-5xl font-bold text-gray-900">
            Our <span className="text-navy">Specialties</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore world-class care from top medical experts.
          </p>
          <NavLink to="/physician">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {specializations.map((specialization) => (
              <div
                key={specialization.name}
                className="group relative p-6 bg-gray-50 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-2 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-navy/5 to-gray-100 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex flex-col items-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-navy/10 flex items-center justify-center group-hover:bg-navy transition-colors duration-300">
                    <img
                      src={specialization.icon}
                      alt={`${specialization.name} icon`}
                      className="w-8 h-8 group-hover:filter group-hover:brightness-0 group-hover:invert transition-all duration-300"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-navy transition-colors duration-300">
                    {specialization.name}
                  </h3>
                </div>
              </div>
            ))}
            
          </div>
          </NavLink>
        </div>
      </section>

      {/* Original Key Features Section (Unchanged) */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-[#161617]">Key Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience healthcare reimagined with our innovative features designed to make your medical journey seamless.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-2xl bg-gradient-to-b from-white to-white hover:from-[#8aa1c6] hover:to-[#0A2647] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b group-hover:opacity-0 transition-opacity duration-300" />
                <div className="relative space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-white shadow-md flex items-center justify-center group-hover:bg-white/10 transition-colors duration-300">
                    <feature.icon className="w-6 h-6 text-[#3b82f6] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-white">{feature.title}</h3>
                  <p className="text-gray-600 group-hover:text-white/90">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}