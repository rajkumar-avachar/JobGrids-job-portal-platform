import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import CompanyHeader from "./CompanyHeader";
import CompanyInfo from "./CompanyInfo";
import { useSelector } from "react-redux";
import useCompanyDetails from "../../../hooks/useCompanyDetails";

const CompanyDetailsPage = () => {
  const { id } = useParams();
  useCompanyDetails(id);

  const { companyDetails, loading } = useSelector((store) => store.company);

  useEffect(() => {
    document.title = `${companyDetails?.name} | JobGrids`;
  }, [companyDetails]);

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
    <div className="bg-light py-4">
      <div className="container">
        <Link to="/companies" className="text-decoration-none fw-medium fs-14">
          <i class="bi bi-arrow-left"></i> Back to Companies
        </Link>
        <CompanyHeader company={companyDetails} />
        <CompanyInfo company={companyDetails} />
      </div>
    </div>
  );
};

export default CompanyDetailsPage;
