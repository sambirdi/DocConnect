import React from 'react';
import Header from '../components/header/header';
import Footer from '../components/footer/footer';
import { NavLink } from 'react-router-dom';
import { FiHeart, FiUsers, FiShield } from 'react-icons/fi';
import { motion } from 'framer-motion';

const teamImage = 'https://thumbs.dreamstime.com/b/doctor-stethoscope-hand-hospital-background-gown-94227568.jpg';

const AboutUs = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: 'easeOut' },
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans antialiased">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-navy/90 via-navy/70 to-gray-800">
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
                    <div className="absolute inset-0 bg-gradient-to-b from-navy/60 to-gray-800/40"></div>
                    <div className="relative z-10 max-w-5xl mx-auto text-center px-6 py-12">
                        <motion.h1
                            {...fadeIn}
                            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight"
                        >
                            About <span className="text-gray-200">DocConnect</span>
                        </motion.h1>
                        <nav className="text-sm md:text-base text-gray-200 mb-6 font-medium">
                            <NavLink to="/" className="hover:text-white transition-colors duration-300">
                                Home
                            </NavLink>
                            <span className="mx-2">/</span>
                            <span>About</span>
                        </nav>
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
                    className="py-24 md:py-32 grid md:grid-cols-2 gap-12 lg:gap-16 items-center bg-navy/5"
                >
                    <div className="space-y-6">
                        <span className="inline-flex items-center px-3 py-1.5 bg-navy/20 text-navy rounded-full text-sm font-medium tracking-wide">
                            About DocConnect
                        </span>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy leading-tight">
                            Your Trusted <span className="text-gray-800">Healthcare Companion</span>
                        </h2>
                        <p className="text-gray-700 text-lg leading-relaxed">
                            DocConnect revolutionizes how you find doctors by offering a seamless platform to search by specialization, 
                            symptoms, or location. Our smart recommendations, paired with verified reviews, empower you to make informed 
                            healthcare decisions with confidence.
                        </p>
                    </div>
                    <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.3 }}>
                        <img
                            src={teamImage}
                            alt="DocConnect Vision"
                            className="w-full h-[28rem] object-cover rounded-2xl shadow-xl"
                        />
                    </motion.div>
                </motion.section>

                {/* Mission Section */}
                <motion.section
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="py-24 md:py-32 grid md:grid-cols-2 gap-12 lg:gap-16 items-center bg-white rounded-3xl px-6 lg:px-10"
                >
                    <div className="space-y-6 order-2 md:order-1">
                        <span className="inline-flex items-center px-3 py-1.5 bg-navy/20 text-navy rounded-full text-sm font-medium tracking-wide">
                            Our Mission
                        </span>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy leading-tight">
                            Empowering <span className="text-gray-800">Healthcare Decisions</span>
                        </h2>
                        <p className="text-gray-700 text-lg leading-relaxed">
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
                            className="w-full h-[28rem] object-cover rounded-2xl shadow-xl"
                        />
                    </motion.div>
                </motion.section>

                {/* Core Values Section */}
                <motion.section
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="py-24 md:py-32 bg-navy/5"
                >
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold text-navy mb-4">
                            Our <span className="text-gray-800">Core Values</span>
                        </h2>
                        <p className="text-gray-700 text-lg max-w-2xl mx-auto">
                            The foundation of our commitment to exceptional healthcare experiences.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: FiHeart,
                                title: "User-Centric",
                                desc: "Prioritizing your unique healthcare needs with tailored solutions.",
                                color: "navy",
                            },
                            {
                                icon: FiUsers,
                                title: "Transparency",
                                desc: "Delivering honest insights through clear ratings and reviews.",
                                color: "navy",
                            },
                            {
                                icon: FiShield,
                                title: "Reliability",
                                desc: "Building trust with verified profiles and dependable service.",
                                color: "navy",
                            },
                        ].map((value, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ y: -8, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                                className="p-6 bg-white rounded-2xl shadow-md hover:bg-navy/10 transition-all duration-300 text-center"
                            >
                                <div
                                    className={`w-14 h-14 bg-navy/20 rounded-full flex items-center justify-center mx-auto mb-5`}
                                >
                                    <value.icon className={`w-6 h-6 text-navy`} />
                                </div>
                                <h3 className="text-xl font-semibold text-navy mb-3">{value.title}</h3>
                                <p className="text-gray-700">{value.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* How It Works Section */}
                <motion.section
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="py-24 md:py-32 bg-gradient-to-br from-navy/10 to-gray-100 rounded-3xl px-6 lg:px-10"
                >
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold text-navy mb-4">
                            How <span className="text-gray-800">It Works</span>
                        </h2>
                        <p className="text-gray-700 text-lg max-w-2xl mx-auto">
                            Discover your ideal doctor in just three intuitive steps.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { step: 1, title: "Search & Filter", desc: "Explore by specialization, symptoms, or location." },
                            { step: 2, title: "Smart Recommendations", desc: "Get instant, personalized doctor matches." },
                            { step: 3, title: "Review & Decide", desc: "Choose confidently with ratings and reviews." },
                        ].map((item) => (
                            <motion.div
                                key={item.step}
                                whileHover={{ y: -8, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                                className="p-6 bg-white rounded-2xl shadow-md hover:bg-navy/10 transition-all duration-300"
                            >
                                <div className="w-12 h-12 bg-navy/20 rounded-full flex items-center justify-center text-navy font-bold mb-5">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-semibold text-navy mb-3">{item.title}</h3>
                                <p className="text-gray-700">{item.desc}</p>
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
                    className="py-24 md:py-32 grid md:grid-cols-2 gap-12 lg:gap-16 items-center bg-navy/5"
                >
                    <div className="space-y-6">
                        <span className="inline-flex items-center px-3 py-1.5 bg-navy/20 text-navy rounded-full text-sm font-medium tracking-wide">
                            24/7 Support
                        </span>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy leading-tight">
                            Always <span className="text-gray-800">Here to Help</span>
                        </h2>
                        <p className="text-gray-700 text-lg leading-relaxed">
                            Our advanced chatbot is available anytime to guide you through finding doctors, understanding reviews, 
                            or using DocConnect—pure support, no bookings.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-3 bg-navy text-white rounded-lg shadow-lg hover:bg-navy/90 transition-all duration-300 font-medium"
                        >
                            Try Chatbot Now
                        </motion.button>
                    </div>
                    <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.3 }}>
                        <img
                            src="https://img.freepik.com/premium-vector/chatbot-blue-background-artificial-intelligence-concept-vector-illustration_319430-71.jpg"
                            alt="Chatbot Assistance"
                            className="w-full h-[28rem] object-cover rounded-2xl shadow-xl"
                        />
                    </motion.div>
                </motion.section>
            </main>

            <Footer />
        </div>
    );
};

export default AboutUs;