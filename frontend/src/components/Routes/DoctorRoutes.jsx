import { Navigate, Outlet } from "react-router-dom";

const DoctorRoute = () => {
  const auth = JSON.parse(localStorage.getItem("auth"));

  if (!auth || auth.user.role !== "doctor") {
    return <Navigate to="/" />; // Redirect to homepage if not a doctor
  }

  return <Outlet />; // Render the doctor dashboard if the user is a doctor
};

export default DoctorRoute;