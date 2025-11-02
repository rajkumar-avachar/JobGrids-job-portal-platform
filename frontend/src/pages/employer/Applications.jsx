import React, { useEffect, useState } from "react";
import {
  Search,
  MapPin,
  Eye,
  AppleIcon,
  Clock,
  CircleCheckBig,
  CircleX,
} from "lucide-react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useSelector } from "react-redux";
import useApplications from "../../hooks/useApplications";
import { Link } from "react-router-dom";
import axios from "axios";
import { APPLICATION_API } from "../../utils/apis";
import { toast } from "react-toastify";

const Applications = () => {
  useApplications("employer");
  const { applications, loading } = useSelector((store) => store.application);
  const { employerJobs } = useSelector((store) => store.job);
  const jobTitles = [...new Set(employerJobs?.map((job) => job.title))];
  const [status, setStatus] = useState({});

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [positionFilter, setPositionFilter] = useState("all");

   useEffect(() => {
    document.title = "Applications | JobGrids";
  }, [applications]);

  const filteredApplications = applications?.filter((application) => {
    if (!application.job) return false;
    const matchStatus =
      statusFilter === "all" ||
      (status[application._id] || application.status) === statusFilter;
    const matchPosition =
      positionFilter === "all" || application.job?.title === positionFilter;

    const candidateName = application.applicant?.fullname?.toLowerCase() || "";
    const jobTitle = application.job?.title?.toLowerCase() || "";
    const matchSearch =
      candidateName.includes(searchTerm.toLowerCase()) ||
      jobTitle.includes(searchTerm.toLowerCase()) ||
      searchTerm === "";

    return matchStatus && matchPosition && matchSearch;
  });

  const statusHandler = async (appId, newStatus) => {
    setStatus((prev) => ({ ...prev, [appId]: newStatus }));

    try {
      const res = await axios.put(
        `${APPLICATION_API}/${appId}`,
        { status: newStatus },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(`Application status set to ${newStatus}`, {
          position: "top-right",
          autoClose: 1000,
          className: "bg-dark text-light fs-14",
          style: {
            minHeight: "45px",
          },
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status.", {
        position: "bottom-right",
        autoClose: 2000,
      });
    }
  };

  const renderStatus = (status) => {
    switch (status) {
      case "pending":
        return (
          // <span className="fs-12 d-inline-flex align-items-center gap-2 px-2 py-1 rounded-pill bg-warning-subtle text-warning fw-medium">
          //   <Clock size={14} /> Pending
          // </span>
          <span class="badge bg-warning fs-12">
            <Clock size={14} className="me-1" /> Pending
          </span>
        );
      case "shortlisted":
        return (
          // <span className="fs-12 d-inline-flex align-items-center gap-2 px-2 py-1 rounded-pill bg-success-subtle text-success fw-medium">
          //   <CircleCheckBig size={14} /> Shortlisted
          // </span>
          <span class="badge bg-primary fs-12">
            <CircleCheckBig size={14} className="me-1" /> Shortlisted
          </span>
        );
      case "rejected":
        return (
          // <span className="fs-12 d-inline-flex align-items-center gap-2 px-2 py-1 rounded-pill bg-danger-subtle text-danger fw-medium">
          //   <CircleX size={14} /> Rejected
          // </span>
          <span class="badge bg-danger fs-12">
            <CircleX size={14} className="me-1" /> Rejected
          </span>
        );
      default:
        return (
          <span className="fs-12 d-inline-flex align-items-center gap-2 px-2 py-1 rounded-pill bg-secondary-subtle text-secondary fw-medium">
            {status}
          </span>
        );
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
      <h3 className="fw-bold mb-1">Applications</h3>
      <p className="text-muted">
        Review and manage job applications from candidates
      </p>
      <div className="d-flex bg-light my-5 gap-3 justify-content-between">
        <div style={{ position: "relative" }} className="flex-grow-1">
          <Search
            size={18}
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#64748b",
            }}
          />
          <input
            type="text"
            placeholder="Search by candidate name or position..."
            className="form-control ps-5 fs-14 lh-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="form-select bg-white w-auto fs-14"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="rejected">Rejected</option>
        </select>

        <select
          className="form-select bg-white w-auto fs-14"
          value={positionFilter}
          onChange={(e) => setPositionFilter(e.target.value)}
        >
          <option value="all">All Positions</option>
          {jobTitles.map((title) => (
            <option key={title} value={title}>
              {title}
            </option>
          ))}
        </select>
      </div>

      <TableContainer component={Paper} className="border rounded-3 p-3 my-5">
        <h6 className="fw-semibold">
          Applications ({filteredApplications?.length})
        </h6>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left" className="fw-semibold">
                Candidate
              </TableCell>
              <TableCell align="left" className="fw-semibold">
                Position
              </TableCell>
              <TableCell align="left" className="fw-semibold">
                Applied Date
              </TableCell>
              <TableCell align="left" className="fw-semibold">
                Status
              </TableCell>
              <TableCell align="left" className="fw-semibold">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredApplications?.map((application) => (
              <TableRow
                key={application._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {application.applicant?.fullname}
                </TableCell>
                <TableCell align="left">
                  {application.job?.title || (
                    <i className="text-danger">Deleted Job</i>
                  )}
                </TableCell>
                <TableCell align="left">
                  {new Date(application.createdAt)
                    .toLocaleDateString("en-GB")
                    .replaceAll("/", "-")}
                </TableCell>
                <TableCell align="left">
                  {renderStatus(status[application._id] || application.status)}
                </TableCell>
                <TableCell align="left" style={{ width: "300px" }}>
                  <div className="d-flex gap-2 align-items-center">
                    <a
                      href={application.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-decoration-none d-flex align-items-center gap-1 bg-secondary text-light rounded-2 px-2 py-1"
                    >
                      <Eye size={16} />
                      View Resume
                    </a>
                    <select
                      name="status"
                      className="form-select bg-light fs-14 w-auto py-1"
                      onChange={(e) =>
                        statusHandler(application._id, e.target.value)
                      }
                      value={status[application._id] || application.status}
                    >
                      <option value="pending" disabled>
                        Pending
                      </option>
                      <option value="shortlisted">Shortlist</option>
                      <option value="rejected">Reject</option>
                    </select>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Applications;
