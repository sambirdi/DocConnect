import React, { Profiler } from 'react';
import { Route, Routes, NavLink } from 'react-router-dom';
import { Toaster } from "react-hot-toast";
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ListYourPractice from './pages/auth/doctorSignup';
import ResetPassword from './pages/auth/resetpassword';
import HomePage from './pages/HomePage';
import Profile from './pages/doctor/profile';
import ForgotPassword from './pages/auth/forgotpassowrd';
import AdminDashboard from './pages/admin/admindashboard';
import AdminRoute from './components/Routes/AdminRoute';
import DoctorRoute from './components/Routes/DoctorRoutes';
import PatientRoute from './components/Routes/PatientRoutes';
import UserDashboard from './pages/user/Userdashboard';
import DoctorDashboard from './pages/doctor/doctordashboard';
import AdminNotifications from './pages/admin/adminNotification';

const App = () => {
  return (
    <div className="App">
      <Toaster />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/doctorsignup" element={<ListYourPractice />} />
        {/* <Route path="/user-dashboard" element={<UserDashboard />} /> */}
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/doctor-profile" element={<Profile />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* <Route path="/admin-dashboard" element={<AdminDashboard/>}/> */}

        {/* Admin Routes */}
        <Route path="/dashboard" element={<AdminRoute />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="notification" element={<AdminNotifications />} />
        </Route>

        {/* Doctor Routes */}
        <Route path="/dashboard" element={<DoctorRoute />}>
          <Route path="doctor" element={<DoctorDashboard />} />
        </Route>
        
        {/* Patient Routes */}
        <Route path="/dashboard" element={<PatientRoute />}>
          <Route path="user" element={<UserDashboard />} />
        </Route>

      </Routes>
    </div>
  );
};

export default App;