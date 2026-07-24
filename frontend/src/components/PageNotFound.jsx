import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {

  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 text-center">
      <h1 className="fw-bold">
        <span className="text-danger display-1">404</span>
      </h1>

      <h3 className="mb-3">Page Not Found</h3>

      <p className="text-muted mb-4">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <button
        onClick={() => navigate(-1)}
        className="btn btn-primary me-2"
      >
        ⬅ Go Back to Home
      </button>
    </div>
  );
};

export default PageNotFound;
