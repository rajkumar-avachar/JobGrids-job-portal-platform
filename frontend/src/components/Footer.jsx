import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="p-4 text-light" style={{ backgroundColor: "#111827" }}>
      <div className="row ms-lg-5 ps-lg-5 gx-5 mt-3">
        <div className="col-12 col-md-3">
          <Link
            className="navbar-brand fw-bold text-light fs-3 me-5 mb-0"
            to="/"
          >
            {/* <img src="/logo/jobgridslogo1.png" alt="Logo" /> */}
            <h3 className="fw-bold m-0">JobGrids</h3>
          </Link>
          <p style={{"marginTop":"-30px"}}>
            Your destination for discovering career opportunities and connecting
            with top companies.
          </p>
          <div className="d-flex fw-bold gap-3 align-items-center fs-5">
            <i class="bi bi-facebook"></i>
            <i class="bi bi-twitter-x"></i>
            <i class="bi bi-instagram"></i>
            <i class="bi bi-linkedin"></i>
          </div>
        </div>
        <div className="col-6 col-md-3 mt-5 mt-md-0 footer-links">
          <h5 className=" mb-3 mt-2 fs-18">For Job Seekers</h5>
          <p>Browse Jobs</p>
          <p>My Dashboard</p>
          <p>Job Alerts</p>
          <p>Saved Jobs</p>
        </div>
        <div className="col-6 col-md-3 mt-5 mt-md-0 footer-links">
          <h5 className=" mb-3 mt-2 fs-18">For Employers &nbsp;&nbsp;</h5>
          <p>Post a Job</p>
          <p>Hiring Solutions</p>
          <p>Pricing</p>
          <p>Branding</p>
        </div>
        <div className="col-6 col-md-3 mt-5 mt-md-0 footer-links">
          <h5 className=" mb-3 mt-2 fs-18">Resources</h5>
          <p>Help Center</p>
          <p>About Us</p>
          <p>Privacy Policy</p>
          <p>Terms of Service</p>
        </div>
      </div>

      <hr className="my-4 mx-sm-5" />
      <p className="text-center mt-4 fs-14">
        &copy; 2025 JobGrids. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
