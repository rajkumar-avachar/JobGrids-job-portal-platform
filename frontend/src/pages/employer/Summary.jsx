import React, { useEffect, useState } from "react";
import { Briefcase, Users, UserCheck, Activity } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";
import { COMPANY_API } from "../../utils/apis";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import moment from "moment";
import { toast } from "react-toastify";

const Summary = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    hiredCandidates: 0,
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApps, setRecentApps] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get(`${COMPANY_API}/dashboard-stats`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setStats(res.data.stats);
          setRecentJobs(res.data.recentJobs);
          setRecentApps(res.data.recentApplications);
          setChartData(res.data.applicationStats || []);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Dashboard Overview</h3>
          <p className="text-muted mb-0">Here's your hiring activity at a glance.</p>
        </div>
        <Link to="/employer/post-job" className="btn btn-primary px-4 py-2 fw-semibold">
          Post New Job
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-5">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100 rounded-4">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <p className="text-muted fw-semibold fs-15 mb-0">Total Jobs</p>
                <div className="bg-primary bg-opacity-10 p-2 rounded-3 text-primary">
                  <Briefcase size={20} />
                </div>
              </div>
              <h2 className="fw-bold mb-0">{stats.totalJobs}</h2>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100 rounded-4">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <p className="text-muted fw-semibold fs-15 mb-0">Active Jobs</p>
                <div className="bg-success bg-opacity-10 p-2 rounded-3 text-success">
                  <Activity size={20} />
                </div>
              </div>
              <h2 className="fw-bold mb-0">{stats.activeJobs}</h2>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100 rounded-4">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <p className="text-muted fw-semibold fs-15 mb-0">Total Applications</p>
                <div className="bg-warning bg-opacity-10 p-2 rounded-3 text-warning">
                  <Users size={20} />
                </div>
              </div>
              <h2 className="fw-bold mb-0">{stats.totalApplications}</h2>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100 rounded-4">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <p className="text-muted fw-semibold fs-15 mb-0">Hired / Shortlisted</p>
                <div className="bg-info bg-opacity-10 p-2 rounded-3 text-info">
                  <UserCheck size={20} />
                </div>
              </div>
              <h2 className="fw-bold mb-0">{stats.hiredCandidates}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="row g-4 mb-5">
        <div className="col-12">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">Applications Overview</h5>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0d6efd" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#0d6efd" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="applications"
                      stroke="#0d6efd"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorApps)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="row g-4">
        {/* Recent Jobs */}
        <div className="col-12 col-xl-6">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">Recent Job Postings</h5>
                <Link to="/employer/job-postings" className="text-decoration-none fw-medium fs-14">
                  View All
                </Link>
              </div>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light text-muted fs-14">
                    <tr>
                      <th className="fw-medium border-0 rounded-start">Job Title</th>
                      <th className="fw-medium border-0">Posted Date</th>
                      <th className="fw-medium border-0 rounded-end">Status</th>
                    </tr>
                  </thead>
                  <tbody className="border-top-0">
                    {recentJobs.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="text-center text-muted py-4">No jobs posted yet.</td>
                      </tr>
                    ) : (
                      recentJobs.map((job) => (
                        <tr key={job._id}>
                          <td>
                            <Link to={`/employer/job-postings/${job._id}`} className="text-dark fw-semibold text-decoration-none">
                              {job.title}
                            </Link>
                          </td>
                          <td className="text-muted fs-14">{moment(job.createdAt).format("MMM Do, YYYY")}</td>
                          <td>
                            {job.openings > 0 ? (
                              <span className="badge bg-success bg-opacity-10 text-success px-2 py-1 rounded-pill fw-normal">Active</span>
                            ) : (
                              <span className="badge bg-danger bg-opacity-10 text-danger px-2 py-1 rounded-pill fw-normal">Closed</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Applications */}
        <div className="col-12 col-xl-6">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">Recent Applications</h5>
                <Link to="/employer/applications" className="text-decoration-none fw-medium fs-14">
                  View All
                </Link>
              </div>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light text-muted fs-14">
                    <tr>
                      <th className="fw-medium border-0 rounded-start">Applicant</th>
                      <th className="fw-medium border-0">Role</th>
                      <th className="fw-medium border-0 rounded-end">Date</th>
                    </tr>
                  </thead>
                  <tbody className="border-top-0">
                    {recentApps.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="text-center text-muted py-4">No applications received yet.</td>
                      </tr>
                    ) : (
                      recentApps.map((app) => (
                        <tr key={app._id}>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              {app.applicant?.profile?.profilePhoto ? (
                                <img src={app.applicant.profile.profilePhoto} alt="avatar" width={32} height={32} className="rounded-circle object-fit-cover" />
                              ) : (
                                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: 32, height: 32, fontSize: 14}}>
                                  {app.applicant?.fullname?.charAt(0) || 'U'}
                                </div>
                              )}
                              <span className="fw-semibold text-dark fs-15">{app.applicant?.fullname}</span>
                            </div>
                          </td>
                          <td className="text-muted fs-14">{app.jobTitle}</td>
                          <td className="text-muted fs-14">{moment(app.createdAt).fromNow()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;

