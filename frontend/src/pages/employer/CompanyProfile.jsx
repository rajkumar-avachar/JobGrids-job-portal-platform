import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  Users,
  Calendar,
  Globe,
  SquareArrowOutUpRight,
  SquarePen,
  Pencil,
  Trash,
} from "lucide-react";
import { COMPANY_API } from "../../utils/apis";
import { setLoading } from "../../redux/companySlice";
import { toast } from "react-toastify";
import { setUser } from "../../redux/authSlice";

const CompanyProfile = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const { loading } = useSelector((store) => store.company);
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);

   useEffect(() => {
    document.title = `${company?.name} | JobGrids`;
  }, [company]);

  useEffect(() => {
    if (!user?.company) {
      navigate("/employer/company/setup", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        dispatch(setLoading(true));
        const res = await axios.get(`${COMPANY_API}/your-company`, {
          withCredentials: true,
        });
        if (res.data.success && res.data.company) {
          setCompany(res.data.company);
        }
      } catch (err) {
        console.error(err);
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

  if (!company) return null;

  const {
    _id,
    name,
    logo,
    industry,
    location,
    size,
    foundedYear,
    website,
    about,
    specialties,
  } = company;

  const deleteCompany = async (id) => {
    try {
      const res = await axios.delete(`${COMPANY_API}/${id}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success("Company deleted successfully", {
          position: "bottom-right",
          autoClose: 1000,
        });
        setCompany(null);
        dispatch(setUser({ ...user, company: null }));
        navigate("/employer/company/setup", { replace: true });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete Company.",
        {
          position: "bottom-right",
          autoClose: 2000,
        }
      );
    }
  };

  return (
    <div className="p-4 bg-light h-100">
      <nav className="d-flex justify-content-between align-items-center">
        <h3 className="fw-bold">Company Profile</h3>
        <div className="d-flex gap-2">
          <Link to={"/employer/company/edit"} className="text-decoration-none">
            <button className="btn bg-blue fs-14">
              <SquarePen size={14} className="me-2" />
              Edit Profile
            </button>
          </Link>
          <button
            className="btn btn-outline-danger fs-14"
            onClick={() => deleteCompany(_id)}
          >
            <i class="bi bi-trash-fill"></i> Delete Company
          </button>
        </div>
      </nav>
      <div className="container">
        <div className="row">
          <div className="rounded-3 my-4 border shadow-sm p-0">
            <div
              className="bg-blue rounded-top-3 upper d-flex justify-content-end"
              style={{ width: "100%", height: "10rem" }}
            >
              {/* <button
                className="rounded-circle border m-2"
                style={{ width: "32px", height: "32px" }}
              >
                <Pencil size={16} />
              </button> */}
            </div>
            <div className="px-2 px-md-4 pb-4 pt-2 lower bg-white rounded-3">
              <div className="d-flex gap-3">
                <div className="border p-2 rounded-3 bg-white rounded-4 companyLogo">
                  <img
                    src={logo}
                    alt="CompanyLogo"
                    className="w-100 rounded-4"
                  />
                </div>
                <div>
                  <h4 className="fw-bold mb-1">{name}</h4>
                  <p className="text-muted">{industry}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container fs-14">
        <div className="row gap-4">
          <div className="col border p-3 rounded-3 h-100 bg-white shadow-sm">
            <h5 className="fw-semibold mb-4">Company Information</h5>
            <div className="row g-3">
              {/* Headquarters */}
              <div className="col-6">
                <p className="fw-medium mb-2">Headquarters</p>
                <div className="d-flex align-items-center">
                  <MapPin className="me-1" size={14} />
                  <span className="text-muted">{location}</span>
                </div>
              </div>

              {/* Company Size */}
              <div className="col-6">
                <p className="fw-medium mb-2">Company Size</p>
                <div className="d-flex align-items-center">
                  <Users className="me-1" size={14} />
                  <span className="text-muted">{size} employees</span>
                </div>
              </div>

              {/* Founded */}
              <div className="col-6">
                <p className="fw-medium mb-2">Founded</p>
                <div className="d-flex align-items-center">
                  <Calendar className="me-1" size={14} />
                  <span className="text-muted">{foundedYear}</span>
                </div>
              </div>

              {/* Website */}
              <div className="col-6">
                <p className="fw-medium mb-2">Website</p>
                <div className="d-flex align-items-center">
                  <Globe className="me-1" size={14} />
                  <a
                    href={`https://${website}`}
                    className="text-decoration-none"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>{website}</span> <SquareArrowOutUpRight size={12} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="col border p-3 rounded-3 h-100 bg-white shadow-sm">
            <h5 className="fw-semibold mb-4">About Us</h5>
            <p className="text-muted">{about}</p>
            <h5 className="fw-semibold my-4">Specialties</h5>
            <p className="text-muted">{specialties}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
