import React, { useEffect } from "react";
import SearchCompany from "./SearchCompany";
import CompanyResults from "./CompanyResults";
import useCompanies from "../../../hooks/useCompanies";
import { useSelector, useDispatch } from "react-redux";
import { setSearchedQuery } from "../../../redux/companySlice";

const CompaniesPage = () => {
  const dispatch = useDispatch();
  useCompanies();

  useEffect(() => {
    document.title = "Companies | JobGrids";
    // Reset search on mount
    dispatch(setSearchedQuery({ keyword: "", location: "" }));
  }, [dispatch]);

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
