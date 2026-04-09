import React, { useEffect } from "react";
import SearchJobs from "./SearchJobs";
import JobFilters from "./JobFilters";
import JobResults from "./JobResults";
import useJobs from "../../../hooks/useJobs";
import { useDispatch } from "react-redux";
import { setSearchedQuery, resetFilters } from "../../../redux/jobSlice";

const JobsPage = () => {
  const dispatch = useDispatch();
  useJobs();

  useEffect(() => {
    document.title = "Jobs | JobGrids";
    // Reset search and filters on mount/refresh
    dispatch(setSearchedQuery({ keyword: "", location: "" }));
    dispatch(resetFilters());
  }, [dispatch]);

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
