import { createSlice } from "@reduxjs/toolkit";

const companySlice = createSlice({
  name: "company",
  initialState: {
    companies: [],
    companyDetails: null,
    searchedQuery: {
      keyword: "",
      location: "",
    },
    loading: false,
  },
  reducers: {
    setCompanies: (state, action) => {
      state.companies = action.payload;
    },
    setCompanyDetails: (state, action) => {
      state.companyDetails = action.payload;
    },
    setSearchedQuery: (state, action) => {
      state.searchedQuery = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setCompanies, setCompanyDetails, setSearchedQuery, setLoading } =
  companySlice.actions;
export default companySlice.reducer;
