import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSearchedQuery } from "../../../redux/jobSlice";

const SearchJobs = () => {
  const { searchedQuery } = useSelector((store) => store.job);
  const [keyword, setKeyword] = useState(searchedQuery?.keyword || "");
  const [location, setLocation] = useState(searchedQuery?.location || "");
  const dispatch = useDispatch();

  // Sync state if Redux state changes externally (e.g. on reset)
  useEffect(() => {
    setKeyword(searchedQuery?.keyword || "");
    setLocation(searchedQuery?.location || "");
  }, [searchedQuery]);

  const handleSearch = () => {
    dispatch(setSearchedQuery({ keyword, location }));
  };

  const handleClear = () => {
    setKeyword("");
    setLocation("");
    dispatch(setSearchedQuery({ keyword: "", location: "" }));
  };

  return (
    <div>
      <h3 className="fw-bold">Find Your Perfect Job</h3>
      <div className="col-12 mx-auto mt-4  p-4 mb-5 rounded-3 text-center border hover-shadow-sm bg-white">
        <div className="d-flex gap-3 flex-wrap col-md-12 mx-auto">
          <div className="position-relative flex-grow-1">
            <i
              className="bi bi-search position-absolute top-50 start-0 ms-3 translate-middle-y text-muted"
              style={{ pointerEvents: "none" }}
            ></i>

            <input
              type="text"
              className="form-control ps-5 py-2 bg-input w-100"
              placeholder="Job title, skill or company"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          <div className="position-relative flex-grow-1">
            <i
              className="bi bi-geo-alt position-absolute top-50 start-0 ms-3 translate-middle-y text-muted"
              style={{ pointerEvents: "none" }}
            ></i>

            <input
              type="text"
              className="form-control ps-5 py-2 bg-input w-100"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div
            className="mx-auto d-flex gap-2"
            style={{ flexBasis: "100%", maxWidth: "350px" }}
          >
            <button
              onClick={handleSearch}
              className="btn bg-blue text-light flex-grow-1 py-2 fw-medium fs-14"
            >
              Search Jobs
            </button>
            <button
              onClick={handleClear}
              className="btn btn-outline-secondary py-2 fw-medium fs-14 px-4"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchJobs;
