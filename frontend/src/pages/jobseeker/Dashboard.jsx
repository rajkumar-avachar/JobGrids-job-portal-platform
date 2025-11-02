import React, { useEffect, useState } from "react";
import {
  Briefcase,
  Users,
  UserCheck,
  Bookmark,
  Search,
  Clock,
  X,
  CircleCheckBig,
  CircleX,
} from "lucide-react";
import useApplications from "../../hooks/useApplications";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { badgeClasses } from "@mui/material";
import { APPLICATION_API } from "../../utils/apis";
import { toast } from "react-toastify";
import axios from "axios";
import { setApplications } from "../../redux/applicationSlice";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },

  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const Dashboard = () => {
  useApplications("jobseeker");
  const { applications } = useSelector((store) => store.application);
  const [status, setStatus] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    document.title = "JobSeeker Dashboard | JobGrids";
  }, []);

  const renderStatus = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="badge bg-warning fs-12">
            <Clock size={14} className="me-1" /> Pending
          </span>
        );
      case "shortlisted":
        return (
          <span className="badge bg-primary fs-12">
            <CircleCheckBig size={14} className="me-1" /> Shortlisted
          </span>
        );
      case "rejected":
        return (
          <span className="badge bg-danger fs-12">
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

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredApplications = applications?.filter((application) => {
    // if (!application.job) return false;
    const matchStatus =
      statusFilter === "all" ||
      (status[application._id] || application.status) === statusFilter;

    const jobTitle = application.job?.title?.toLowerCase() || "";
    const companyName = application.company?.name?.toLowerCase() || "";
    const matchSearch =
      jobTitle.includes(searchTerm.toLowerCase()) ||
      companyName.includes(searchTerm.toLowerCase()) ||
      searchTerm === "";

    return matchStatus && matchSearch;
  });

  const cancelApplication = async (appId) => {
    try {
      const res = await axios.delete(`${APPLICATION_API}/${appId}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(
          setApplications(applications.filter((app) => app._id !== appId))
        );
        toast.success("Application cancelled", {
          position: "top-right",
          autoClose: 1000,
          className: "bg-dark text-light fs-14",
          style: {
            minHeight: "45px",
          },
        });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to cancel application.",
        {
          position: "bottom-right",
          autoClose: 2000,
        }
      );
    }
  };

  return (
    <div className="bg-light py-5">
      <div className="container">
        <h3 className="fw-medium mb-4">My Applications</h3>
        <div className="row g-4">
          <div className="col-6 col-md-3 flex-grow-1">
            <div className="d-flex justify-content-between align-items-center border bg-white rounded-3 p-2 p-sm-4 hover-shadow-sm h-100">
              <div>
                <p className="text-muted fs-14 mb-0">Total Applications</p>
                <p className="fs-4 fw-bold mb-0 mt-2">{applications?.length}</p>
              </div>
              <div
                className="d-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded p-2"
                style={{ width: "40px", height: "40px" }}
              >
                <Briefcase size={20} className="text-primary" />
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3 flex-grow-1">
            <div className="d-flex justify-content-between align-items-center border bg-white rounded-3 p-2 p-sm-4 hover-shadow-sm h-100">
              <div>
                <p className="text-muted fs-14 mb-0">Shortlisted</p>
                <p className="fs-4 fw-bold mb-0 mt-2">
                  {
                    applications?.filter((app) => app.status === "shortlisted")
                      .length
                  }
                </p>
              </div>
              <div
                className="d-flex align-items-center justify-content-center bg-success bg-opacity-10 rounded p-2"
                style={{ width: "40px", height: "40px" }}
              >
                <UserCheck size={20} className="text-success" />
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3 flex-grow-1">
            <div className="d-flex justify-content-between align-items-center border bg-white rounded-3 p-2 p-sm-4 hover-shadow-sm h-100">
              <div>
                <p className="text-muted fs-14 mb-0">Pending</p>
                <p className="fs-4 fw-bold mb-0 mt-2">
                  {
                    applications?.filter((app) => app.status === "pending")
                      .length
                  }
                </p>
              </div>
              <div
                className="d-flex align-items-center justify-content-center bg-warning bg-opacity-10 rounded p-2"
                style={{ width: "40px", height: "40px" }}
              >
                <Clock size={20} className="text-warning" />
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3 flex-grow-1">
            <div className="d-flex justify-content-between align-items-center border bg-white rounded-3 p-2 p-sm-4 hover-shadow-sm h-100">
              <div>
                <p className="text-muted fs-14 mb-0">Rejected</p>
                <p className="fs-4 fw-bold mb-0 mt-2">
                  {
                    applications?.filter((app) => app.status === "rejected")
                      .length
                  }
                </p>
              </div>
              <div
                className="d-flex align-items-center justify-content-center bg-danger bg-opacity-10 rounded p-2"
                style={{ width: "40px", height: "40px" }}
              >
                <X size={20} className="text-danger" />
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex flex-wrap bg-light my-5 gap-3 justify-content-between">
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
              placeholder="Search by job or company"
              className="form-control ps-5 fs-14 lh-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="form-select bg-white fs-14 w-auto"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <TableContainer component={Paper} className="my-5">
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow className="bg-dark">
                <TableCell className="text-white">Job Title</TableCell>
                <TableCell className="text-white" align="left">
                  Company
                </TableCell>
                <TableCell className="text-white" align="left">
                  Applied on
                </TableCell>
                <TableCell className="text-white" align="left">
                  Status
                </TableCell>
                <TableCell className="text-white text-center" align="left">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredApplications?.map((application) => (
                <TableRow
                  key={application._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    className="fs-6 fw-semibold"
                  >
                    <Link
                      to={`/job/${application.job}`}
                      className="text-decoration-none"
                    >
                      {application.jobTitle}
                    </Link>
                  </TableCell>
                  <TableCell align="left">
                    {application.companyName}
                  </TableCell>
                  <TableCell align="left">
                    {new Date(application.createdAt)
                      .toLocaleDateString("en-GB")
                      .replaceAll("/", "-")}
                  </TableCell>
                  <TableCell align="left">
                    {/* {renderStatus(
                      status[application._id] || application.status
                    )} */}
                    {renderStatus(application.status)}
                  </TableCell>
                  <TableCell align="left" className="text-center">
                    <Button
                      variant="text"
                      color="error"
                      disabled={application.status !== "pending"}
                      onClick={() => cancelApplication(application._id)}
                    >
                      <CloseIcon />
                      &nbsp;Cancel
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default Dashboard;
