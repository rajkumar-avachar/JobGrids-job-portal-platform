import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilters, resetFilters } from "../../../redux/jobSlice";

const JobFilters = ({ onApply }) => {
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
    if (onApply) onApply();
  };

  const handleReset = () => {
    dispatch(resetFilters());
    if (onApply) onApply();
  };

  return (
    <div className="hover-shadow-sm border p-4 rounded-4 bg-white">
      <p className="fw-bold fs-5 mb-4 d-none d-lg-block">Filters</p>
      
      <div className="mb-4 fs-15">
        <label className="form-label fw-bold text-dark">Job Type</label>
        <div className="d-flex flex-column gap-2 mt-2">
          {["Full-Time", "Part-Time", "Internship", "Remote"].map((type) => (
            <div className="form-check custom-checkbox" key={type}>
              <input
                className="form-check-input"
                type="checkbox"
                id={`filter-${type}`}
                value={type}
                checked={selectedJobTypes.includes(type)}
                onChange={() => handleJobTypeChange(type)}
              />
              <label className="form-check-label text-muted" htmlFor={`filter-${type}`}>
                {type}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4 fs-15">
        <label className="form-label fw-bold text-dark">Experience Level</label>
        <div className="d-flex flex-column gap-2 mt-2">
          {["Fresher", "0-1 year", "1-3 years", "3-5 years", "5+ years"].map((exp) => (
            <div className="form-check custom-checkbox" key={exp}>
              <input
                className="form-check-input"
                type="checkbox"
                id={`filter-${exp}`}
                value={exp}
                checked={selectedExp.includes(exp)}
                onChange={() => handleExpChange(exp)}
              />
              <label className="form-check-label text-muted" htmlFor={`filter-${exp}`}>
                {exp}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4 fs-15">
        <label className="form-label fw-bold text-dark">Salary Range</label>
        <div className="d-flex flex-column gap-2 mt-2">
          {["Up to 3 LPA", "3 LPA - 5 LPA", "5 LPA - 10 LPA", "Above 10 LPA"].map((range) => (
            <div className="form-check custom-radio" key={range}>
              <input
                className="form-check-input"
                type="radio"
                name="salaryRange"
                id={`filter-${range}`}
                value={range}
                checked={selectedSalary === range}
                onChange={(e) => setSelectedSalary(e.target.value)}
              />
              <label className="form-check-label text-muted" htmlFor={`filter-${range}`}>
                {range}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-5 d-flex flex-column gap-2">
        <button onClick={handleApply} className="btn bg-blue w-100 py-2 fs-14 fw-semibold">
          Apply Filters
        </button>
        <button onClick={handleReset} className="btn btn-light border w-100 py-2 fs-14 fw-semibold text-muted">
          Reset All
        </button>
      </div>
    </div>
  );
};

export default JobFilters;
