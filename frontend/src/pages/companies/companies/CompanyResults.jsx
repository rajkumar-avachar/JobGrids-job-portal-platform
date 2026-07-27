import React from "react";
import CompanyCard from "./CompanyCard";
import { useSelector, useDispatch } from "react-redux";
import EmptyState from "../../../components/EmptyState";
import { Building } from "lucide-react";
import { setSearchedQuery } from "../../../redux/companySlice";

const CompanyResults = () => {
  const dispatch = useDispatch();
  const { companies } = useSelector((store) => store.company);

  const handleReset = () => {
    dispatch(setSearchedQuery({ keyword: "", location: "" }));
  };

  return (
    <div className="my-5">
      {companies?.length > 0 ? (
        <>
          <p className="text-muted">
            Found <b>{companies?.length}</b> companies
          </p>
          <div className="row row-cols-lg-3">
            {companies.map((company) => (
              <div className="p-3" key={company._id}>
                <CompanyCard company={company} />
              </div>
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          icon={Building}
          title="No companies found"
          description="We couldn't find any registered companies matching your search. Try resetting your keywords or location parameters."
          actionText="Reset Search"
          onAction={handleReset}
        />
      )}
    </div>
  );
};

export default CompanyResults;
