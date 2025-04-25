import React from 'react';
import Header from '../components/header/header';
import Footer from '../components/footer/footer';
import { NavLink } from 'react-router-dom';

const teamImage = 'https://thumbs.dreamstime.com/b/doctor-stethoscope-hand-hospital-background-gown-94227568.jpg';

const AboutUs = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-navy/90 to-gray-700 relative ">
                <Header />
            </div>

            {/* Main Content */}
            <main className="container mx-auto font-sans">
                <div className="min-h-screen bg-white">
                    {/* Hero Section */}
                    <div className="relative h-[500px] w-full">
                        <div className="absolute inset-0 z-0">
                            <img
                                src="https://static.vecteezy.com/system/resources/previews/023/460/068/non_2x/medical-doctor-background-illustration-ai-generative-free-photo.jpg"
                                alt="Medical professionals"
                                className="object-cover w-full h-full brightness-[0.7]"
                            />
                        </div>
                        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">About DocConnect</h1>
                            <nav className="text-sm text-white/90 mb-6 flex items-center gap-2">
                                <a href="/" className="hover:text-white transition-colors">
                                    Home
                                </a>
                                <span>/</span>
                                <span>About</span>
                            </nav>
                            <p className="text-xl text-white max-w-2xl mx-auto">
                                Your trusted platform for finding the best doctors with ease and confidence.
                            </p>
                        </div>
                    </div>

                    {/* About Us Section */}
                    <section className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center py-24 px-4">
                        <div className="relative order-2 md:order-1">
                            <div className="absolute -top-4 -left-4 w-24 h-24 bg-teal-100 rounded-lg -z-10"></div>
                            <img
                                src="https://thumbs.dreamstime.com/b/doctor-stethoscope-hand-hospital-background-gown-94227568.jpg"
                                alt="DocConnect Team"
                                className="w-full h-auto rounded-lg shadow-lg object-cover"
                            />
                            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-purple-100 rounded-lg -z-10"></div>
                        </div>
                        <div className="space-y-6 order-1 md:order-2">
                            <span className="inline-block px-4 py-1.5 bg-teal-100 text-teal-800 rounded-full text-sm font-medium">
                                About Us
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Connecting You to Trusted Healthcare</h2>
                            <div className="w-20 h-1.5 bg-teal-600 rounded-full"></div>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                For over a decade, DocConnect has been bridging the gap between patients and trusted doctors worldwide. We
                                simplify the process of finding the right healthcare provider by offering verified reviews, detailed
                                specialties, and location-based recommendations.
                            </p>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                Our platform empowers you to make informed decisions for your health with confidence and ease.
                            </p>
                        </div>
                    </section>

                    {/* Mission Section */}
                    <section className="bg-gray-50 py-24">
                        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center px-4">
                            <div className="space-y-6">
                                <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                                    Our Mission
                                </span>
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                                    Providing Excellence in Healthcare Connections
                                </h2>
                                <div className="w-20 h-1.5 bg-emerald-500 rounded-full"></div>
                                <p className="text-gray-600 leading-relaxed text-lg">
                                    At DocConnect, we believe that everyone deserves access to quality healthcare. We're dedicated to
                                    connecting patients with trusted medical professionals through our innovative platform.
                                </p>
                                <p className="text-gray-600 leading-relaxed text-lg">
                                    Whether you're seeking a specialist, a family doctor, or urgent care, our experienced platform is here to
                                    guide you through the process and help you find the perfect healthcare match for your needs.
                                </p>
                            </div>
                            <div className="overflow-hidden rounded-2xl shadow-xl">
                                <div className="relative h-[400px]">
                                    <img
                                        src="https://rkiams.com/wp-content/uploads/2020/11/vision.jpg"
                                        alt="Healthcare Professional"
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Values Section */}
                    <section className="max-w-6xl mx-auto py-24 px-4">
                        <div className="text-center mb-16">
                            <span className="inline-block px-4 py-1.5 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-4">
                                Our Values
                            </span>
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Drives Us</h2>
                            <div className="w-20 h-1.5 bg-purple-500 rounded-full mx-auto mb-6"></div>
                            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                                We provide trusted healthcare recommendations, putting patients first in every step of their healthcare
                                journey.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            <div className="border-none shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg overflow-hidden">
                                <div className="pt-8 px-6 pb-8 text-center">
                                    <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="32"
                                            height="32"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="text-violet-600"
                                        >
                                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-gray-900">Expert Care</h3>
                                    <p className="text-gray-600">
                                        Ensuring every patient receives guidance to the most qualified healthcare providers for their specific
                                        needs.
                                    </p>
                                </div>
                            </div>

                            <div className="border-none shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg overflow-hidden">
                                <div className="pt-8 px-6 pb-8 text-center">
                                    <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="32"
                                            height="32"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="text-emerald-600"
                                        >
                                            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-gray-900">Patient Support</h3>
                                    <p className="text-gray-600">
                                        Offering comprehensive healthcare information and support for informed decisions at every step.
                                    </p>
                                </div>
                            </div>

                            <div className="border-none shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg overflow-hidden">
                                <div className="pt-8 px-6 pb-8 text-center">
                                    <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="32"
                                            height="32"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="text-teal-600"
                                        >
                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                            <path d="m9 11 3 3L22 4" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-gray-900">Trusted Network</h3>
                                    <p className="text-gray-600">
                                        Building a reliable network of verified healthcare professionals and resources you can count on.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* How It Works Section */}
                    <section className="py-24 bg-gray-50">
                        <div className="max-w-6xl mx-auto px-4">
                            <div className="text-center mb-16">
                                <span className="inline-block px-4 py-1.5 bg-teal-100 text-teal-800 rounded-full text-sm font-medium mb-4">
                                    Process
                                </span>
                                <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
                                <div className="w-20 h-1.5 bg-teal-500 rounded-full mx-auto mb-6"></div>
                                <p className="text-gray-700 max-w-2xl mx-auto text-lg">
                                    Get personalized healthcare recommendations in just two simple steps.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                                <div className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden rounded-lg">
                                    <div className="p-0">
                                        <div className="h-2 bg-teal-500"></div>
                                        <div className="p-8">
                                            <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold mb-6 text-xl">
                                                1
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-4">Share Your Needs</h3>
                                            <p className="text-gray-600">
                                                Tell us about your healthcare requirements, location preferences, and any specific concerns you may
                                                have.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden rounded-lg">
                                    <div className="p-0">
                                        <div className="h-2 bg-purple-500"></div>
                                        <div className="p-8">
                                            <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold mb-6 text-xl">
                                                2
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-4">Get Recommendations</h3>
                                            <p className="text-gray-600">
                                                Receive personalized healthcare provider suggestions based on your specific needs and preferences.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Chatbot Section */}
                    <section className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center py-24 px-4">
                        <div className="order-2 md:order-1 relative">
                            <div className="absolute -top-6 -left-6 w-32 h-32 bg-purple-100 rounded-full -z-10 opacity-70"></div>
                            <div className="relative overflow-hidden rounded-2xl shadow-xl">
                                <img
                                    src="https://img.freepik.com/premium-vector/chatbot-blue-background-artificial-intelligence-concept-vector-illustration_319430-71.jpg"
                                    alt="Chatbot Assistance"
                                    className="w-full h-auto hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-navy rounded-full -z-10 opacity-70"></div>
                        </div>
                        <div className="space-y-6 order-1 md:order-2">
                            <span className="inline-block px-4 py-1.5 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                                24/7 Support
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Need Help Finding the Right Doctor?</h2>
                            <div className="w-20 h-1.5 bg-purple-500 rounded-full mb-2"></div>
                            <p className="text-gray-700 leading-relaxed text-lg mb-6">
                                Have questions? Our intelligent chatbot is available 24/7 to assist with finding doctors, navigating the
                                platform, or answering health inquiries. Get the support you need, when you need it.
                            </p>
                            <button className="px-6 py-3 bg-navy text-white rounded-full hover:shadow-lg transition-all duration-300 text-lg flex items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="mr-2"
                                >
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                </svg>
                                Chat with Our Assistant
                            </button>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default AboutUs;