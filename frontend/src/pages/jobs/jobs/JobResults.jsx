import React from "react";
import LatestJobCard from "../../home/LatestJobCard";
import { useSelector } from "react-redux";

const JobResults = () => {
  const { jobs, loading } = useSelector((store) => store.job);

  if (loading) {
    return (
      <div className="col px-0 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "300px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-muted">Searching for jobs...</p>
      </div>
    );
  }

  return (
    <div className="col px-0">
      <p className="text-muted">
        Found <b>{jobs?.length}</b> jobs
        <hr />
      </p>
      <div className="row row-cols-lg-2 gy-4">
        {jobs?.map((job) => (
          <LatestJobCard job={job} key={job._id} />
        ))}
        {jobs?.length === 0 && (
          <div className="col-12 text-center py-5">
            <h5 className="text-muted">No jobs found matching your criteria.</h5>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobResults;
