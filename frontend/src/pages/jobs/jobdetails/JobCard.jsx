import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UpdateOutlinedIcon from "@mui/icons-material/UpdateOutlined";
import { Briefcase, MapPin, Wallet, Users } from "lucide-react";
import moment from "moment";
import numeral from "numeral";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { APPLICATION_API, JOBS_API } from "../../../utils/apis";
import { toast } from "react-toastify";
import { setJobDetails, setSavedJobs } from "../../../redux/jobSlice";

const JobCard = ({ job }) => {
  if (!job) return null;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const { savedJobs } = useSelector((store) => store.job);

  const isSaved = savedJobs?.some((savedJob) => savedJob._id === job._id);
  const [isApplied, setIsApplied] = useState(false);

  useEffect(() => {
    if (job && user) {
      const applied = job.applications?.some(
        (application) => application.applicant === user._id
      );
      setIsApplied(applied);
    }
  }, [job, user]);

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.info("Please login to save jobs");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.post(
        `${JOBS_API}/save/${job._id}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        if (isSaved) {
          dispatch(
            setSavedJobs(savedJobs.filter((item) => item._id !== job._id))
          );
        } else {
          dispatch(setSavedJobs([...savedJobs, job]));
        }
      }
    } catch (error) {
      console.error("Error toggling save job:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const data = {
    jobId: job._id,
    resume: user?.profile?.resume,
  };

  const applyJobHandler = async () => {
    if (!user) {
      navigate("/login");
    }
    try {
      const res = await axios.post(`${APPLICATION_API}/`, data, {
        withCredentials: true,
      });
      if (res.data.success) {
        setIsApplied(true);
        const updatedJobRes = await axios.get(`${JOBS_API}/${job._id}`);
        dispatch(setJobDetails(updatedJobRes.data.job));
        toast.success("Job aplication sent successfully", {
          position: "bottom-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong.", {
        position: "bottom-right",
        autoClose: 2000,
      });
    }
  };

  return (
    <div>
      <div className="py-3 stickyTop bg-light  d-flex align-items-center justify-content-between w-100">
        <Link to="/jobs" className="text-decoration-none fw-medium fs-14">
          <i class="bi bi-arrow-left"></i> Back to Jobs
        </Link>
        <div className="d-flex gap-4 me-3 d-sm-none">
          {user?.role === "jobseeker" && (
            isSaved ? (
              <i
                className="bi bi-bookmark-fill rounded-3 fs-4 text-primary"
                onClick={handleSave}
              ></i>
            ) : (
              <i
                className="bi bi-bookmark rounded-3 fs-4"
                onClick={handleSave}
              ></i>
            )
          )}
          <i className="bi bi-share rounded-3 fs-4"></i>
        </div>
      </div>
      <div className="shadow-sm rounded-3 p-3 p-sm-4 bg-white border">
        <div className="d-flex align-items-center mb-4">
          <img
            src={job.company?.logo}
            alt="Logo"
            width={60}
            className="me-3 rounded-3"
          />
          <div>
            <h5 className="mb-1 fw-semibold dark-blue">{job.title}</h5>
            <h5 className="text-muted mb-0 fs-18">{job.company.name}</h5>
          </div>
        </div>
        <div className="fs-14 my-3">
          <span className="text-muted">
            <MapPin size={16} className="me-1" />
            {job.location}
          </span>
          <span className="text-muted mx-4 fw-lighter">|</span>
          <span className="text-muted">&#8377; {job.salary}</span>
          <span className="text-muted mx-4 fw-lighter">|</span>
          <span className="text-muted">
            <Briefcase size={16} className="me-1" />
            {job.experience}
          </span>
        </div>
        {/* <div className="fs-14">
          <div>
            <span className="fw-semibold">Job Type: </span>{" "}
            <span className="text-muted">{job.jobType}</span>
          </div>
          <div className="mt-2">
            <span className="fw-semibold">Work Mode: </span>{" "}
            <span className="text-muted">{job.workMode}</span>
          </div>
        </div> */}
        <hr />
        <div className="mt-3 fs-15">
          <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-4">
            <div className="fs-14">
              <span className="text-muted">Posted: </span>
              <span className="fw-semibold">
                {moment(job.createdAt).fromNow()}
              </span>
              <span className="fw-lighter mx-2">|</span>
              <span className="text-muted">Openings: </span>
              <span className="fw-semibold">{job.openings}</span>
              <span className="fw-lighter mx-2">|</span>
              <span className="text-muted">Applications: </span>
              <span className="fw-semibold">
                {job.applications?.length || 0}
              </span>
            </div>
            <div className="d-flex gap-5  align-items-center flex-grow-1 justify-content-sm-end justify-content-evenly ms-auto">
            {user?.role === "jobseeker" && (
              isSaved ? (
                <i
                  className="bi bi-bookmark-fill rounded-3 fs-4 d-none d-sm-block text-primary"
                  onClick={handleSave}
                ></i>
              ) : (
                <i
                  className="bi bi-bookmark rounded-3 fs-4 d-none d-sm-block"
                  onClick={handleSave}
                ></i>
              )
            )}
              <i class="bi bi-share fs-5 rounded-3 d-none d-sm-block"></i>
              {isApplied ? (
                <button className="btn bg-blue fw-semibold px-4 disabled">
                  Already applied
                </button>
              ) : (
                <button
                  className="btn bg-blue fw-semibold px-4"
                  onClick={applyJobHandler}
                >
                  Apply Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
