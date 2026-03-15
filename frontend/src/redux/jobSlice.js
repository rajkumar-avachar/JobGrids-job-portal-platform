import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
  name: "job",
  initialState: {
    jobs: [],
    jobDetails: null,
    employerJobs: [],
    savedJobs: [],
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
  setLoading,
} = jobSlice.actions;
export default jobSlice.reducer;
