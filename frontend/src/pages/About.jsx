import React from 'react';
import Header from '../components/header/header';
import Footer from '../components/footer/footer';
import { NavLink } from 'react-router-dom';
import { FiHeart, FiUsers, FiShield, FiSearch, FiStar, FiCheckCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

const AboutUs = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: 'easeOut' },
    };

    return (
        <div className="min-h-screen bg-gray-50 font-['Inter',sans-serif] antialiased">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-[#0A2647]/90 via-[#0A2647]/70 to-gray-800">
                <Header />
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="relative bg-cover bg-center h-[32rem] flex items-center justify-center"
                    style={{
                        backgroundImage:
                            "url('https://static.vecteezy.com/system/resources/previews/023/460/068/non_2x/medical-doctor-background-illustration-ai-generative-free-photo.jpg')",
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0A2647]/60 to-gray-800/40"></div>
                    <div className="relative z-10 max-w-5xl mx-auto text-center px-6 py-12">
                        <motion.h1
                            {...fadeIn}
                            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight"
                        >
                            About <span className="text-gray-200">DocConnect</span>
                        </motion.h1>
                        <motion.p
                            {...fadeIn}
                            transition={{ delay: 0.2 }}
                            className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed"
                        >
                            Connecting you with the perfect doctor through personalized, data-driven recommendations.
                        </motion.p>
                    </div>
                </motion.div>
            </div>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* About Us Section */}
                <motion.section
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="py-24 md:py-32 grid md:grid-cols-2 gap-12 lg:gap-16 items-center"
                >
                    <div className="space-y-6">
                        <span className="inline-flex items-center px-3 py-1.5 bg-[#0A2647]/10 text-[#0A2647] rounded-full text-sm font-medium tracking-wide">
                            About DocConnect
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-[#0A2647] leading-tight">
                            Your Trusted <span className="text-gray-800">Healthcare Companion</span>
                        </h2>
                        <p className="text-gray-600 text-base leading-relaxed">
                            DocConnect revolutionizes how you find doctors by offering a seamless platform to search by specialization, 
                            symptoms, or location. Our smart recommendations, paired with verified reviews, empower you to make informed 
                            healthcare decisions with confidence.
                        </p>
                    </div>
                    <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.3 }}>
                        <img
                            src="https://images.unsplash.com/photo-1550831107-1553da8c8464?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                            alt="DocConnect Vision"
                            className="w-full h-[24rem] object-cover rounded-xl shadow-lg"
                        />
                    </motion.div>
                </motion.section>

                {/* Mission Section */}
                <motion.section
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="py-24 md:py-32 grid md:grid-cols-2 gap-12 lg:gap-16 items-center"
                >
                    <div className="space-y-6 order-2 md:order-1">
                        <span className="inline-flex items-center px-3 py-1.5 bg-[#0A2647]/10 text-[#0A2647] rounded-full text-sm font-medium tracking-wide">
                            Our Mission
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-[#0A2647] leading-tight">
                            Empowering <span className="text-gray-800">Healthcare Decisions</span>
                        </h2>
                        <p className="text-gray-600 text-base leading-relaxed">
                            We aim to simplify your healthcare journey by connecting you with top-tier doctors through intelligent 
                            recommendations and a user-friendly experience—supported by our round-the-clock chatbot assistance.
                        </p>
                    </div>
                    <motion.div
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.3 }}
                        className="order-1 md:order-2"
                    >
                        <img
                            src="https://rkiams.com/wp-content/uploads/2020/11/vision.jpg"
                            alt="Healthcare Professional"
                            className="w-full h-[24rem] object-cover rounded-xl shadow-lg"
                        />
                    </motion.div>
                </motion.section>

                {/* Core Values Section */}
                <motion.section
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="py-24 md:py-32 bg-gradient-to-b from-[#0A2647]/5 to-gray-100 relative"
                >
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold text-[#0A2647] mb-4">
                            Our <span className="text-gray-800">Core Values</span>
                        </h2>
                        <p className="text-gray-600 text-base max-w-2xl mx-auto leading-relaxed">
                            The foundation of our commitment to exceptional healthcare experiences.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: FiHeart,
                                title: "User-Centric",
                                desc: "Prioritizing your unique healthcare needs with tailored solutions.",
                            },
                            {
                                icon: FiUsers,
                                title: "Transparency",
                                desc: "Delivering honest insights through clear ratings and reviews.",
                            },
                            {
                                icon: FiShield,
                                title: "Reliability",
                                desc: "Building trust with verified profiles and dependable service.",
                            },
                        ].map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg hover:bg-[#0A2647]/5 transition-all duration-300 text-center"
                            >
                                <div className="w-16 h-16 bg-[#0A2647]/10 rounded-full flex items-center justify-center mx-auto mb-5">
                                    <value.icon className="w-8 h-8 text-[#0A2647]" />
                                </div>
                                <h3 className="text-xl font-semibold text-[#0A2647] mb-3">{value.title}</h3>
                                <p className="text-gray-600 text-base leading-relaxed">{value.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                    {/* Wave Divider */}
                    <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
                        <svg
                            className="relative block w-full h-16 text-gray-50"
                            viewBox="0 0 1200 120"
                            preserveAspectRatio="none"
                        >
                            <path
                                d="M0,0V92.14C0,92.14,300,120,600,92.14C900,64.29,1200,92.14,1200,92.14V0Z"
                                fill="currentColor"
                            />
                        </svg>
                    </div>
                </motion.section>

                {/* How It Works Section */}
                <motion.section
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="py-24 md:py-32 bg-gray-50 relative"
                >
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold text-[#0A2647] mb-4">
                            How <span className="text-gray-800">It Works</span>
                        </h2>
                        <p className="text-gray-600 text-base max-w-2xl mx-auto leading-relaxed">
                            Discover your ideal doctor in just three intuitive steps.
                        </p>
                    </div>
                    <div className="relative grid md:grid-cols-3 gap-8">
                        {/* Connecting Lines */}
                        <div className="absolute inset-x-0 top-1/2 h-1 bg-[#0A2647]/10 hidden md:block">
                            <div className="h-full w-full bg-gradient-to-r from-transparent via-[#0A2647]/50 to-transparent"></div>
                        </div>
                        {[
                            { icon: FiSearch, title: "Search & Filter", desc: "Explore by specialization, symptoms, or location." },
                            { icon: FiStar, title: "Smart Recommendations", desc: "Get instant, personalized doctor matches." },
                            { icon: FiCheckCircle, title: "Review & Decide", desc: "Choose confidently with ratings and reviews." },
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                className="relative p-6 bg-white rounded-xl shadow-md hover:shadow-lg hover:bg-[#0A2647]/5 transition-all duration-300 text-center z-10"
                            >
                                <div className="w-14 h-14 bg-[#0A2647]/10 rounded-full flex items-center justify-center mx-auto mb-5">
                                    <item.icon className="w-7 h-7 text-[#0A2647]" />
                                </div>
                                <h3 className="text-xl font-semibold text-[#0A2647] mb-3">{item.title}</h3>
                                <p className="text-gray-600 text-base leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Chatbot Section */}
                <motion.section
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="py-24 md:py-32 grid md:grid-cols-2 gap-12 lg:gap-16 items-center"
                >
                    <div className="space-y-6">
                        <span className="inline-flex items-center px-3 py-1.5 bg-[#0A2647]/10 text-[#0A2647] rounded-full text-sm font-medium tracking-wide">
                            24/7 Support
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-[#0A2647] leading-tight">
                            Always <span className="text-gray-800">Here to Help</span>
                        </h2>
                        <p className="text-gray-600 text-base leading-relaxed">
                            Our advanced chatbot is available anytime to guide you through finding doctors, understanding reviews, 
                            or using DocConnect—pure support, no bookings.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-3 bg-[#0A2647] text-white rounded-lg shadow-lg hover:bg-[#0A2647]/90 transition-all duration-300 font-medium"
                        >
                            Try Chatbot Now
                        </motion.button>
                    </div>
                    <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.3 }}>
                        <img
                            src="https://img.freepik.com/premium-vector/chatbot-blue-background-artificial-intelligence-concept-vector-illustration_319430-71.jpg"
                            alt="Chatbot Assistance"
                            className="w-full h-[24rem] object-cover rounded-xl shadow-lg"
                        />
                    </motion.div>
                </motion.section>
            </main>

            <Footer />
        </div>
    );
};

export default AboutUs;