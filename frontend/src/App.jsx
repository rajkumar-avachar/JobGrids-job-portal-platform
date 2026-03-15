import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Homepage from "./pages/home/Homepage";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./utils/ScrollToTop";

import Dashboard from "./pages/jobseeker/Dashboard";
import ProfilePage from "./pages/jobseeker/ProfilePage";
import JobsPage from "./pages/jobs/jobs/JobsPage";
import JobDetailsPage from "./pages/jobs/jobdetails/JobDetailsPage";
import CompaniesPage from "./pages/companies/companies/CompaniesPage";
import CompanyDetailsPage from "./pages/companies/companydetails/CompanyDetailsPage";

import EmpDashboard from "./pages/employer/Dashboard";

import PageNotFound from "./components/PageNotFound";

import ProtectedRoute from "./components/ProtectedRoute";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { USER_API } from "./utils/apis";
import { useDispatch } from "react-redux";
import { logout, setUser } from "./redux/authSlice";
import axios from "axios";
import OtpVerification from "./pages/auth/OtpVerification";
import ForgotPassword from "./pages/auth/ResetPassword/ForgotPassword";
import OtpVerificationForResetPassword from "./pages/auth/ResetPassword/OtpVerificationForResetPassword";
import ResetPassword from "./pages/auth/ResetPassword/ResetPassword";
import SavedJobs from "./pages/jobseeker/SavedJobs";
import useSavedJobs from "./hooks/useSavedJobs";

// Layouts
function MainLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

// App
function App() {
  const dispatch = useDispatch();
  useSavedJobs();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${USER_API}/me`, {
          withCredentials: true,
        });

        dispatch(setUser(res.data.user));
      } catch (error) {
        if (error.response?.status === 401) {
          dispatch(logout());
        }
      }
    };
    checkAuth();
  }, [dispatch]);

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Homepage />} />
          <Route path="jobs" element={<JobsPage />} />
          <Route path="job/:id" element={<JobDetailsPage />} />
          <Route path="companies" element={<CompaniesPage />} />
          <Route path="company/:id" element={<CompanyDetailsPage />} />
        </Route>

        <Route path="signup" element={<Signup />} />
        <Route path="otp-verification" element={<OtpVerification />} />
        <Route path="login" element={<Login />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route
          path="otp-verification-for-reset-password"
          element={<OtpVerificationForResetPassword />}
        />
        <Route path="reset-password" element={<ResetPassword />} />

        {/* Jobseeker Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={["jobseeker"]} />}>
          <Route path="/" element={<MainLayout />}>
            <Route path="profile" element={<ProfilePage />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="saved-jobs" element={<SavedJobs />} />
          </Route>
        </Route>

        {/* Employer Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={["employer"]} />}>
          <Route path="employer/*" element={<EmpDashboard />} />
        </Route>

        {/* Catch-all 404 */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>

      <ToastContainer />
    </Router>
  );
}

export default App;
