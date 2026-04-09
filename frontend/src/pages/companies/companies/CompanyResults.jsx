import React from "react";
import CompanyCard from "./CompanyCard";
import { useSelector } from "react-redux";

const CompanyResults = () => {
  const { companies, loading } = useSelector((store) => store.company);

  if (loading) {
    return (
      <div className="my-5 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "300px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-muted">Searching for companies...</p>
      </div>
    );
  }

  return (
    <div className="my-5">
      <p className="text-muted">
        Found <b>{companies?.length}</b> companies
      </p>
      <div className="row row-cols-lg-3">
        {companies?.map((company) => (
          <div className="p-3" key={company._id}>
            <CompanyCard company={company} />
          </div>
        ))}
        {companies?.length === 0 && (
          <div className="col-12 text-center py-5">
            <h5 className="text-muted">No companies found matching your criteria.</h5>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyResults;
