import React from "react";
import LatestJobCard from "../../home/LatestJobCard";
import { useSelector, useDispatch } from "react-redux";
import EmptyState from "../../../components/EmptyState";
import { Briefcase } from "lucide-react";
import { setSearchedQuery, resetFilters } from "../../../redux/jobSlice";

const JobResults = () => {
  const dispatch = useDispatch();
  const { jobs } = useSelector((store) => store.job);

  const handleReset = () => {
    dispatch(setSearchedQuery({ keyword: "", location: "" }));
    dispatch(resetFilters());
  };

  return (
    <div className="col px-0">
      {jobs?.length > 0 ? (
        <>
          <p className="text-muted">
            Found <b>{jobs?.length}</b> jobs
            <hr />
          </p>
          <div className="row row-cols-lg-2 gy-4">
            {jobs.map((job) => (
              <LatestJobCard job={job} key={job._id} />
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          icon={Briefcase}
          title="No jobs found"
          description="We couldn't find any job postings matching your current criteria. Try adjusting your search query, clearing active filters, or checking back later."
          actionText="Reset Search & Filters"
          onAction={handleReset}
        />
      )}
    </div>
  );
};

export default JobResults;
