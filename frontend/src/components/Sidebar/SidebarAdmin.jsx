import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FaUserMd, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import { MdDomainVerification } from "react-icons/md";
import { useAuth } from '../../context/auth';

const SidebarAdmin = () => {
  const [auth, setAuth] = useAuth();
  const location = useLocation();
  
  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-navy text-white p-6 space-y-6 fixed h-screen top-0 left-0">
        <div className="flex items-center space-x-2 text-xl font-bold pb-4 border-b border-white/20">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-navy">SB</div>
          <span>ADMIN</span>
        </div>

        <nav className="space-y-4">
          {/* Dashboard link */}
          <NavLink to="/dashboard/admin">
            <div
              className={`px-4 py-2 rounded-lg mb-4 ${location.pathname === '/dashboard/admin' ? 'bg-blue-800' : ''}`}
            >
              <span className="text-sm">Dashboard</span>
            </div>
            <div className="border-b border-white/20 -mx-2 mb-4"></div>
          </NavLink>

          <div className="space-y-6">
            {/* Doctors */}
            <NavLink to="/dashboard/verification" activeClassName="bg-blue-800">
              <div className={`px-4 py-4 ${location.pathname === '/dashboard/verification' ? 'bg-blue-800' : ''} hover:bg-blue-800 rounded-lg cursor-pointer flex items-center space-x-3`}>
                <MdDomainVerification className="w-5 h-5 text-white" aria-label="Doctors" />
                <span className="text-sm text-white">Verification</span>
              </div>
            </NavLink>
            <NavLink to="/dashboard/doctors" activeClassName="bg-blue-800">
              <div className={`px-4 py-4 ${location.pathname === '/dashboard/doctors' ? 'bg-blue-800' : ''} hover:bg-blue-800 rounded-lg cursor-pointer flex items-center space-x-3`}>
                <FaUserMd className="w-5 h-5 text-white" aria-label="Doctors" />
                <span className="text-sm text-white">Doctors</span>
              </div>
            </NavLink>

            {/* Patients */}
            <NavLink to="/dashboard/patients" activeClassName="bg-blue-800">
              <div className={`px-4 py-4 ${location.pathname === '/dashboard/patients' ? 'bg-blue-800' : ''} hover:bg-blue-800 rounded-lg cursor-pointer flex items-center space-x-3`}>
                <FaUser className="w-5 h-5 text-white" aria-label="Patients" />
                <span className="text-sm text-white">Patients</span>
              </div>
            </NavLink>

            {/* Settings */}
            <NavLink to="/dashboard/settings" activeClassName="bg-blue-800">
              <div className={`px-4 py-4 ${location.pathname === '/dashboard/settings' ? 'bg-blue-800' : ''} hover:bg-blue-800 rounded-lg cursor-pointer flex items-center space-x-3`}>
                <FaCog className="w-5 h-5 text-white" aria-label="Settings" />
                <span className="text-sm text-white">Settings</span>
              </div>
            </NavLink>

            {/* Logout */}
            <NavLink onClick={handleLogout} to="/" activeClassName="bg-blue-800">
              <div className={`px-4 py-4 ${location.pathname === '/' ? 'bg-blue-800' : ''} hover:bg-blue-800 rounded-lg cursor-pointer flex items-center space-x-3`}>
                <FaSignOutAlt className="w-5 h-5 text-white" aria-label="Logout" />
                <span className="text-sm text-white">Logout</span>
              </div>
            </NavLink>
          </div>
        </nav>
      </aside>
    </div>
  );
};

export default SidebarAdmin;