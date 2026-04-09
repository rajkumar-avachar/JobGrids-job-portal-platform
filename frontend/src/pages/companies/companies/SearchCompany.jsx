import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSearchedQuery } from "../../../redux/companySlice";

const SearchCompany = () => {
  const { searchedQuery } = useSelector((store) => store.company);
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
      <h3 className="fw-bold text-center">Browse Companies</h3>
      <div className="d-flex gap-3 p-3 p-md-4 border hover-shadow-sm mt-4 bg-white flex-wrap rounded-3">
        <div className="position-relative flex-grow-1">
          <i
            className="bi bi-search position-absolute top-50 start-0 ms-3 translate-middle-y text-muted"
            style={{ pointerEvents: "none" }}
          ></i>

          <input
            type="text"
            className="form-control ps-5 py-2 bg-input w-100"
            placeholder="Search companies..."
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
            Search Companies
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
  );
};

export default SearchCompany;
