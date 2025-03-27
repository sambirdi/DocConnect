import React from 'react';
import Header from '../components/header/header';
import Footer from '../components/footer/footer';
import { NavLink } from 'react-router-dom';
import { FiHeart, FiUsers, FiShield, FiSearch, FiStar, FiCheckCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

const teamImage = 'https://thumbs.dreamstime.com/b/doctor-stethoscope-hand-hospital-background-gown-94227568.jpg';

const AboutUs = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-navy/90 to-gray-700 relative ">
                <Header />
            </div>

            {/* Main Content */}
            {/* Main Content */}
            <main className="container mx-auto font-sans">
                <div
                    className="w-full bg-cover bg-center h-96 flex flex-col justify-center items-center relative"
                    style={{
                        backgroundImage:
                            "url('https://static.vecteezy.com/system/resources/previews/023/460/068/non_2x/medical-doctor-background-illustration-ai-generative-free-photo.jpg')",
                    }}
                >
                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="max-w-3xl mx-auto text-center relative z-10">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">About DocConnect</h1>
                        <nav className="text-sm text-white/80 mb-6">
                            <a href="/" className="hover:underline transition-colors">
                                Home
                            </a>{" "}
                            / <span>About</span>
                        </nav>
                        <p className="text-xl text-white/90 max-w-2xl mx-auto">
                            Your trusted platform for finding the best doctors with ease and confidence.
                        </p>
                    </div>
                </div>

                {/* About Us Section */}
                <section className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center py-20 px-4">
                    <div className="relative order-2 md:order-1">
                        <img
                            src={teamImage || "/placeholder.svg"}
                            alt="DocConnect Team"
                            className="w-full h-auto rounded-lg shadow-md"
                        />
                    </div>
                    <div className="space-y-6 order-1 md:order-2">
                        <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-2">
                            About Us
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-[#161617]">Connecting You to Trusted Healthcare</h2>
                        <p className="text-gray-600 leading-relaxed">
                            For over a decade, DocConnect has been bridging the gap between patients and trusted doctors worldwide. We
                            simplify the process of finding the right healthcare provider by offering verified reviews, detailed
                            specialties, and location-based recommendations, empowering you to make informed decisions for your
                            health.
                        </p>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="max-w-6xl mx-auto py-16 px-7">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-2">
                                Our Mission
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-[#161617]">Our Mission</h2>
                            <h3 className="text-1xl text-navy/80 font-bold">We Do with Excellence</h3>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                At DocConnect, we believe that everyone deserves access to quality healthcare, and we're dedicated to
                                connecting patients with trusted medical professionals. Whether you're seeking a specialist, a family
                                doctor, or urgent care, our experienced platform is here to guide you through the process and help you
                                find the perfect healthcare match for your needs.
                            </p>
                        </div>
                        <div className="overflow-hidden rounded-2xl">
                            <img
                                src="https://rkiams.com/wp-content/uploads/2020/11/vision.jpg"
                                alt="Healthcare Professional"
                                className="w-full h-full shadow-lg hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="max-w-6xl mx-auto py-24 px-4 ">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-[#161617] mb-4">Our Values</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Because we provide trusted healthcare recommendations, putting patients first in every step.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <div className="w-8 h-8 bg-violet-500 rounded-lg"></div>
                            </div>
                            <h3 className="text-xl font-bold mb-3">Expert Care</h3>
                            <p className="text-gray-600">
                                Ensuring every patient receives guidance to the most qualified healthcare providers.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <div className="w-8 h-8 bg-green-500 rounded-lg"></div>
                            </div>
                            <h3 className="text-xl font-bold mb-3">Patient Support</h3>
                            <p className="text-gray-600">
                                Offering comprehensive healthcare information and support for informed decisions.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <div className="w-8 h-8 bg-blue-500 rounded-lg"></div>
                            </div>
                            <h3 className="text-xl font-bold mb-3">Trusted Network</h3>
                            <p className="text-gray-600">
                                Building a reliable network of verified healthcare professionals and resources.
                            </p>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="max-w-6xl mx-auto py-20 bg-gradient-to-br from-indigo-50 to-gray-100 rounded-3xl">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
                        <p className="text-gray-700 max-w-2xl mx-auto">
                            Get personalized healthcare recommendations in just two simple steps.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto px-6">
                        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
                            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold mb-4">
                                1
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Share Your Needs</h3>
                            <p className="text-gray-600">
                                Tell us about your healthcare requirements and location preferences.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
                            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold mb-4">
                                2
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Get Recommendations</h3>
                            <p className="text-gray-600">
                                Receive personalized healthcare provider suggestions based on your specific needs.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Chatbot Section */}
                <section className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center py-20">
                    <div className="order-2 md:order-1">
                        <img
                            src="https://img.freepik.com/premium-vector/chatbot-blue-background-artificial-intelligence-concept-vector-illustration_319430-71.jpg"
                            alt="Chatbot Assistance"
                            className="w-full h-auto rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                    <div className="space-y-6 order-1 md:order-2">
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            24/7 Support
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Need Help?</h2>
                        <p className="text-gray-700 leading-relaxed mb-6">
                            Have questions? Our chatbot is here 24/7 to assist with finding doctors, navigating the platform, or answering health inquiries.
                        </p>
                        <button className="px-8 py-3 bg-navy/90 text-white rounded-full transition-all duration-300 hover:bg-navy/80 hover:shadow-xl font-medium">
                            Start Chat with Our Bot
                        </button>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default AboutUs;