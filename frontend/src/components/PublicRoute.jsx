import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = () => {
  const { user, loading } = useSelector((store) => store.auth);

  if (loading) return null;

  return user ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;