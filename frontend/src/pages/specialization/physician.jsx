import React from "react";
import { FaStar } from "react-icons/fa";
import Header from "../../components/header/header";

// Added image and description fields to the doctors array
const doctors = [
  {
    id: 1,
    name: "Dr. Emily Carter",
    specialty: "Primary Care Physician",
    location: "Naxal, Kathmandu",
    rating: 4.8,
    phone: "9832456789",
    image: "https://via.placeholder.com/80", // Placeholder image
    description:
      "Dr. Carter is very caring and knows you by name when you walk in. Her office is welcoming and professional.",
  },
  {
    id: 2,
    name: "Dr. James Patel",
    specialty: "Primary Care Physician",
    location: "Baluwatar, Kathmandu",
    rating: 4.6,
    phone: "9832456723",
    image: "https://via.placeholder.com/80",
    description:
      "Best doctor in town! The whole team is friendly, caring, and they explain everything clearly.",
  },
  {
    id: 3,
    name: "Dr. Sarah Kim",
    specialty: "Primary Care Physician",
    location: "Sundhara, Kathmandu",
    rating: 4.9,
    phone: "9832456745",
    image: "https://via.placeholder.com/80",
    description:
      "Dr. Kim is excellent! She takes the time to listen and provides thorough care to her patients.",
  },
  {
    id: 4,
    name: "Dr. Michael Ortiz",
    specialty: "Primary Care Physician",
    location: "Maharajgunj, Kathmandu",
    rating: 4.7,
    phone: "9832456563",
    image: "https://via.placeholder.com/80",
    description:
      "Very professional and knowledgeable. The staff is friendly, and the office environment is relaxing.",
  },
  {
    id: 5,
    name: "Dr. Lisa Nguyen",
    specialty: "Primary Care Physician",
    location: "Basnundhara, Kathmandu",
    rating: 4.8,
    phone: "9832456683",
    image: "https://via.placeholder.com/80",
    description:
      "Dr. Nguyen is amazing! She makes you feel comfortable and truly cares about her patients.",
  },
  {
    id: 6,
    name: "Dr. Robert Hayes",
    specialty: "Primary Care Physician",
    location: "Bouddha, Kathmandu",
    rating: 4.5,
    phone: "9832456009",
    image: "https://via.placeholder.com/80",
    description:
      "Dr. Hayes is fantastic! He explains everything in detail and ensures you feel at ease.",
  },
];

const DoctorList = () => {
  const handleDoctorClick = (doctor) => {
    console.log(`Opening profile for ${doctor.name}`);
    // Replace with actual navigation, e.g., navigate(`/doctor/${doctor.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with original gradient */}
      <div className="bg-gradient-to-br from-navy/90 to-gray-800">
        <Header />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900">
            Find a <span className="text-navy">Doctor</span>
          </h1>
          <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
            Browse our verified doctors and click to view their profiles.
          </p>
        </div>

        {/* Doctors List - Vertical Layout */}
        <div className="space-y-6">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="flex p-6 bg-white rounded-xl shadow-md border border-gray-200"
            >
              {/* Doctor Image */}
              <div className="mr-6">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
              </div>

              {/* Doctor Info and Description */}
              <div className="flex-1 flex items-start justify-between">
                <div>
                  {/* Doctor Details */}
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold text-navy">
                      {doctor.name}
                    </h2>
                    <p className="text-gray-600">{doctor.specialty}</p>
                    <p className="text-gray-600">{doctor.location}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {[...Array(5)].map((_, index) => (
                        <FaStar
                          key={index}
                          className={
                            index < Math.round(doctor.rating)
                              ? "text-yellow-400 w-5 h-5"
                              : "text-gray-300 w-5 h-5"
                          }
                        />
                      ))}
                      <span className="text-gray-600 ml-2">
                        ({doctor.rating})
                      </span>
                    </div>
                  </div>

                  {/* Doctor Description */}
                  <p className="text-gray-600 italic max-w-xl">
                    "{doctor.description}" <span className="text-navy">View Profile</span>
                  </p>
                </div>

                {/* View Profile Button */}
                <button
                  onClick={() => handleDoctorClick(doctor)}
                  className="px-4 py-2 bg-navy text-white rounded-md font-medium hover:bg-navy/80 transition-colors duration-300"
                >
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <button className="px-8 py-3 bg-navy text-white rounded-md font-medium hover:bg-navy/80 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            View More Doctors
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorList;