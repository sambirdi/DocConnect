import { Navigate, Outlet } from "react-router-dom";

const PatientRoute = () => {
  const auth = JSON.parse(localStorage.getItem("auth"));

  if (!auth || auth.user.role !== "patient") {
    return <Navigate to="/" />; // Redirect to homepage if not a patient
  }

  return <Outlet />; // Render the patient dashboard if the user is a patient
};

export default PatientRoute;