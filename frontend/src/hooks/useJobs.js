import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { JOBS_API } from "../utils/apis";
import { setJobs, setLoading } from "../redux/jobSlice";

const useJobs = () => {
  const dispatch = useDispatch();
  const { searchedQuery, filters } = useSelector((store) => store.job);

  useEffect(() => {
    const fetchJobs = async () => {
      dispatch(setLoading(true));
      try {
        const queryParams = new URLSearchParams({
          keyword: searchedQuery.keyword,
          location: searchedQuery.location,
          jobTypes: filters?.jobTypes?.join(",") || "",
          experience: filters?.experience?.join(",") || "",
          salary: filters?.salary || "",
        }).toString();

        const res = await axios.get(`${JOBS_API}/?${queryParams}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setJobs(res.data.jobs));
        }
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchJobs();
  }, [dispatch, searchedQuery, filters]);
};

export default useJobs;
