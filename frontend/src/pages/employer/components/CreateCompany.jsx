import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setLoading, setUser } from "../../../redux/authSlice";
import { COMPANY_API } from "../../../utils/apis";

const CreateCompany = () => {
  const [input, setInput] = useState({
    name: "",
    logo: null,
    about: "",
    specialties: "",
    industry: "",
    location: "",
    size: "",
    foundedYear: "",
    website: "",
  });

  useEffect(() => {
    document.title = "Create Company | JobGrids";
  }, []);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const { loading } = useSelector((store) => store.auth);
  useEffect(() => {
    if (user?.role !== "employer") {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setInput({ ...input, [name]: files[0] });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to create a company profile.", {
        position: "bottom-right",
        autoClose: 2000,
      });
      return;
    }
    try {
      dispatch(setLoading(true));
      const formData = new FormData();
      for (const key in input) {
        formData.append(key, input[key]);
      }
      const res = await axios.post(`${COMPANY_API}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setUser({ ...user, company: res.data.company }));
        console.log("Company created successfully:", res.data.company);
        toast.success("Company profile created successfully!", {
          position: "bottom-right",
          autoClose: 2000,
        });
        navigate("/employer/company/profile");
      } else {
        toast.error(res.data.message || "Something went wrong.", {
          position: "bottom-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create company profile.",
        {
          position: "bottom-right",
          autoClose: 2000,
        }
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="p-5 bg-light h-100">
      <h3 className="fw-bold text-center">Create Your company Profile</h3>
      <div className="border bg-white col-10 mx-auto p-4 my-4 rounded-3 shadow-sm">
        <form className="row" onSubmit={handleFormSubmit}>
          <div className="mb-4 col-6">
            <label htmlFor="companyName" className="form-label fs-14">
              Company Name *
            </label>
            <input
              type="text"
              className="form-control bg-light"
              placeholder="e.g., ABC Technologies"
              id="companyName"
              name="name"
              onChange={handleInputChange}
              value={input.name}
              required
            />
          </div>
          <div className="mb-4 col-6">
            <label htmlFor="logo" className="form-label fs-14">
              Company Logo *
            </label>
            <input
              type="file"
              className="form-control bg-light"
              id="logo"
              name="logo"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="about" className="form-label fs-14">
              About Company *
            </label>
            <textarea
              className="form-control bg-light"
              placeholder="Describe what your company does..."
              id="about"
              name="about"
              rows={3}
              onChange={handleInputChange}
              value={input.about}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="specialties" className="form-label fs-14">
              Specialties *
            </label>
            <input
              type="text"
              className="form-control bg-light"
              placeholder="Describe your services or products..."
              id="specialties"
              name="specialties"
              onChange={handleInputChange}
              value={input.specialties}
              required
            />
          </div>
          <div className="mb-4 col-6">
            <label htmlFor="industry" className="form-label fs-14">
              Industry *
            </label>
            <input
              type="text"
              className="form-control bg-light"
              placeholder="e.g., Software Development"
              id="industry"
              name="industry"
              onChange={handleInputChange}
              value={input.industry}
              required
            />
          </div>
          <div className="mb-4 col-6">
            <label htmlFor="location" className="form-label fs-14">
              Location *
            </label>
            <input
              type="text"
              className="form-control bg-light"
              placeholder="e.g., Pune, India"
              id="location"
              name="location"
              onChange={handleInputChange}
              value={input.location}
              required
            />
          </div>
          <div className="mb-4 col-6">
            <label htmlFor="size" className="form-label fs-14">
              Company Size *
            </label>
            <input
              type="text"
              className="form-control bg-light"
              placeholder="e.g., 51-200, 10k+"
              id="size"
              name="size"
              onChange={handleInputChange}
              value={input.size}
              required
            />
          </div>
          <div className="mb-4 col-6">
            <label htmlFor="foundedYear" className="form-label fs-14">
              Founded Year *
            </label>
            <input
              type="text"
              className="form-control bg-light"
              placeholder="e.g., 1995"
              id="foundedYear"
              name="foundedYear"
              onChange={handleInputChange}
              value={input.foundedYear}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="website" className="form-label fs-14">
              Company Website *
            </label>
            <input
              type="text"
              className="form-control bg-light"
              placeholder="https://www.example.com"
              id="website"
              name="website"
              onChange={handleInputChange}
              value={input.website}
              required
            />
          </div>
          <div className="w-100 d-flex justify-content-end gap-3">
            <button
              type="button"
              className="btn btn-outline-dark"
              onClick={() => navigate("/employer/company/setup")}
            >
              Back
            </button>
            <button type="submit" className="btn bg-blue" disabled={loading}>
              {loading && (
                <span className="spinner-border spinner-border-sm me-2"></span>
              )}
              {loading ? "Creating..." : "Create Company"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCompany;
