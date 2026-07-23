import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const JobSeekerCTA = () => {
  const { user } = useSelector((store) => store.auth);
  return (
    <div
      className="text-center py-5 px-2 mt-5"
      // style={{ backgroundColor: "#001433" }}
      style={{ backgroundColor: "#1d4ed8" }}
    >
      <h3 className="fw-semibold text-light">
        Ready to Take the Next Step in Your Career?
      </h3>
      <p className="text-light mt-4">
        Join thousands of professionals who have found their dream jobs through
        ITConnect.
      </p>
      <div className="d-flex justify-content-center gap-3 mt-5">
        {user ? (
          <Link to="/dashboard">
            <button className="btn btn-light text-blue fw-medium py-2 px-4">
              Go to Dashboard
            </button>
          </Link>
        ) : (
          <Link to="/signup">
            <button className="btn btn-light text-blue fw-medium py-2 px-4">
              Create Account
            </button>
          </Link>
        )}

        <Link to="/jobs">
          <button className="btn bg-blue text-light border py-2 px-4 fw-medium">
            Browse Jobs
          </button>
        </Link>
      </div>
    </div>
  );
};

export default JobSeekerCTA;
