import React from "react";
import { useSelector } from "react-redux";
import LatestJobCard from "../home/LatestJobCard";
import useSavedJobs from "../../hooks/useSavedJobs";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import { Bookmark } from "lucide-react";

const SavedJobs = () => {
  useSavedJobs();
  const { savedJobs, loading } = useSelector((store) => store.job);

  if (loading) {
    return <Loader inline text="Loading saved jobs..." />;
  }

  return (
    <div className="container py-5 mt-5" style={{ minHeight: "70vh" }}>
      <h2 className="fw-bold mb-4">Saved Jobs</h2>
      {savedJobs?.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No saved jobs"
          description="You haven't saved any jobs yet. Browse jobs and click the save button to keep track of them."
        />
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
