import { useState } from "react";
import { FaSearch, FaBell, FaUsers, FaUser, FaUserMd, FaCog, FaClock, FaChevronDown, FaSignOutAlt } from "react-icons/fa";
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/auth';
import SidebarAdmin from '../../components/Sidebar/SidebarAdmin';
import AdminHeader from '../../components/header/adminHeader';

export default function AdminDashboard() {
  const [notificationsCount, setNotificationsCount] = useState();
  const [doctorCount, setDoctorCount] = useState(40);
  const [patientCount, setPatientCount] = useState(25);
  const [pendingRequests, setPendingRequests] = useState(18);
  const [isDoctorView, setIsDoctorView] = useState(true);
  const [auth, setAuth] = useAuth();

  const recentDoctors = [
    { name: "Dr. John Doe", email: "john@gmail.com", specialist: "Neurologist", location: "6096 Marjolaine Landing", phone: "9876543210", profileImg: "https://img.freepik.com/premium-vector/doctor-profile-with-medical-service-icon_617655-48.jpg" },
    { name: 'Dr. Sarah Smith', email: 'sarah@gmail.com', specialist: 'Cardiologist', location: '1234 Elm Street', phone: '1234567890', profileImg: "https://st4.depositphotos.com/7877830/25337/v/450/depositphotos_253374286-stock-illustration-vector-illustration-male-doctor-avatar.jpg" },
    { name: 'Dr. James Bond', email: 'bond@gmail.com', specialist: 'Surgeon', location: '9876 Oak Avenue', phone: '9876543210', profileImg: "https://previews.123rf.com/images/yupiramos/yupiramos1607/yupiramos160705616/59613224-doctor-avatar-profile-isolated-icon-vector-illustration-graphic.jpg" },
  ];

  const recentPatients = [
    { name: 'Jane Doe', email: 'jane@gmail.com', location: "6096 Marjolaine Landing", phone: "9876543210", profileImg: "https://image.shutterstock.com/image-vector/profile-icon-female-avatar-woman-250nw-308471408.jpg" },
    { name: 'Mark Spencer', email: 'mark@gmail.com', location: "1234 Maple Drive", phone: "2345678901", profileImg: "https://www.svgrepo.com/show/384670/account-avatar-profile-user.svg" },
    { name: 'Emily White', email: 'emily@gmail.com', location: "5678 Pine Road", phone: "3456789012", profileImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaI9ppOwoOwwdGwZoIDIYpGDZ9GB5FInYoe_c-Y1k0QPuRW_njDHVAbDmEHPH1geOgkjw&usqp=CAU" },
  ];
  

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <SidebarAdmin />

      {/* Main Content */}
      <main className="flex-1">
        {/* Header */}
        <AdminHeader />

        {/* Dashboard Content */}
        <div className="p-6 max-w-7xl mx-auto">
          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500 flex justify-between items-center relative group hover:bg-purple-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div>
                <p className="text-sm font-semibold text-purple-600 uppercase mb-1 group-hover:text-white">Total Users</p>
                <p className="text-2xl font-bold text-gray-800 group-hover:text-white">50</p>
              </div>
              <div className="bg-purple-200 p-2 rounded-full">
                <FaUsers className="h-6 w-6 text-purple-600 group-hover:text-white" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500 flex justify-between items-center relative group hover:bg-blue-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div>
                <p className="text-sm font-semibold text-blue-600 uppercase mb-1 group-hover:text-white">Total Doctors</p>
                <p className="text-2xl font-bold text-gray-800 group-hover:text-white">30</p>
              </div>
              <div className="bg-blue-200 p-2 rounded-full">
                <FaUserMd className="h-6 w-6 text-blue-600 group-hover:text-white" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500 flex justify-between items-center relative group hover:bg-green-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div>
                <p className="text-sm font-semibold text-green-600 uppercase mb-1 group-hover:text-white">Total Patients</p>
                <p className="text-2xl font-bold text-gray-800 group-hover:text-white">20</p>
              </div>
              <div className="bg-green-200 p-2 rounded-full">
                <FaUser className="h-6 w-6 text-green-600 group-hover:text-white" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500 flex justify-between items-center relative group hover:bg-yellow-500 hover:text-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div>
                <p className="text-sm font-semibold text-yellow-600 uppercase mb-1 group-hover:text-white">Pending Doctor Requests</p>
                <p className="text-2xl font-bold text-gray-800 group-hover:text-white">18</p>
              </div>
              <div className="bg-yellow-200 p-2 rounded-full">
                <FaClock className="h-6 w-6 text-yellow-600 group-hover:text-white" /> {/* Make icon white on hover */}
              </div>
            </div>

          </div>

          {/* Chart */}
          <div className="mt-6 bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Overview</h2>
            </div>
            <div className="mt-4 h-[400px]">
              <div className="flex h-full items-center justify-center text-gray-500">
                {/* Inner box for Chart placeholder */}
                <div className="bg-gray-100 p-4 border border-gray-300 rounded-lg w-full h-full flex items-center justify-center">
                  Chart placeholder
                </div>
              </div>
            </div>
          </div>

          {/* Recent Users Card-Style Table */}
          <div className="bg-white rounded-lg shadow-sm p-3 mt-5">
            <div className="flex justify-end  items-center mb-2 pt-3">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsDoctorView(true)}
                  className={`px-4 py-2 text-sm rounded-3xl transition-colors duration-300 ${isDoctorView ? 'bg-navy text-white' : 'bg-gray-200 text-gray-800'} hover:bg-navy hover:text-white`}
                >
                  Doctors
                </button>
                <button
                  onClick={() => setIsDoctorView(false)}
                  className={`px-4 py-2 text-sm rounded-3xl transition-colors duration-300 ${!isDoctorView ? 'bg-navy text-white' : 'bg-gray-200 text-gray-800'} hover:bg-navy hover:text-white`}
                >
                  Patients
                </button>
              </div>
            </div>

            {/* Deals Table */}
            <div className="mt-2 bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-between p-5">
                <h2 className="text-lg font-semibold text-gray-900">
                  {isDoctorView ? 'Recent Doctors' : 'Recent Patients'}
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-y">
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                      {isDoctorView && (
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Specialist</th>
                      )}
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Location</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Phone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(isDoctorView ? recentDoctors : recentPatients).map((user) => (
                      <tr key={user.name} className="border-b">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={user.profileImg} // Use the unique image URL for each user
                              alt={user.name}
                              className="h-8 w-8 rounded-full"
                            />
                            <span className="font-medium text-gray-900">{user.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{user.email}</td>
                        {isDoctorView && (
                          <td className="px-6 py-4 text-gray-600">{user.specialist}</td>
                        )}
                        <td className="px-6 py-4 text-gray-600">{user.location}</td>
                        <td className="px-6 py-4 text-gray-600">{user.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}