import React, { useState } from "react";
import CompanyOverview from "./CompanyOverview";
import CompanyJobs from "./CompanyJobs";
import UpcomingEvents from "./UpcomingEvents";
import SocialMediaLinks from "./SocialMediaLinks";

const CompanyInfo = ({ company }) => {
  if (!company) return null;
  const [content, setContent] = useState("overview");

  return (
    <div className="row mx-auto d-flex  gap-md-5">
      <div className=" rounded-3 p-2 px-md-4 mb-5 col-lg-8 bg-white h-100 border shadow-sm">
        <div className="d-flex gap-5 border-bottom">
          <button
            className={`fs-14 border-0 bg-white py-2 px-0 fw-medium ${content === "overview" ? "text-blue border-bottom  border-primary" : "text-black"}`}
            onClick={() => setContent("overview")}
          >
            Overview
          </button>
          <button
            className={`fs-14 border-0 bg-white py-2 px-0 fw-medium ${content === "jobs" ? "text-blue border-bottom  border-primary" : "text-black"}`}
            onClick={() => setContent("jobs")}
          >
            Jobs ({company.jobs?.length})
          </button>
        </div>
        {content === "overview" ? (
          <CompanyOverview company={company} />
        ) : (
          <CompanyJobs company={company} />
        )}
      </div>
      <div className="col">
        {/* <UpcomingEvents /> */}
        <SocialMediaLinks />
      </div>
    </div>
  );
};

export default CompanyInfo;
