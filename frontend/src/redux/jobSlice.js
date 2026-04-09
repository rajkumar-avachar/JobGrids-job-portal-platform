import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
  name: "job",
  initialState: {
    jobs: [],
    jobDetails: null,
    employerJobs: [],
    savedJobs: [],
    searchedQuery: {
      keyword: "",
      location: "",
    },
    filters: {
      jobTypes: [],
      experience: [],
      salary: "",
    },
    loading: false,
  },
  reducers: {
    setJobs: (state, action) => {
      state.jobs = action.payload;
    },
    setJobDetails: (state, action) => {
      state.jobDetails = action.payload;
    },
    setEmployerJobs: (state, action) => {
      state.employerJobs = action.payload;
    },
    setSavedJobs: (state, action) => {
      state.savedJobs = action.payload;
    },
    setSearchedQuery: (state, action) => {
      state.searchedQuery = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        jobTypes: [],
        experience: [],
        salary: "",
      };
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setJobs,
  setJobDetails,
  setEmployerJobs,
  setSavedJobs,
  setSearchedQuery,
  setFilters,
  resetFilters,
  setLoading,
} = jobSlice.actions;
export default jobSlice.reducer;
