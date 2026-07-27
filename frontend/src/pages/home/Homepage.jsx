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
import Loader from "../../components/Loader";

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

  if (loading || (user && user.role === "employer")) {
    return <Loader />;
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
