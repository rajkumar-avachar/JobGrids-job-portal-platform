import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { MapPin, Search } from "lucide-react";
import JobPostingActions from "./components/JobPostingActions";
import useEmployerJobs from "../../hooks/useEmployerJobs";
import { useSelector } from "react-redux";

const JobPostings = () => {
  useEmployerJobs();
  const { employerJobs, loading } = useSelector((store) => store.job);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredJobs = employerJobs?.filter((job) => {
    const jobTitle = job.title?.toLowerCase() || "";
    const jobLocation = job.location?.toLowerCase() || "";
    const searchLow = searchTerm.toLowerCase();

    return jobTitle.includes(searchLow) || jobLocation.includes(searchLow);
  });

  useEffect(() => {
    document.title = "Job Postings | JobGrids";
  }, [employerJobs]);

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
      <h3 className="fw-bold mb-1">Job Postings</h3>
      <p className="text-muted">
        Manage your job listings and track applications
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
            placeholder="Search by job title or location..."
            className="form-control ps-5 fs-14 lh-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <TableContainer component={Paper} className="border rounded-3 p-3 my-5">
        <h6 className="fw-semibold">Jobs ({filteredJobs?.length})</h6>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left" className="fw-semibold">
                Job Title
              </TableCell>
              <TableCell align="left" className="fw-semibold">
                Location
              </TableCell>
              <TableCell align="left" className="fw-semibold">
                Work Mode
              </TableCell>
              <TableCell align="left" className="fw-semibold">
                Job Type
              </TableCell>
              <TableCell align="left" className="fw-semibold">
                Salary
              </TableCell>
              <TableCell align="left" className="fw-semibold">
                Applications
              </TableCell>
              <TableCell align="left" className="fw-semibold">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredJobs?.map((job) => (
              <TableRow
                key={job._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {job.title}
                </TableCell>
                <TableCell align="left" className="">
                  <MapPin size={14} className="me-1" />
                  {job.location}
                </TableCell>
                <TableCell align="left">{job.workMode}</TableCell>
                <TableCell align="left">{job.jobType}</TableCell>
                <TableCell align="left">&#8377;{job.salary}</TableCell>
                <TableCell align="left">
                  <span className="badge text-dark fw-semibold bg-light fs-14">
                    {job.applications?.length || 0}
                  </span>
                </TableCell>
                <TableCell align="left">
                  <JobPostingActions job={job} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default JobPostings;
