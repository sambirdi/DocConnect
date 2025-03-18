import React from 'react';
import Header from '../components/header/header';
import Footer from '../components/footer/footer';
import { NavLink } from 'react-router-dom';
import { FiHeart, FiUsers, FiShield } from 'react-icons/fi';

const teamImage = 'https://thumbs.dreamstime.com/b/doctor-stethoscope-hand-hospital-background-gown-94227568.jpg';

const AboutUs = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-navy/90 to-gray-800 relative z-10">
                <Header />
                <div
                    className="w-full bg-cover bg-center h-80 flex flex-col justify-center items-center relative"
                    style={{
                        backgroundImage:
                            "url('https://static.vecteezy.com/system/resources/previews/023/460/068/non_2x/medical-doctor-background-illustration-ai-generative-free-photo.jpg')",
                    }}
                >
                    <div className="absolute inset-0 bg-black/50"></div>
                    <div className="max-w-4xl mx-auto text-center relative z-10 px-4">
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">About DocConnect</h1>
                        <nav className="text-sm text-white/80 mb-6">
                            <NavLink to="/" className="hover:underline transition-colors duration-300">
                                Home
                            </NavLink>
                            {" / "}
                            <span>About</span>
                        </nav>
                        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                            Discover the perfect doctor with personalized recommendations tailored to your needs.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="container mx-auto font-sans px-4">
                {/* About Us Section */}
                <section className="max-w-6xl mx-auto py-20 grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <span className="inline-block px-3 py-1 bg-navy/10 text-navy rounded-full text-sm font-medium">
                            About DocConnect
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Your Doctor Recommendation Partner</h2>
                        <p className="text-gray-700 text-lg leading-relaxed">
                            DocConnect is a cutting-edge platform designed to help you find the right doctor effortlessly. 
                            Search and filter by specialization, symptoms, or location, and get personalized recommendations 
                            based on your unique needs—all backed by transparent ratings and reviews from other patients.
                        </p>
                    </div>
                    <div>
                        <img
                            src={teamImage}
                            alt="DocConnect Vision"
                            className="w-full h-auto rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                </section>

                {/* Mission Section */}
                <section className="max-w-6xl mx-auto py-20 grid md:grid-cols-2 gap-12 items-center bg-gray-100 rounded-3xl px-6">
                    <div className="space-y-6">
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            Our Mission
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Simplifying Healthcare Choices</h2>
                        <p className="text-gray-700 text-lg leading-relaxed">
                            At DocConnect, we’re committed to making healthcare decisions easier. Our platform connects you 
                            with trusted doctors through smart recommendations, while our chatbot provides 24/7 assistance—without 
                            the hassle of booking appointments directly in the system.
                        </p>
                    </div>
                    <div>
                        <img
                            src="https://rkiams.com/wp-content/uploads/2020/11/vision.jpg"
                            alt="Healthcare Professional"
                            className="w-full h-auto rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                </section>

                {/* Core Values Section */}
                <section className="max-w-6xl mx-auto py-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            The principles driving our mission to enhance your healthcare experience.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: FiHeart,
                                title: "User-Centric",
                                desc: "Tailoring recommendations to your specific healthcare needs.",
                                color: "red",
                            },
                            {
                                icon: FiUsers,
                                title: "Transparency",
                                desc: "Providing clear ratings and reviews for informed choices.",
                                color: "green",
                            },
                            {
                                icon: FiShield,
                                title: "Reliability",
                                desc: "Ensuring a dependable platform with verified doctor profiles.",
                                color: "blue",
                            },
                        ].map((value, index) => (
                            <div
                                key={index}
                                className="group p-6 bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center"
                            >
                                <div
                                    className={`w-14 h-14 bg-${value.color}-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-${value.color}-200 transition-colors duration-300`}
                                >
                                    <value.icon className={`w-6 h-6 text-${value.color}-600 group-hover:text-${value.color}-700`} />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-navy transition-colors duration-300">
                                    {value.title}
                                </h3>
                                <p className="text-gray-600">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="max-w-6xl mx-auto py-20 bg-gradient-to-br from-navy/5 to-gray-100 rounded-3xl px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How DocConnect Works</h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Find the right doctor in three simple steps—no appointment booking required.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { step: 1, title: "Search & Filter", desc: "Use specialization, symptoms, or location to start." },
                            { step: 2, title: "Get Recommendations", desc: "Receive tailored doctor suggestions instantly." },
                            { step: 3, title: "Review & Choose", desc: "Explore ratings and reviews to make your decision." },
                        ].map((item) => (
                            <div
                                key={item.step}
                                className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg hover:-translate-y-2 transition-all duration-300"
                            >
                                <div className="w-12 h-12 bg-navy/10 rounded-full flex items-center justify-center text-navy font-bold mb-4">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                                <p className="text-gray-600">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Chatbot Section */}
                <section className="max-w-6xl mx-auto py-20 grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <span className="inline-block px-3 py-1 bg-navy/10 text-navy rounded-full text-sm font-medium">
                            24/7 Assistance
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Chatbot Support</h2>
                        <p className="text-gray-700 text-lg leading-relaxed">
                            Need help? Our chatbot is available 24/7 to assist with finding doctors, understanding reviews, 
                            or navigating DocConnect—no appointments booked here, just guidance!
                        </p>
                        <button className="px-8 py-3 bg-navy text-white rounded-full hover:bg-navy/80 hover:shadow-lg transition-all duration-300 font-medium">
                            Chat Now
                        </button>
                    </div>
                    <div>
                        <img
                            src="https://img.freepik.com/premium-vector/chatbot-blue-background-artificial-intelligence-concept-vector-illustration_319430-71.jpg"
                            alt="Chatbot Assistance"
                            className="w-full h-auto rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default AboutUs;