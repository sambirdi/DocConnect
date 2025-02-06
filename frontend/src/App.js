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
import Userdashboard from './pages/user/Userdashboard';

const App = () => {
  return (
      <div className="App">
        <Toaster />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/doctorsignup" element={<ListYourPractice />}/>
          <Route path="/user-dashboard" element={<Userdashboard />}/>
          <Route path="/reset-password" element={<ResetPassword />}/>
          <Route path="/doctor-profile" element={<Profile />}/>
          <Route path="/forgot-password" element={<ForgotPassword />}/>
        </Routes>
      </div>
  );
};

export default App;