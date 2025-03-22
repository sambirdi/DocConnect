import { useState, useEffect } from "react";
import { FaSearch, FaBell, FaUsers, FaUser, FaUserMd, FaCog, FaClock, FaChevronDown, FaSignOutAlt } from "react-icons/fa";
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/auth';
import SidebarAdmin from '../../components/Sidebar/SidebarAdmin';
import AdminHeader from '../../components/header/adminHeader';
import { Bar } from 'react-chartjs-2'; // Import Bar chart
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'; // Required Chart.js components

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AdminDashboard() {
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [doctorCount, setDoctorCount] = useState(0);
  const [patientCount, setPatientCount] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [isDoctorView, setIsDoctorView] = useState(true);
  const [auth, setAuth] = useAuth();
  const [recentDoctors, setRecentDoctors] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch recent users and counts from the backend
  useEffect(() => {
    const fetchRecentUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/admin/recent-users', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${auth.token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Failed to fetch data');

        const data = await response.json();
        setRecentDoctors(data.recentDoctors || []);
        setRecentPatients(data.recentPatients || []);
        setDoctorCount(data.totalDoctors || 0);
        setPatientCount(data.totalPatients || 0);
        setPendingRequests(data.pendingDoctors || 0);
        setNotificationsCount(data.pendingDoctors || 0); // Tie notifications to pending requests
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (auth.token) fetchRecentUsers();
  }, [auth.token]);

  // Chart data and options
  const chartData = {
    labels: ['Doctors', 'Patients', 'Pending Requests'],
    datasets: [
      {
        label: 'User Statistics',
        data: [doctorCount, patientCount, pendingRequests],
        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B'], // Blue, Green, Yellow
        borderColor: ['#2563EB', '#059669', '#D97706'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allows the chart to fit the container height
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'User Statistics Overview',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Count',
        },
      },
    },
  };

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
                <p className="text-2xl font-bold text-gray-800 group-hover:text-white">{doctorCount + patientCount}</p>
              </div>
              <div className="bg-purple-200 p-2 rounded-full">
                <FaUsers className="h-6 w-6 text-purple-600 group-hover:text-white" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500 flex justify-between items-center relative group hover:bg-blue-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div>
                <p className="text-sm font-semibold text-blue-600 uppercase mb-1 group-hover:text-white">Total Doctors</p>
                <p className="text-2xl font-bold text-gray-800 group-hover:text-white">{doctorCount}</p>
              </div>
              <div className="bg-blue-200 p-2 rounded-full">
                <FaUserMd className="h-6 w-6 text-blue-600 group-hover:text-white" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500 flex justify-between items-center relative group hover:bg-green-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div>
                <p className="text-sm font-semibold text-green-600 uppercase mb-1 group-hover:text-white">Total Patients</p>
                <p className="text-2xl font-bold text-gray-800 group-hover:text-white">{patientCount}</p>
              </div>
              <div className="bg-green-200 p-2 rounded-full">
                <FaUser className="h-6 w-6 text-green-600 group-hover:text-white" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500 flex justify-between items-center relative group hover:bg-yellow-500 hover:text-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div>
                <p className="text-sm font-semibold text-yellow-600 uppercase mb-1 group-hover:text-white">Pending Doctor Requests</p>
                <p className="text-2xl font-bold text-gray-800 group-hover:text-white">{pendingRequests}</p>
              </div>
              <div className="bg-yellow-200 p-2 rounded-full">
                <FaClock className="h-6 w-6 text-yellow-600 group-hover:text-white" />
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="mt-6 bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Overview</h2>
            </div>
            <div className="mt-4 h-[400px]">
              {loading ? (
                <div className="flex h-full items-center justify-center text-gray-500">Loading chart...</div>
              ) : error ? (
                <div className="flex h-full items-center justify-center text-red-500">Error loading chart: {error}</div>
              ) : (
                <Bar data={chartData} options={chartOptions} />
              )}
            </div>
          </div>

          {/* Recent Users Card-Style Table */}
          <div className="bg-white rounded-lg shadow-sm p-3 mt-5">
            <div className="flex justify-end items-center mb-2 pt-3">
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
                {loading ? (
                  <div className="p-6 text-center text-gray-500">Loading...</div>
                ) : error ? (
                  <div className="p-6 text-center text-red-500">{error}</div>
                ) : (
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
                        <tr key={user._id} className="border-b">
                          <td className="px-6 py-4">
                           
                            <div className="flex items-center gap-3"> 
                              {isDoctorView && ( 
                              <img
                                src={user.photo?.data ?
                                  `data:${user.photo.contentType};base64,${user.photo.data}`
                                  : "https://via.placeholder.com/32"}
                                alt={user.name}
                                className="h-8 w-8 rounded-full"
                              />)}
                              <span className="font-medium text-gray-900">{user.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-600">{user.email}</td>
                          {isDoctorView && (
                            <td className="px-6 py-4 text-gray-600">{user.practice || 'N/A'}</td>
                          )}
                          <td className="px-6 py-4 text-gray-600">{user.location || 'N/A'}</td>
                          <td className="px-6 py-4 text-gray-600">{user.phone || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}