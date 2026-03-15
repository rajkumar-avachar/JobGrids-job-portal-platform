import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { JOBS_API } from "../utils/apis";
import { setSavedJobs } from "../redux/jobSlice";

const useSavedJobs = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);

    useEffect(() => {
        const fetchSavedJobs = async () => {
            if (!user || user.role !== 'jobseeker') return;
            try {
                const res = await axios.get(`${JOBS_API}/saved`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setSavedJobs(res.data.savedJobs));
                }
            } catch (error) {
                console.error("Error fetching saved jobs:", error);
            }
        };
        fetchSavedJobs();
    }, [user, dispatch]);
};

export default useSavedJobs;
