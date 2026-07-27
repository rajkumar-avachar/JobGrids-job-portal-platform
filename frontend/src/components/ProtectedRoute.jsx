import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux"; 
import Loader from "./Loader";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useSelector((state) => state.auth); 

  if (loading) return <Loader />;

  if (!user) return <Navigate to="/login" replace />;
  

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === "jobseeker") {
      return <Navigate to="/" replace />; 
    } else if (user.role === "employer") {
      return <Navigate to="/employer" replace />; 
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
