import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth';  // Import the useAuth hook to access the auth context

const Userdashboard = () => {
  const [auth, setAuth] = useAuth(); // Access auth context
  const navigate = useNavigate(); // Hook to navigate to other pages

  // Logout handler
  const handleLogout = () => {
    // Clear the auth context and remove the token from localStorage
    setAuth({ user: null, token: '' });
    localStorage.removeItem('auth'); // Remove auth data from localStorage
    navigate('/login'); // Navigate to the login page
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="bg-blue-600 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-white text-xl font-bold">DocConnect</div>
          <div className="flex space-x-4">
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Welcome to Your Dashboard, {auth.user?.name || 'User'}!</h1>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800">Your Profile</h2>
            <p className="text-gray-600 mt-4">Email: {auth.user?.email || 'N/A'}</p>
            <p className="text-gray-600">Role: {auth.user?.role || 'N/A'}</p>
            {/* Add more dashboard content as needed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Userdashboard;
