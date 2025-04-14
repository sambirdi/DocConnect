import React from "react";
import { NavLink } from "react-router-dom";

const specialties = [
  { name: "Primary Care Physicians", altName: "General Physician" },
  { name: "Psychiatrists" },
  { name: "Optometrists" },
  { name: "Dermatologist" },
  { name: "Dentists" },
  { name: "Therapist-Counselors" },
  { name: "Ophthalmologist" },
  { name: "Orthopedic Surgeons" },
  { name: "OBGYNs" },
  { name: "Urgent Care" },
  { name: "Podiatrists" },
  { name: "Psychologists" },
  { name: "Chiropractors" },
  { name: "Pediatricians" },
  { name: "Cardiologists" },
  { name: "Neurologists" },
];

const BrowseSpecialties = ({ showHeader = true }) => {
  return (
    <div className="bg-white">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {specialties.map((specialty, index) => (
            <NavLink
              key={index}
              to={`/doc-list/${
                specialty.altName
                  ? specialty.altName.toLowerCase().replace(/\s+/g, "-")
                  : specialty.name.toLowerCase().replace(/\s+/g, "-")
              }`} // Uses altName if available, e.g., "/doc-list/general-physician"
              className="flex items-center justify-between px-4 py-3 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
            >
              <span className="text-gray-700 text-base font-normal">
                {specialty.name}
              </span>
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrowseSpecialties;