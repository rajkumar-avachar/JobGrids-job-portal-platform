import React, { use, useEffect } from "react";
import SearchCompany from "./SearchCompany";
import CompanyResults from "./CompanyResults";
import useCompanies from "../../../hooks/useCompanies";
import { useSelector } from "react-redux";

const CompaniesPage = () => {
  useCompanies();
  const { loading } = useSelector((store) => store.company);

  useEffect(() => {
    document.title = "Companies | JobGrids";
  }, []);

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
    <div className="bg-light py-5">
      <div className="container">
        <SearchCompany />
        <CompanyResults />
      </div>
    </div>
  );
};

export default CompaniesPage;
