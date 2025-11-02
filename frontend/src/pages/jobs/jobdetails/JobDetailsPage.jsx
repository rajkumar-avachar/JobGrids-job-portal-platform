import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import JobCard from "./JobCard";
import AboutCompanyCard from "./AboutCompanyCard";
import JobDescription from "./JobDescription";
import useJobDetails from "../../../hooks/useJobDetails";
import { useSelector } from "react-redux";

const JobDetailsPage = () => {
  const { id } = useParams();
  useJobDetails(id);

  const { jobDetails } = useSelector((store) => store.job);
  const { loading } = useSelector((store) => store.job);

  useEffect(() => {
    document.title = `${jobDetails?.title} | JobGrids`;
  }, [jobDetails]);

  if (loading) {
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
      <div className="container pb-5">
        <JobCard job={jobDetails} />
        <JobDescription job={jobDetails} />
        <AboutCompanyCard company={jobDetails?.company} />
      </div>
    </div>
  );
};

export default JobDetailsPage;

{
  /* <div className="py-3 stickyTop bg-light d-flex align-items-center justify-content-between">
  <Link to="/jobs" className="text-decoration-none fw-medium">
    <i class="bi bi-arrow-left"></i> Back to Jobs
  </Link>
  <div className="d-flex gap-4 me-3 d-sm-none">
    {save === false ? (
      <i
        class="bi bi-bookmark rounded-3 bg-light fs-4"
        onClick={handleSave}
      ></i>
    ) : (
      <i
        class="bi bi-bookmark-fill rounded-3 bg-light fs-4"
        onClick={handleSave}
      ></i>
    )}
    <i
      class="bi bi-share rounded-3 bg-light fs-4"
      onClick={handleSave}
    ></i>
  </div>
</div> */
}
