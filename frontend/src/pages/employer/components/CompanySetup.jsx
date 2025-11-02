import React, { useEffect } from "react";
import { Building, Plus, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const CompanySetup = () => {
  const { user } = useSelector((store) => store.auth);

  useEffect(() => {
    document.title = "Company Setup | JobGrids";
  }, []);

  const navigate = useNavigate();
  useEffect(() => {
    if (user?.role !== "employer") {
      navigate("/", { replace: true });
    } else if (user?.company) {
      navigate("/employer/company/profile", { replace: true });
    }
  }, [user, navigate]);
  return (
    <div className="h-100 pt-5 bg-light">
      <div className="container mt-5">
        <div className="text-center">
          <Building className="text-blue" size={40} />
          <h3 className="fw-bold mt-3 mb-1">Set Up Your Company</h3>
          <p className="text-muted">Choose how you'd like to get started</p>
        </div>
        <div className="row justify-content-center mt-5 gap-4">
          <div className="col-4 bg-white p-0 rounded-3">
            <Link
              className="text-decoration-none"
              to={"/employer/company/create"}
            >
              <div className="d-flex align-items-center flex-column border rounded-3 p-3 shadow-sm hover-border-blue">
                <div
                  className="light-blue p-2 rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: "50px", height: "50px" }}
                >
                  <Plus className="text-blue" size={24} />
                </div>
                <h5 className="fw-semibold mt-3 text-dark">
                  Create New Company
                </h5>
                <p className="text-muted text-center">
                  Start fresh by creating your own company profile
                </p>
              </div>
            </Link>
          </div>

          <div className="col-4 bg-white p-0 rounded-3">
            <Link
              className="text-decoration-none"
              to={"/employer/company/join"}
            >
              <div className="d-flex align-items-center flex-column border rounded-3 p-3 shadow-sm hover-border-blue">
                <div
                  className="light-blue p-2 rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: "50px", height: "50px" }}
                >
                  <UserPlus className="text-blue" size={20} />
                </div>
                <h5 className="fw-semibold mt-3 text-dark">
                  Join Existing Company
                </h5>
                <p className="text-muted text-center">
                  Send a request to join your existing company
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanySetup;
