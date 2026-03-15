import React, { useEffect, useState } from "react";
import axios from "axios";
import { USER_API } from "../../../utils/apis";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setLoading } from "../../../redux/authSlice";
import "../style.css";
import { UserLock, Lock } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";
import { useLocation } from "react-router-dom";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    document.title = "Reset Your Password| JobGrids";
  }, []);

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const navigate = useNavigate();
  const { loading } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match", {
        position: "bottom-right",
        autoClose: 2000,
      });
      return;
    }
    try {
      dispatch(setLoading(true));
      const res = await axios.post(
        `${USER_API}/reset-password`,
        { email, newPassword },
        {
          withCredentials: true,
        },
      );
      if (res.data.success) {
        toast.success("Password Reset Successfully", {
          position: "bottom-right",
          autoClose: 2000,
        });
        navigate("/login", { replace: true });
      } else {
        toast.error(res.data.message || "Something went wrong.", {
          position: "bottom-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to Reset Password.",
        {
          position: "bottom-right",
          autoClose: 2000,
        },
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="py-5">
      <div className="container pt-5">
        <div className="row mx-2">
          <UserLock className="text-primary" size={48} />
          <div className="text-center">
            <h3 className="fw-bold mb-0 mt-3">Reset Your Password</h3>
          </div>
          <div className="col-md-8 border border-2 col-xl-4 mx-auto p-4 p-lg-5 rounded-3 fs-14 bg-white shadow-sm mt-4">
            <form onSubmit={handleResetPassword}>
              <div className="mb-3">
                <label htmlFor="password" className="form-label mb-1 fs-14">
                  New Password
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
                    onChange={handleNewPasswordChange}
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
                <label htmlFor="password" className="form-label mb-1 fs-14">
                  Confirm New Password
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
                    onChange={handleConfirmPasswordChange}
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
              {loading ? (
                <button
                  className="btn bg-blue w-100 mx-auto mt-2 mb-4 fs-14"
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
                <button className="btn bg-blue w-100 mx-auto mt-2 mb-4 fs-14">
                  Reset Password
                </button>
              )}
              <p className="fs-12 text-center">
                <span>
                  Back to
                  <Link
                    to="/login"
                    className="ms-1 text-decoration-none fw-medium"
                  >
                    Login
                  </Link>
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
