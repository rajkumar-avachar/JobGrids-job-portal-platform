import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase, MapPin, Wallet } from "lucide-react";
import UpdateOutlinedIcon from "@mui/icons-material/UpdateOutlined";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { JOBS_API } from "../../utils/apis.js";
import { setSavedJobs } from "../../redux/jobSlice.js";
import { toast } from "react-toastify";

const LatestJobCard = ({ job }) => {
  const { user } = useSelector((store) => store.auth);
  const { savedJobs } = useSelector((store) => store.job);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isSaved = savedJobs?.some((savedJob) => savedJob._id === job._id);

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
        { withCredentials: true },
      );

      if (res.data.success) {
        toast.success(res.data.message);
        // After toggle, we need to refresh the savedJobs list. 
        // For simplicity, we'll manually update if it's already in the list or not.
        if (isSaved) {
          dispatch(
            setSavedJobs(savedJobs.filter((item) => item._id !== job._id)),
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

  return (
    <Link to={`/job/${job._id}`} className="text-decoration-none">
      <div className="rounded-3 p-3 border hover-shadow-sm latestJobCard  bg-white h-100">
        <div className="d-flex align-items-center mb-3">
          <img
            src={job.company?.logo}
            alt="Logo"
            width={50}
            className="me-3 rounded-3"
          />
          <div>
            <h6 className="mb-1 text-black fw-semibold">{job.title}</h6>
            <h6 className="text-muted mb-0 fs-14">{job.company?.name}</h6>
          </div>
        </div>
        <div className="d-flex gap-3 flex-wrap fs-14">
          <div className="text-muted d-flex align-items-center">
            <MapPin size={14} />
            &nbsp;
            <p className="mb-0">
              {job.location} ({job.workMode})
            </p>
          </div>
          <div className="text-muted d-flex align-items-center ">
            <Wallet size={14} />
            &nbsp;
            <div className="mb-0">
              {job.salary !== "Not Disclosed" ? job.salary : (job.salaryRange || "Not Disclosed")}
            </div>
          </div>
          <div className="text-muted d-flex align-items-center">
            <Briefcase size={14} />
            &nbsp;
            <p className="mb-0">{job.experience !== "0 years" ? job.experience : (job.experienceLevel || "Fresher")}</p>
          </div>
        </div>
        <div className="mt-auto pt-3 d-flex align-items-center gap-3 fs-12">
          <div className="text-primary e rounded-pill px-1">
            <UpdateOutlinedIcon className="fs-6" />{" "}
            {moment(job.createdAt).fromNow()}
          </div>

          <div className="ms-auto px-2">
            {user?.role === "jobseeker" && (
              isSaved ? (
                <i
                  className="bi bi-bookmark-fill fs-5 text-primary"
                  onClick={handleSave}
                ></i>
              ) : (
                <i className="bi bi-bookmark fs-5" onClick={handleSave}></i>
              )
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default LatestJobCard;
