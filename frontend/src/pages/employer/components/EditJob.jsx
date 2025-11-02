import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { MapPin, Users, Calendar, Globe, Pencil } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { setLoading } from "../../../redux/jobSlice";
import { JOBS_API } from "../../../utils/apis";

const EditJob = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id } = useParams();

  const { user } = useSelector((store) => store.auth);
  const { jobDetails } = useSelector((store) => store.job);
  const { loading } = useSelector((store) => store.job);

  const [input, setInput] = useState({
    title: "",
    location: "",
    salary: "",
    experience: "",
    jobType: "",
    workMode: "",
    openings: "",
    description: "",
    requirements: "",
    skills: "",
  });

  useEffect(() => {
    document.title = "Edit Job | JobGrids";
  }, []);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        dispatch(setLoading(true));
        const res = await axios.get(`${JOBS_API}/${id}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setInput({
            title: res.data.job.title || "",
            location: res.data.job.location || "",
            salary: res.data.job.salary || "",
            experience: res.data.job.experience || "",
            jobType: res.data.job.jobType || "",
            workMode: res.data.job.workMode || "",
            openings: res.data.job.openings || "",
            description: res.data.job.description || "",
            requirements: res.data.job.requirements || "",
            skills: res.data.job.skills || "",
          });
        }
      } catch (error) {
        toast.error(error.response?.data?.message, {
          position: "bottom-right",
          autoClose: 2000,
        });
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchJobDetails();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to edit your job.");
      return;
    }
    try {
      dispatch(setLoading(true));
      const res = await axios.put(`${JOBS_API}/${id}`, input, {
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success("Job updated successfully", {
          position: "bottom-right",
          autoClose: 2000,
        });
        navigate(`/employer/job-postings/${id}`, { replace: true });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to Update Job.", {
        position: "bottom-right",
        autoClose: 2000,
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  if (loading) {
    return (
      <div
        style={{
          height: "90vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          className="spinner-border text-primary"
          role="status"
          style={{ width: "3rem", height: "3rem" }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-light h-100">
      <h3 className="fw-bold mb-0">Edit Job</h3>
      <p className="text-muted">
        Create a detailed job posting to attract the right candidates
      </p>
      <div className="border bg-white col-10 mx-auto p-4 my-4 rounded-3 shadow-sm">
        <form className="row" onSubmit={handleSubmit}>
          <div className="mb-4 col-6">
            <label htmlFor="title" className="form-label fs-14">
              Job Title *
            </label>
            <input
              type="text"
              className="form-control bg-light"
              placeholder="e.g., ABC Technologies"
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
            <label htmlFor="salary" className="form-label fs-14">
              Salary Range
            </label>
            <input
              type="text"
              className="form-control bg-light"
              placeholder="e.g., 3-5 LPA"
              id="salary"
              name="salary"
              onChange={handleInputChange}
              value={input.salary}
            />
          </div>
          <div className="mb-4 col-6">
            <label htmlFor="experience" className="form-label fs-14">
              Experience Required
            </label>
            <input
              type="text"
              className="form-control bg-light"
              placeholder="e.g., 1-2 years"
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
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJob;
