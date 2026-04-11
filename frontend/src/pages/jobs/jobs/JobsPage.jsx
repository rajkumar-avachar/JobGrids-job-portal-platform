import React, { useEffect, useState } from "react";
import SearchJobs from "./SearchJobs";
import JobFilters from "./JobFilters";
import JobResults from "./JobResults";
import useJobs from "../../../hooks/useJobs";
import { useDispatch } from "react-redux";
import { setSearchedQuery, resetFilters } from "../../../redux/jobSlice";
import { Filter, X } from "lucide-react";

const JobsPage = () => {
  const dispatch = useDispatch();
  useJobs();

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    document.title = "Jobs | JobGrids";
    // Reset search and filters on mount/refresh
    dispatch(setSearchedQuery({ keyword: "", location: "" }));
    dispatch(resetFilters());
  }, [dispatch]);

  // Prevent body scroll when mobile filter is open
  useEffect(() => {
    if (showMobileFilters) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [showMobileFilters]);

  return (
    <div className="bg-light py-5">
      <div className="container">
        <SearchJobs />
        
        {/* Mobile Filter Button */}
        <div className="d-lg-none mb-3">
          <button 
            className="btn btn-white border w-100 d-flex align-items-center justify-content-center gap-2 py-2 fw-semibold shadow-sm"
            onClick={() => setShowMobileFilters(true)}
          >
            <Filter size={20} className="text-primary" />
            Filter Jobs
          </button>
        </div>

        <div className="main row gap-lg-4 m-0 mb-5">
          {/* Desktop Filters */}
          <div className="col-lg-3 d-none d-lg-block p-0">
            <JobFilters />
          </div>

          {/* Mobile Filters (Offcanvas style) */}
          {showMobileFilters && (
            <div 
              className="d-lg-none position-fixed top-0 start-0 w-100 h-100 bg-black bg-opacity-50 filter-overlay"
              style={{ zIndex: 2000 }}
              onClick={() => setShowMobileFilters(false)}
            >
              <div 
                className="bg-white h-100 w-75 p-0 filter-drawer"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="d-flex justify-content-between align-items-center p-4 border-bottom">
                  <h5 className="fw-bold mb-0">Filters</h5>
                  <button 
                    className="btn btn-light btn-sm rounded-circle p-1" 
                    onClick={() => setShowMobileFilters(false)}
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="p-4 overflow-auto" style={{ height: 'calc(100% - 70px)' }}>
                  <JobFilters onApply={() => setShowMobileFilters(false)} />
                </div>
              </div>
            </div>
          )}

          <JobResults />
        </div>
      </div>
    </div>
  );
};

export default JobsPage;
