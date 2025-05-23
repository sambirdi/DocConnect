import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

export default function Footer() {
    const footerLinks = {
        explore: ["Home", "Find Doctors", "Specialties", "Chatbot"],
        about: ["About Us", "How it Works", "Our Team", "Testimonials", "Contact Us"],
        legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Data Protection"]
    };

    return (
        <footer className="bg-navy pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Main Footer Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {/* Brand Column */}
                        <div className="space-y-6">
                            <div className="flex items-center">
                                <h2 className="text-2xl font-bold text-white">
                                    <span className="text-indigo-500">Doc</span>Connect
                                </h2>
                            </div>
                            <p className="text-gray-400 leading-relaxed">
                                Connecting patients with trusted healthcare professionals for better health outcomes.
                            </p>
                            <div className="flex gap-4">
                                {[
                                    { Icon: FaFacebookF, href: "#" },
                                    { Icon: FaTwitter, href: "#" },
                                    { Icon: FaInstagram, href: "#" },
                                    { Icon: FaLinkedinIn, href: "#" }
                                ].map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.href}
                                        className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-colors"
                                    >
                                        <social.Icon className="w-4 h-4" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Explore Links */}
                        <div>
                            <h3 className="text-white font-semibold mb-6">Explore</h3>
                            <ul className="space-y-4">
                                {footerLinks.explore.map((link) => (
                                    <li key={link}>
                                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* About Links */}
                        <div>
                            <h3 className="text-white font-semibold mb-6">About</h3>
                            <ul className="space-y-4">
                                {footerLinks.about.map((link) => (
                                    <li key={link}>
                                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h3 className="text-white font-semibold mb-6">Contact</h3>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-gray-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" 
                                        />
                                    </svg>
                                    <span>+977 9812494908</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                                        />
                                    </svg>
                                    <span>support@docconnect.com</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                                        />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                                        />
                                    </svg>
                                    <span>Kathmandu, Nepal</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Legal Links */}
                    <div className="mt-12 pt-8 border-t border-white/10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                            <div className="text-gray-400 text-sm">
                                © 2025 DocConnect. All rights reserved.
                            </div>
                            <div className="flex flex-wrap gap-6 md:justify-end">
                                {footerLinks.legal.map((link) => (
                                    <a
                                        key={link}
                                        href="#"
                                        className="text-sm text-gray-400 hover:text-white transition-colors"
                                    >
                                        {link}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}