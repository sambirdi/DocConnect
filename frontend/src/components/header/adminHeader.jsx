import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { FaSearch, FaBell, FaChevronDown, FaSignOutAlt } from "react-icons/fa";

const AdminHeader = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setDropdownOpen((prev) => !prev);
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div>
            <header className="bg-white shadow-sm">
                <div className="flex justify-between items-center max-w-7xl mx-4 p-2">
                    <div className="relative flex">
                        <div className="flex items-center gap-4">
                            <div className="relative hidden lg:block">
                                <FaSearch className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <input
                                    type="search"
                                    placeholder="Search..."
                                    className="w-[300px] pl-10 pr-4 py-2 rounded-3xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-navy"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 relative" ref={dropdownRef}>
                        <NavLink to="/dashboard/notification">
                            <button className="p-2 hover:bg-gray-100 rounded-lg">
                                <FaBell className="h-5 w-5 text-gray-600" />
                            </button>
                        </NavLink>
                        <button
                            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
                            onClick={toggleDropdown}
                        >
                            <img src="https://i.pinimg.com/1200x/60/31/25/6031253da1d85e65d4e3d1ba0cff44b4.jpg" alt="Avatar" className="h-6 w-6 rounded-full" />
                            <span className="text-gray-700">Sambirdi Bam</span>
                            <FaChevronDown className="h-4 w-4 text-gray-600" />
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 top-full mt-2 bg-white shadow-lg rounded-lg w-48 z-10">
                                <ul className="py-2 text-gray-700">
                                    <li>
                                        <NavLink to="/dashboard/profile" className="block px-4 py-2 text-sm hover:bg-gray-100">Profile</NavLink>
                                    </li>
                                </ul>
                            </div>
                        )}

                    </div>
                </div>
            </header>
        </div>
    );
}

export default AdminHeader;