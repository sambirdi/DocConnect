import React from 'react';
import Header from '../components/header/header';
import Footer from '../components/footer/footer';
import { NavLink } from 'react-router-dom';
import { FiCpu, FiShield, FiStar, FiMessageSquare } from "react-icons/fi";
import Chatbot from '../components/chatbot/Chatbot'; 

const teamImage = 'https://thumbs.dreamstime.com/b/doctor-stethoscope-hand-hospital-background-gown-94227568.jpg';

const steps = [
    {
        title: "Share Your Needs",
        description: "Tell us about your healthcare requirements, location preferences, and any specific concerns you may have."
    },
    {
        title: "Get Recommendations",
        description: "Receive personalized healthcare provider suggestions based on your specific needs and preferences."
    },
    {
        title: "Meet Your Doctor",
        description: "Connect with your chosen doctor and start your healthcare journey."
    },
    {
        title: "Follow Up Care",
        description: "Get continuous support and follow-up care to ensure the best health outcomes."
    }
];

const features = [
    { 
        title: "AI-Powered Recommendations", 
        description: "Our advanced AI suggests the best doctors based on your needs.", 
        icon: FiCpu 
    },
    { 
        title: "Verified Doctors", 
        description: "We ensure all listed doctors are verified professionals.", 
        icon: FiShield 
    },
    { 
        title: "Doctor Reviews & Ratings", 
        description: "See reviews and ratings from other patients.", 
        icon: FiStar 
    },
    { 
        title: "Quick Chat Support", 
        description: "Have questions? Our chatbot is here to assist you anytime.", 
        icon: FiMessageSquare 
    }
];

const AboutUs = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Enhanced Hero Section with Fixed Header */}
            <div className="relative min-h-[70vh] bg-gradient-to-br from-navy/90 to-gray-700">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg"
                        alt="About Us Hero"
                        className="w-full h-full object-cover mix-blend-overlay"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-navy/80 via-navy/60 to-navy/80" />
                
                <Header />

                {/* Hero Content */}
                <div className="relative z-10 flex flex-col justify-center items-center text-center px-4 h-[70vh]">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                        About DocConnect
                    </h1>
                    <p className="text-xl text-white/90 max-w-2xl leading-relaxed">
                        Transforming healthcare access through technology and trust
                    </p>
                    <div className="mt-8 flex gap-4">
                        <NavLink 
                            to="/" 
                            className="px-8 py-3 bg-navy hover:bg-navy/80 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/25"
                        >
                            Find a Doctor
                        </NavLink>
                        {/* <NavLink 
                            to="/contact" 
                            className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm"
                        >
                            Contact Us
                        </NavLink> */}
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"/>
            </div>

            {/* Why Choose DocConnect Section */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Why Choose DocConnect?
                        </h2>
                        <div className="w-20 h-1.5 bg-navy rounded-full mx-auto mb-6"></div>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Experience healthcare simplified with our comprehensive platform
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-1"
                            >
                                <div className="w-16 h-16 bg-navy-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-navy/90 transition-colors duration-300">
                                    <feature.icon className="w-8 h-8 text-navy group-hover:text-white transition-colors duration-300" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <main className="container mx-auto font-sans">
                <div className="min-h-screen bg-white">
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
                            <span className="inline-block px-4 py-1.5 bg-navy/30 text-navy rounded-full text-sm font-medium">
                                About Us
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Connecting You to Trusted Healthcare</h2>
                            <div className="w-20 h-1.5 bg-navy/60 rounded-full"></div>
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
                    <section className="py-20 bg-white">
                        <div className="max-w-6xl mx-auto px-4">
                            <div className="grid md:grid-cols-2 gap-12 items-center">
                                <div className="space-y-6">
                                    <div className="inline-block px-4 py-2 bg-blue-100 rounded-full text-blue-700 font-medium text-sm mb-4">
                                        Our Mission
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                                        Making Quality Healthcare Accessible to Everyone
                                    </h2>
                                    <div className="w-20 h-1.5 bg-blue-800 rounded-full"></div>
                                    <p className="text-lg text-gray-600 leading-relaxed">
                                        At DocConnect, we're committed to breaking down barriers in healthcare access. 
                                        Our platform connects patients with trusted healthcare providers, making it easier 
                                        than ever to receive the care you need, when you need it.
                                    </p>
                                    <div className="flex gap-4 mt-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div className="text-gray-700 font-medium">Trusted Doctors</div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div className="text-gray-700 font-medium">24/7 Support</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative">
                                    <img
                                        src="https://img.freepik.com/free-photo/young-handsome-physician-medical-robe-with-stethoscope_1303-17818.jpg"
                                        alt="Doctor with patient"
                                        className="rounded-2xl shadow-xl"
                                    />
                                    <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                                        <div className="text-3xl font-bold text-blue-600 mb-1">1000+</div>
                                        <div className="text-gray-600">Verified Doctors</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Values Section */}
                    <section className="py-20 bg-gray-50">
                        <div className="max-w-6xl mx-auto px-4">
                            <div className="text-center mb-16">
                                <div className="inline-block px-4 py-2 bg-violet-50 rounded-full text-violet-600 font-medium text-sm mb-4">
                                    Our Values
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                    What Sets Us Apart
                                </h2>
                                <div className="w-20 h-1.5 bg-violet-500 rounded-full mx-auto"></div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                                    <div className="w-16 h-16 bg-violet-50 rounded-xl flex items-center justify-center mb-6">
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
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Expert Care</h3>
                                    <p className="text-gray-600">
                                        Ensuring every patient receives guidance to the most qualified healthcare providers for their specific
                                        needs.
                                    </p>
                                </div>

                                <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                                    <div className="w-16 h-16 bg-violet-50 rounded-xl flex items-center justify-center mb-6">
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
                                            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Patient Support</h3>
                                    <p className="text-gray-600">
                                        Offering comprehensive healthcare information and support for informed decisions at every step.
                                    </p>
                                </div>

                                <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                                    <div className="w-16 h-16 bg-violet-50 rounded-xl flex items-center justify-center mb-6">
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
                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                            <path d="m9 11 3 3L22 4" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Trusted Network</h3>
                                    <p className="text-gray-600">
                                        Building a reliable network of verified healthcare professionals and resources you can count on.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* How It Works Section */}
                    <section className="py-20 bg-white">
                        <div className="max-w-6xl mx-auto px-4">
                            <div className="text-center mb-16">
                                <div className="inline-block px-4 py-2 bg-sky-50 rounded-full text-sky-600 font-medium text-sm mb-4">
                                    The Process
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                    How DocConnect Works
                                </h2>
                                <div className="w-20 h-1.5 bg-sky-500 rounded-full mx-auto mb-8"></div>
                            </div>

                            <div className="grid md:grid-cols-4 gap-8">
                                {steps.map((step, index) => (
                                    <div key={index} className="relative">
                                        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                                            <div className="w-12 h-12 bg-sky-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <span className="text-xl font-bold text-sky-600">{index + 1}</span>
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-3">{step.title}</h3>
                                            <p className="text-gray-600 text-sm">{step.description}</p>
                                        </div>
                                        {index < steps.length - 1 && (
                                            <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-sky-200"></div>
                                        )}
                                    </div>
                                ))}
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
            <Chatbot /> 
        </div>
    );
};

export default AboutUs;