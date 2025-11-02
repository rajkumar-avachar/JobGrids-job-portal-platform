import React, { useEffect } from "react";
import Hero from "./Hero";
import LatestJobs from "./LatestJobs";
import "./Homepage.css";
import HowItWorks from "./HowItWorks";
import EmployerPromo from "./EmployerPromo";
import JobSeekerCTA from "./JobSeekerCTA";
import CompanyLogoCarousel from "./CompanyLogoCarousel";
import useJobs from "../../hooks/useJobs";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  
  const { user, loading } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = "Home | JobGrids";
  }, []);

  useJobs();

  useEffect(() => {
    if (!loading && user?.role === "employer") {
      navigate("/employer/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          className="spinner-border text-primary"
          role="status"
          style={{ width: "3rem", height: "3rem" }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (loading || (user && user.role === "employer")) {
    return (
      <div
        style={{
          height: "90vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          className="spinner-border text-primary"
          role="status"
          style={{ width: "3rem", height: "3rem" }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light">
      <Hero />
      <LatestJobs />
      <HowItWorks />
      <EmployerPromo />
      <CompanyLogoCarousel />
      <JobSeekerCTA />
    </div>
  );
};

export default Homepage;
