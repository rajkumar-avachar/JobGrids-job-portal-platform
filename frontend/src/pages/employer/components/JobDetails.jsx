import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import useJobDetails from "../../../hooks/useJobDetails";
import { SquarePen, Eye, MapPin, Briefcase } from "lucide-react";

const JobDetails = () => {
  const { id } = useParams();
  useJobDetails(id);
  const { jobDetails } = useSelector((store) => store.job);
  const { loading } = useSelector((store) => store.job);

  useEffect(() => {
    document.title = `${jobDetails?.title} | JobGrids`;
  }, [jobDetails]);

  if (!jobDetails) {
    return (
      <div
        style={{
          height: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p className="text-muted">No job details found.</p>
      </div>
    );
  }

  const {
    _id,
    title,
    location,
    jobType,
    workMode,
    salary,
    experience,
    openings,
    description,
    requirements,
    skills,
    applications,
    createdAt,
  } = jobDetails;


  if (loading) {
    return (
      <div
        style={{
          height: "80vh",
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
      <div className="d-flex justify-content-between">
        <h3 className="fw-bold">Job Details</h3>
        <div className="d-flex gap-2">
          <Link
            to={`/employer/job-postings/${_id}/edit`}
            className="text-decoration-none"
          >
            <button className="btn btn-light border">
              <SquarePen size={16} className="me-2" />
              Edit Job
            </button>
          </Link>
          <Link to={"/employer/applications"} className="text-decoration-none">
            <button className="btn bg-blue">
              <Eye size={16} className="me-2" />
              View Applications
            </button>
          </Link>
        </div>
      </div>

      <div className="row my-4">
        <div className="col-8">
          <div className="border p-4 rounded-3 shadow-sm bg-white">
            <h5 className="fw-semibold">{title}</h5>
            <div className="fs-14 my-3">
              <span className="text-muted">
                <MapPin size={16} className="me-1" />
                {location}
              </span>
              <span className="text-muted mx-4 fw-lighter">|</span>
              <span className="text-muted">&#8377; {salary}</span>
              <span className="text-muted mx-4 fw-lighter">|</span>
              <span className="text-muted">
                <Briefcase size={16} className="me-1" />
                {experience}
              </span>
            </div>
            <hr />
            <div className="fs-14">
              <div>
                <span className="fw-semibold">Job Type: </span>{" "}
                <span className="text-muted">{jobType}</span>
              </div>
              <div className="mt-2">
                <span className="fw-semibold">Work Mode: </span>{" "}
                <span className="text-muted">{workMode}</span>
              </div>
            </div>
          </div>
          <div className="border p-4 rounded-3 shadow-sm bg-white mt-4">
            <h6 className="fw-semibold">Job Description</h6>
            <p className="fs-14">{description}</p>
            <h6 className="fw-semibold mt-4">Requirements</h6>
            <p className="fs-14">{requirements}</p>
            <h6 className="fw-semibold mt-4">Skills Required</h6>
            <div className="d-flex flex-wrap gap-2 mt-3">
              {skills.map((skill, index) => (
                <span
                  class="badge rounded-pill text-bg-light text-muted fw-normal border fs-14"
                  key={skill}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="col-4">
          <div className="border p-4 rounded-3 shadow-sm bg-white">
            <h5 className="fw-semibold">Job Status</h5>
            <div className="fs-14 d-flex flex-column gap-2 mt-3">
              <div className="d-flex justify-content-between">
                <span>Applications</span>
                <span className="fw-bold">{applications?.length}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Openings</span>
                <span>{openings}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Posted Date</span>
                <span>
                  {new Date(createdAt)
                    .toLocaleDateString("en-GB")
                    .replaceAll("/", "-")}
                </span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Application Deadline</span>
                <span>04-06-2025</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
