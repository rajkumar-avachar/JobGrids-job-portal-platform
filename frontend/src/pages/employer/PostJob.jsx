import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setLoading, setUser } from "../../redux/authSlice";
import { JOBS_API } from "../../utils/apis";

const PostJob = () => {
  const { user } = useSelector((store) => store.auth);
  const { loading } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [input, setInput] = useState({
    title: "",
    location: "",
    salary: "",
    salaryRange: "",
    experience: "",
    experienceLevel: "",
    jobType: "",
    workMode: "",
    openings: "",
    description: "",
    requirements: "",
    skills: "",
  });

  useEffect(() => {
    document.title = "Post a Job | JobGrids";
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to post a job.", {
        position: "bottom-right",
        autoClose: 2000,
      });
      return;
    }
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${JOBS_API}/`, input, {
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success("Job posted successfully!", {
          position: "bottom-right",
          autoClose: 2000,
        });
        navigate("/employer/job-postings", { replace: true });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post job.", {
        position: "bottom-right",
        autoClose: 2000,
      });
    } finally {
      dispatch(setLoading(false));
    }
  };
  return (
    <div className="p-4 bg-light h-100">
      <h3 className="fw-bold mb-0">Post New Job</h3>
      <p className="text-muted">
        Create a detailed job posting to attract the right candidates
      </p>
      <div className="border bg-white col-10 mx-auto p-4 my-4 rounded-3 shadow-sm">
        <form className="row" onSubmit={handleFormSubmit}>
          <div className="mb-4 col-6">
            <label htmlFor="title" className="form-label fs-14">
              Job Title *
            </label>
            <input
              type="text"
              className="form-control bg-light"
              placeholder="e.g., Java Developer"
              id="title"
              name="title"
              onChange={handleInputChange}
              value={input.title}
              required
            />
          </div>
          <div className="mb-4 col-6">
            <label htmlFor="location" className="form-label fs-14">
              Location *
            </label>
            <input
              type="text"
              className="form-control bg-light"
              placeholder="e.g., Pune, India"
              id="location"
              name="location"
              onChange={handleInputChange}
              value={input.location}
              required
            />
          </div>
          <div className="mb-4 col-6">
            <label htmlFor="jobType" className="form-label fs-14">
              Job Type *
            </label>
            <select
              className="form-select bg-light"
              id="jobType"
              name="jobType"
              onChange={handleInputChange}
              value={input.jobType}
              required
            >
              <option value="">Select Job Type</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
          <div className="mb-4 col-6">
            <label htmlFor="workMode" className="form-label fs-14">
              Work Mode *
            </label>
            <select
              className="form-select bg-light"
              id="workMode"
              name="workMode"
              onChange={handleInputChange}
              value={input.workMode}
              required
            >
              <option value="">Select Work Mode</option>
              <option value="Onsite">On-site</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          <div className="mb-4 col-6">
            <label htmlFor="salaryRange" className="form-label fs-14">
              Salary Category (for search filters) *
            </label>
            <select
              className="form-select bg-light"
              id="salaryRange"
              name="salaryRange"
              onChange={handleInputChange}
              value={input.salaryRange}
              required
            >
              <option value="">Select Category</option>
              <option value="Up to 3 LPA">Up to 3 LPA</option>
              <option value="3 LPA - 5 LPA">3 LPA - 5 LPA</option>
              <option value="5 LPA - 10 LPA">5 LPA - 10 LPA</option>
              <option value="Above 10 LPA">Above 10 LPA</option>
            </select>
          </div>
          <div className="mb-4 col-6">
            <label htmlFor="salary" className="form-label fs-14">
              Exact Salary or Details (e.g., 6.5 LPA)
            </label>
            <input
              type="text"
              className="form-control bg-light"
              placeholder="e.g., 6.5 LPA, Negotiable"
              id="salary"
              name="salary"
              onChange={handleInputChange}
              value={input.salary}
            />
          </div>
          <div className="mb-4 col-6">
            <label htmlFor="experienceLevel" className="form-label fs-14">
              Experience Category (for filters) *
            </label>
            <select
              className="form-select bg-light"
              id="experienceLevel"
              name="experienceLevel"
              onChange={handleInputChange}
              value={input.experienceLevel}
              required
            >
              <option value="">Select Category</option>
              <option value="Fresher">Fresher</option>
              <option value="0-1 year">0-1 year</option>
              <option value="1-3 years">1-3 years</option>
              <option value="3-5 years">3-5 years</option>
              <option value="5+ years">5+ years</option>
            </select>
          </div>
          <div className="mb-4 col-6">
            <label htmlFor="experience" className="form-label fs-14">
              Exact Experience (e.g., 1.5 years)
            </label>
            <input
              type="text"
              className="form-control bg-light"
              placeholder="e.g., 1.5 years, 6 months"
              id="experience"
              name="experience"
              onChange={handleInputChange}
              value={input.experience}
            />
          </div>
          <div className="mb-4 col-6">
            <label htmlFor="openings" className="form-label fs-14">
              Openings
            </label>
            <input
              type="number"
              className="form-control bg-light"
              placeholder="e.g., 5, 10"
              id="openings"
              name="openings"
              onChange={handleInputChange}
              value={input.openings}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="form-label fs-14">
              Job Description *
            </label>
            <textarea
              className="form-control bg-light"
              placeholder="Describe the role and responsibilities..."
              id="description"
              name="description"
              rows={4}
              onChange={handleInputChange}
              value={input.description}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="requirements" className="form-label fs-14">
              Requirements
            </label>
            <textarea
              className="form-control bg-light"
              placeholder="Education, qualifications, and other requirements..."
              id="requirements"
              name="requirements"
              rows={3}
              onChange={handleInputChange}
              value={input.requirements}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="skills" className="form-label fs-14">
              Skills Required *
            </label>
            <input
              type="text"
              className="form-control bg-light"
              placeholder="e.g., JavaScript, Python, etc"
              id="skills"
              name="skills"
              onChange={handleInputChange}
              value={input.skills}
              required
            />
          </div>
          <div className="text-end">
            <button
              type="submit"
              className="btn bg-blue px-5"
              disabled={loading}
            >
              {loading && (
                <span className="spinner-border spinner-border-sm me-2"></span>
              )}
              {loading ? "Posting a Job..." : "Post Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
