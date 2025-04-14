import React, { Profiler } from 'react';
import { Route, Routes, NavLink } from 'react-router-dom';
import { Toaster } from "react-hot-toast";
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ListYourPractice from './pages/auth/doctorSignup';
import ResetPassword from './pages/auth/resetpassword';
import HomePage from './pages/HomePage';
//import Profile from './pages/doctor/profile';
import ForgotPassword from './pages/auth/forgetpassword';
import AdminDashboard from './pages/admin/admindashboard';
import AdminRoute from './components/Routes/AdminRoute';
import DoctorRoute from './components/Routes/DoctorRoutes';
import PatientRoute from './components/Routes/PatientRoutes';
import UserDashboard from './pages/user/Userdashboard';
import DoctorDashboard from './pages/doctor/doctordashboard';
import AdminNotifications from './pages/admin/adminNotification';
import AboutUs from './pages/About';
import Profile from './pages/user/doctorProfile';
import BrowseSpecialties from './pages/browse';
import DoctorList from './pages/DoctorList';
import Doctors from './pages/admin/doctors';
import Patients from './pages/admin/patients';
import Verification from './pages/admin/verification';
import SearchResults from "./pages/SearchResults";
import AdminSetting from './pages/admin/adminSetting';
import AddSeniorDoc from './pages/settings/AddSeniorDoc';
import DoctorNotification from './pages/doctor/doctorNotification';




const App = () => {
  return (
    <div className="App">
      <Toaster />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/doctorsignup" element={<ListYourPractice />} />
        <Route path="/About" element={<AboutUs />} />
        <Route path="/doctor-profile" element={<Profile />} />
        <Route path="/search-results" element={<SearchResults />} />
        {/* <Route path="/profile" element={<Profile />} /> */}
        <Route path="/doctor/:id" element={<Profile />} />
        <Route path="/browse" element={< BrowseSpecialties/>} />
        <Route path="/doc-list/:specialty" element={<DoctorList />} />
        {/* <Route path="/user-dashboard" element={<UserDashboard />} /> */}
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* <Route path="/admin-dashboard" element={<AdminDashboard/>}/> */}
        {/* Admin Routes */}
        <Route path="/dashboard" element={<AdminRoute />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="notification" element={<AdminNotifications />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="patients" element={<Patients />} />
          <Route path="verification" element={<Verification/>} />
          <Route path="settings" element={<AdminSetting/>} />
          <Route path="add-Senior" element={<AddSeniorDoc/>} />

        </Route>

        {/* Doctor Routes */}
        <Route path="/dashboard" element={<DoctorRoute />}>
          <Route path="doctor" element={<DoctorDashboard />} />
          <Route path="doc-notifications" element={<DoctorNotification />} />
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