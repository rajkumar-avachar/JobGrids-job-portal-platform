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

  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: "", color: "bg-secondary" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    let label = "Weak";
    let color = "bg-danger";
    if (score >= 5) {
      label = "Very Strong";
      color = "bg-success";
    } else if (score >= 4) {
      label = "Strong";
      color = "bg-info";
    } else if (score >= 3) {
      label = "Medium";
      color = "bg-warning";
    }

    return { score, label, color };
  };

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
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      toast.error("Password must be at least 8 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character.", {
        position: "bottom-right",
        autoClose: 3000,
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
                    minLength={8}
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

                {newPassword && (
                  <div className="mt-2 p-2 bg-light rounded border border-light">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fs-11 text-muted fw-medium">Password strength:</span>
                      <span className={`badge ${getPasswordStrength(newPassword).color} fs-10`}>
                        {getPasswordStrength(newPassword).label}
                      </span>
                    </div>
                    <div className="progress mb-2" style={{ height: "4px" }}>
                      <div
                        className={`progress-bar ${getPasswordStrength(newPassword).color}`}
                        role="progressbar"
                        style={{
                          width: `${(getPasswordStrength(newPassword).score / 5) * 100}%`,
                          transition: "width 0.3s ease",
                        }}
                      ></div>
                    </div>
                    <div className="row g-1 mt-1" style={{ fontSize: "10px" }}>
                      <div className="col-6 d-flex align-items-center gap-1">
                        <span className={newPassword.length >= 8 ? "text-success fw-bold" : "text-muted"}>
                          {newPassword.length >= 8 ? "✓" : "○"} Min 8 chars
                        </span>
                      </div>
                      <div className="col-6 d-flex align-items-center gap-1">
                        <span className={/[A-Z]/.test(newPassword) ? "text-success fw-bold" : "text-muted"}>
                          {/[A-Z]/.test(newPassword) ? "✓" : "○"} 1 Uppercase
                        </span>
                      </div>
                      <div className="col-6 d-flex align-items-center gap-1">
                        <span className={/[a-z]/.test(newPassword) ? "text-success fw-bold" : "text-muted"}>
                          {/[a-z]/.test(newPassword) ? "✓" : "○"} 1 Lowercase
                        </span>
                      </div>
                      <div className="col-6 d-flex align-items-center gap-1">
                        <span className={/\d/.test(newPassword) ? "text-success fw-bold" : "text-muted"}>
                          {/\d/.test(newPassword) ? "✓" : "○"} 1 Number
                        </span>
                      </div>
                      <div className="col-12 d-flex align-items-center gap-1">
                        <span className={/[^A-Za-z0-9]/.test(newPassword) ? "text-success fw-bold" : "text-muted"}>
                          {/[^A-Za-z0-9]/.test(newPassword) ? "✓" : "○"} 1 Special character
                        </span>
                      </div>
                    </div>
                  </div>
                )}
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
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="••••••••"
                    minLength={8}
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
