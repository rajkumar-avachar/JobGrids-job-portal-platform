import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilters, resetFilters } from "../../../redux/jobSlice";

const JobFilters = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector((store) => store.job);

  const [selectedJobTypes, setSelectedJobTypes] = useState(filters?.jobTypes || []);
  const [selectedExp, setSelectedExp] = useState(filters?.experience || []);
  const [selectedSalary, setSelectedSalary] = useState(filters?.salary || "");

  useEffect(() => {
    setSelectedJobTypes(filters?.jobTypes || []);
    setSelectedExp(filters?.experience || []);
    setSelectedSalary(filters?.salary || "");
  }, [filters]);

  const handleJobTypeChange = (value) => {
    const updated = selectedJobTypes.includes(value)
      ? selectedJobTypes.filter((type) => type !== value)
      : [...selectedJobTypes, value];
    setSelectedJobTypes(updated);
  };

  const handleExpChange = (value) => {
    const updated = selectedExp.includes(value)
      ? selectedExp.filter((exp) => exp !== value)
      : [...selectedExp, value];
    setSelectedExp(updated);
  };

  const handleApply = () => {
    dispatch(
      setFilters({
        jobTypes: selectedJobTypes,
        experience: selectedExp,
        salary: selectedSalary,
      })
    );
  };

  const handleReset = () => {
    dispatch(resetFilters());
  };

  return (
    <div className="hover-shadow-sm border col-3 p-4 rounded-3 d-none d-lg-block h-100 bg-white ">
      <p className="fw-bold fs-5">Filters</p>
      
      <div className="mb-3 fs-15">
        <label className="form-label fw-semibold">Job Type</label>
        {["Full-Time", "Part-Time", "Internship", "Remote"].map((type) => (
          <div className="form-check" key={type}>
            <input
              className="form-check-input border-primary"
              type="checkbox"
              id={type}
              value={type}
              checked={selectedJobTypes.includes(type)}
              onChange={() => handleJobTypeChange(type)}
            />
            <label className="form-check-label text-muted" htmlFor={type}>
              {type}
            </label>
          </div>
        ))}
      </div>

      <div className="mb-3 fs-15">
        <label className="form-label fw-semibold">Experience Level</label>
        {["Fresher", "0-1 year", "1-3 years", "3-5 years", "5+ years"].map((exp) => (
          <div className="form-check" key={exp}>
            <input
              className="form-check-input border-primary"
              type="checkbox"
              id={exp}
              value={exp}
              checked={selectedExp.includes(exp)}
              onChange={() => handleExpChange(exp)}
            />
            <label className="form-check-label text-muted" htmlFor={exp}>
              {exp}
            </label>
          </div>
        ))}
      </div>

      <div className="mb-3 fs-15">
        <label className="form-label fw-semibold">Salary Range</label>
        {["Up to 3 LPA", "3 LPA - 5 LPA", "5 LPA - 10 LPA", "Above 10 LPA"].map((range) => (
          <div className="form-check" key={range}>
            <input
              className="form-check-input border-primary"
              type="radio"
              name="salaryRange"
              id={range}
              value={range}
              checked={selectedSalary === range}
              onChange={(e) => setSelectedSalary(e.target.value)}
            />
            <label className="form-check-label text-muted" htmlFor={range}>
              {range}
            </label>
          </div>
        ))}
      </div>

      <div className="text-center mt-5 d-flex flex-column gap-3 align-items-center">
        <button onClick={handleApply} className="btn text-light bg-blue w-75 fs-14">
          Apply Filters
        </button>
        <button onClick={handleReset} className="btn btn-light border w-75 fs-14">
          Reset Filters
        </button>
      </div>
    </div>
  );
};


export default JobFilters;
