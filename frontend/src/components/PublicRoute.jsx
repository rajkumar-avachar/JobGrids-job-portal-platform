import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "./Loader";

const PublicRoute = () => {
  const { user, loading } = useSelector((store) => store.auth);

  if (loading) return <Loader />;

  return user ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;