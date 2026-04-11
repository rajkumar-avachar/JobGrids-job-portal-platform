import React, { useEffect } from "react";
import Sidebar from "./components/Sidebar";
import { Routes, Route } from "react-router-dom";
import Summary from "./Summary";
import JobPostings from "./JobPostings";
import Applications from "./Applications";
import CompanyProfile from "./CompanyProfile";
import CompanySetup from "./components/CompanySetup";
import CreateCompany from "./components/CreateCompany";
import JoinCompany from "./components/JoinCompany";
import EditCompany from "./components/EditCompany";
import PageNotFound2 from "./components/PageNotFound2";
import PostJob from "./PostJob";
import JobDetails from "./components/JobDetails";
import EditJob from "./components/EditJob";
import Profile from "./Profile";
import Settings from "./Settings";

const Dashboard = () => {
  useEffect(() => {
    document.title = "Employer Dashboard | JobGrids";
  }, []);
  return (
    <div className="d-flex">
      <Sidebar />

      <div className="content main-content flex-grow-1">
        <Routes>
          <Route path="" element={<Summary />} />
          <Route path="dashboard" element={<Summary />} />
          <Route path="post-job" element={<PostJob />} />"
          <Route path="job-postings" element={<JobPostings />} />
          <Route path="job-postings/:id" element={<JobDetails />} />
          <Route path="job-postings/:id/edit" element={<EditJob />} />
          <Route path="applications" element={<Applications />} />
          <Route path="company/setup" element={<CompanySetup />} />
          <Route path="company/create" element={<CreateCompany />} />
          <Route path="company/join" element={<JoinCompany />} />
          <Route path="company/profile" element={<CompanyProfile />} />
          <Route path="company/edit" element={<EditCompany />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<PageNotFound2 />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
