import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { USER_API } from "../../utils/apis";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setLoading } from "../../redux/authSlice";
import { UserPlus, Mail, Lock, User, Building, ArrowRight } from "lucide-react";
import "./style.css";
import GoogleLoginComp from "./GoogleLoginComp";
import { Eye, EyeOff } from "lucide-react";

const Signup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "jobseeker",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [role, setRole] = useState("jobseeker");

  useEffect(() => {
    document.title = "Sign up | JobGrids";
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const navigate = useNavigate();
  const { loading } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (input.password !== input.confirmPassword) {
      toast.error("Passwords do not match", {
        position: "bottom-right",
        autoClose: 2000,
      });
      return;
    }

    try {
      dispatch(setLoading(true));
      const res = await axios.post(
        `${USER_API}/register`,
        { ...input, role },
        {
          withCredentials: true,
        },
      );
      if (res.data.success) {
        navigate("/otp-verification", {
          state: { email: input.email },
          replace: true,
        });
        toast.success("Check your email for OTP", {
          position: "bottom-right",
          autoClose: 2000,
        });
      } else {
        toast.error(res.data.message || "Something went wrong.", {
          position: "bottom-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed.", {
        position: "bottom-right",
        autoClose: 2000,
      });
      console.error(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="bg-light py-3 py-sm-5" style={{ minHeight: "100vh" }}>
      <div className="container">
        <div className="row mx-2">
          <UserPlus className="text-primary" size={48} />
          <div className="text-center">
            <h3 className="fw-bold mb-0 mt-3">Create your account</h3>
            <p>
              Or{" "}
              <Link to="/login" className="text-decoration-none fs-14">
                log in to your existing account
              </Link>
            </p>
          </div>
          <div className="col-md-8 border border-2 col-xl-4 mx-auto p-4 p-lg-5 rounded-3 fs-14 bg-white shadow-sm mt-3">
            <form onSubmit={handleFormSubmit}>
              <div className="d-flex justify-content-center mb-4 gap-3">
                <button
                  type="button"
                  className={`btn flex-grow-1 fs-14 py-2 ${role === "jobseeker" ? "bg-blue text-light" : "btn-light "}`}
                  onClick={() => setRole("jobseeker")}
                >
                  Job Seeker
                </button>
                <button
                  type="button"
                  className={`btn flex-grow-1 fs-14 py-2 ${role === "employer" ? "bg-blue text-light" : "btn-light "}`}
                  onClick={() => setRole("employer")}
                >
                  Employer
                </button>
              </div>

              <div className="mb-3">
                <label htmlFor="fullname" className="form-label mb-1 fs-9">
                  Full Name
                </label>
                <div className="position-relative">
                  <User
                    size={20}
                    className="position-absolute top-50 start-0 ms-3 translate-middle-y icon "
                    style={{ pointerEvents: "none" }}
                  />
                  <input
                    type="text"
                    className="form-control ps-5 py-2"
                    id="fullname"
                    name="fullname"
                    placeholder="Full Name"
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label mb-1 fs-9">
                  Email address
                </label>
                <div className="position-relative">
                  <Mail
                    size={20}
                    className="position-absolute top-50 start-0 ms-3 translate-middle-y icon "
                    style={{ pointerEvents: "none" }}
                  />
                  <input
                    type="email"
                    className="form-control ps-5 py-2"
                    id="email"
                    name="email"
                    placeholder="you@example.com"
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label mb-1 fs-9">
                  Password
                </label>
                <div className="position-relative">
                  <Lock
                    size={20}
                    className="position-absolute top-50 start-0 ms-3 translate-middle-y icon"
                    style={{ pointerEvents: "none" }}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control ps-5 py-2"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    minLength={6}
                    required
                    onChange={handleInputChange}
                  />
                  <span
                    className="position-absolute top-50 end-0 me-3 translate-middle-y"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <label
                  htmlFor="confirmPassword"
                  className="form-label mb-1 fs-9"
                >
                  Confirm Password
                </label>
                <div className="position-relative">
                  <Lock
                    size={20}
                    className="position-absolute top-50 start-0 ms-3 translate-middle-y icon"
                    style={{ pointerEvents: "none" }}
                  />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="form-control ps-5 py-2"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="••••••••"
                     minLength={6}
                    required
                    onChange={handleInputChange}
                  />
                  <span
                    className="position-absolute top-50 end-0 me-3 translate-middle-y"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <Eye size={18} />
                    ) : (
                      <EyeOff size={18} />
                    )}
                  </span>
                </div>
              </div>

              {loading ? (
                <button
                  className="btn bg-blue w-100 mt-3 mb-4 fs-14 py-2"
                  disabled
                >
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Please wait...
                </button>
              ) : (
                <button className="btn bg-blue w-100 mt-3 mb-4 fs-14 py-2">
                  Create Account <ArrowRight size={16} />
                </button>
              )}

              <GoogleLoginComp />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
