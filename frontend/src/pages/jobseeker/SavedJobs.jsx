import React from "react";
import { useSelector } from "react-redux";
import LatestJobCard from "../home/LatestJobCard";
import useSavedJobs from "../../hooks/useSavedJobs";

const SavedJobs = () => {
  useSavedJobs();
  const { savedJobs, loading } = useSelector((store) => store.job);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div className="container py-5 mt-5" style={{ minHeight: "70vh" }}>
      <h2 className="fw-bold mb-4">Saved Jobs</h2>
      {savedJobs?.length === 0 ? (
        <div className="text-center py-5">
          <img
            src="/placeholder/no-saved-jobs.svg"
            alt="No saved jobs"
            width={200}
            className="mb-3"
          />
          <p className="text-muted fs-5">You haven't saved any jobs yet.</p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {savedJobs?.map((job) => (
            <div key={job._id} className="col">
              <LatestJobCard job={job} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
