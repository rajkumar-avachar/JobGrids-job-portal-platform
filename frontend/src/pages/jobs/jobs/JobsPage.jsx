import React, { useEffect } from "react";
import SearchJobs from "./SearchJobs";
import JobFilters from "./JobFilters";
import JobResults from "./JobResults";
import useJobs from "../../../hooks/useJobs";
import { useSelector } from "react-redux";

const JobsPage = () => {
  useJobs();
  const { loading } = useSelector((store) => store.job);

  useEffect(() => {
    document.title = "Jobs | JobGrids";
  }, []);

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
    <div className="bg-light py-5">
      <div className="container">
        <SearchJobs />
        <div className="main row gap-3 m-0 mb-5">
          <JobFilters />
          <JobResults />
        </div>
      </div>
    </div>
  );
};

export default JobsPage;
