import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { USER_API } from "../../utils/apis";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setLoading, setUser } from "../../redux/authSlice";
import "./style.css";
import { Mail, Lock, ArrowRight, LogIn } from "lucide-react";
import GoogleLoginComp from "./GoogleLoginComp";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    document.title = "Log in | JobGrids";
  }, []);

  const handleInputChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();
  const { loading } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API}/login`, input, {
        withCredentials: true,
      });
      if (res.data.success) {
        const user = res.data.user;
        dispatch(setUser(user));
        if (user.role === "jobseeker") {
          navigate("/", { replace: true });
        } else {
          navigate("/employer/dashboard", { replace: true });
        }
        toast.success("Login successful!", {
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
      toast.error(error.response?.data?.message || "Login failed.", {
        position: "bottom-right",
        autoClose: 2000,
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="py-5">
      <div className="container pt-5">
        <div className="row mx-2">
          <LogIn className="text-primary" size={48} />
          <div className="text-center">
            <h3 className="fw-bold mb-0 mt-3">Log in to your account</h3>
            <p>
              Or{" "}
              <Link to="/signup" className="text-decoration-none fs-14">
                create a new account
              </Link>
            </p>
          </div>
          <div className="col-md-8 border border-2 col-xl-4 mx-auto p-4 p-lg-5 rounded-3 fs-14 bg-white shadow-sm mt-3">
            <form onSubmit={handleFormSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label mb-1 fs-14">
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
              <div className="mb-1">
                <label htmlFor="password" className="form-label mb-1 fs-14">
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
              <div className="text-end">
                <Link
                  to="/forgot-password"
                  className="text-decoration-none fs-12 fw-medium"
                >
                  Fogot Password?
                </Link>
              </div>
              {loading ? (
                <button
                  className="btn bg-blue w-100 mx-auto mt-4 mb-4 fs-14"
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
                <button className="btn bg-blue w-100 mx-auto mt-4 mb-4 fs-14">
                  Log in <ArrowRight size={16} />
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

export default Login;
