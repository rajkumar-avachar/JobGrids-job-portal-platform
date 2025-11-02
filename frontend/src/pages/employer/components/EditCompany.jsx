import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MapPin, Users, Calendar, Globe, Pencil } from "lucide-react";
import { COMPANY_API } from "../../../utils/apis";
import axios from "axios";
import { toast } from "react-toastify";
import { setUser } from "../../../redux/authSlice";
import { setLoading } from "../../../redux/companySlice";

const EditCompany = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [input, setInput] = useState({
    name: "",
    industry: "",
    location: "",
    size: "",
    foundedYear: "",
    website: "",
    about: "",
    specialties: "",
  });

  const { loading } = useSelector((store) => store.company);

   useEffect(() => {
      document.title = "Edit Company | JobGrids";
    }, []);

  useEffect(() => {
    if (!user?.company) {
      navigate("/employer/company/setup", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    document.title = "Edit Company Profile | ITConnect";
  }, []);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        dispatch(setLoading(true));
        const res = await axios.get(`${COMPANY_API}/your-company`, {
          withCredentials: true,
        });
        if (res.data.success && res.data.company) {
          setInput({
            name: res.data.company.name || "",
            industry: res.data.company.industry || "",
            location: res.data.company.location || "",
            size: res.data.company.size || "",
            foundedYear: res.data.company.foundedYear || "",
            website: res.data.company.website || "",
            about: res.data.company.about || "",
            specialties: res.data.company.specialties || "",
          });
        }
      } catch (error) {
        toast.error(error.response?.data?.message, {
          position: "bottom-right",
          autoClose: 2000,
        });
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchCompany();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          height: "80vh",
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to update your company profile.");
      return;
    }
    try {
      dispatch(setLoading(true));
      const res = await axios.put(
        `${COMPANY_API}/${user?.company?._id}`,
        input,
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setUser({ ...user, company: res.data.company }));
        toast.success("Company profile updated successfully", {
          position: "bottom-right",
          autoClose: 2000,
        });
        navigate("/employer/company/profile", { replace: true });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to Update Company Profile.",
        {
          position: "bottom-right",
          autoClose: 2000,
        }
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  if (!user?.company) return null;

  return (
    <div className="p-4 bg-light h-100">
      <form onSubmit={handleSubmit}>
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="fw-bold">Edit Company Profile</h3>
          <button type="submit" className="btn bg-blue" disabled={loading}>
            {loading && (
              <span className="spinner-border spinner-border-sm me-2"></span>
            )}
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Upper section */}
        <div className="container">
          <div className="row">
            <div className="rounded-3 my-4 border shadow-sm p-0">
              <div
                className="bg-blue rounded-top-3 upper d-flex justify-content-end"
                style={{ width: "100%", height: "10rem" }}
              >
                <button
                  type="button"
                  className="rounded-circle border m-2"
                  style={{ width: "32px", height: "32px" }}
                >
                  <Pencil size={16} />
                </button>
              </div>
              <div className="px-2 px-md-4 pb-4 pt-2 lower bg-white rounded-3">
                <div className="d-flex gap-3">
                  <div className="border p-2 rounded-3 bg-white rounded-4 companyLogo">
                    <img
                      src="/logo/company.png"
                      alt="CompanyLogo"
                      className="w-100 rounded-4"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      className="form-control fw-bold"
                      name="name"
                      value={input.name}
                      onChange={handleInputChange}
                    />
                    <input
                      type="text"
                      className="form-control mt-2"
                      name="industry"
                      value={input.industry}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Company info section */}
        <div className="container fs-14">
          <div className="row gap-4">
            <div className="col border p-3 rounded-3 h-100">
              <h5 className="fw-semibold mb-4">Company Information</h5>
              <div className="row g-4">
                <div className="col-6">
                  <p className="fw-medium mb-2">Headquarters</p>
                  <div className="d-flex align-items-center">
                    <MapPin className="me-1" size={14} />
                    <input
                      type="text"
                      className="form-control"
                      name="location"
                      value={input.location}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="col-6">
                  <p className="fw-medium mb-2">Company Size</p>
                  <div className="d-flex align-items-center">
                    <Users className="me-1" size={14} />
                    <input
                      type="text"
                      className="form-control"
                      name="size"
                      value={input.size}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="col-6">
                  <p className="fw-medium mb-2">Founded</p>
                  <div className="d-flex align-items-center">
                    <Calendar className="me-1" size={14} />
                    <input
                      type="text"
                      className="form-control"
                      name="foundedYear"
                      value={input.foundedYear}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="col-6">
                  <p className="fw-medium mb-2">Website</p>
                  <div className="d-flex align-items-center">
                    <Globe className="me-1" size={14} />
                    <input
                      type="text"
                      className="form-control"
                      name="website"
                      value={input.website}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col border p-3 rounded-3 h-100">
              <h5 className="fw-semibold mb-4">About Us</h5>
              <textarea
                className="form-control"
                rows="4"
                name="about"
                value={input.about}
                onChange={handleInputChange}
              ></textarea>

              <h5 className="fw-semibold my-4">Specialties</h5>
              <input
                type="text"
                className="form-control"
                name="specialties"
                value={input.specialties}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditCompany;
