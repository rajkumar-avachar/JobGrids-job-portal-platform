import React, { useEffect, useState } from "react";
import axios from "axios";
import { USER_API } from "../../../utils/apis";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setLoading } from "../../../redux/authSlice";
import "../style.css";
import { UserLock, Mail } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  useEffect(() => {
    document.title = "Forgot Password| JobGrids";
  }, []);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const navigate = useNavigate();
  const { loading } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const res = await axios.post(
        `${USER_API}/forgot-password`,
        { email },
        {
          withCredentials: true,
        },
      );
      if (res.data.success) {
        toast.success("OTP sent to your email", {
          position: "bottom-right",
          autoClose: 2000,
        });
        navigate("/otp-verification-for-reset-password", {
          state: { email },
          replace: true,
        });
      } else {
        toast.error(res.data.message || "Something went wrong.", {
          position: "bottom-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP.", {
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
          <UserLock className="text-primary" size={48} />
          <div className="text-center">
            <h3 className="fw-bold mb-0 mt-3">Forgot Your Password?</h3>
            <p className="fs-14 mt-2 text-muted">
              Enter your email to reset your password.
            </p>
          </div>
          <div className="col-md-8 border border-2 col-xl-4 mx-auto p-4 p-lg-5 rounded-3 fs-14 bg-white shadow-sm mt-4">
            <form onSubmit={handleForgotPassword}>
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
                    value={email}
                    required
                    placeholder="you@example.com"
                    onChange={handleEmailChange}
                  />
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
                  Next
                </button>
              )}
              <p className="fs-12 text-center">
                <span>
                  Back to
                  <Link to="/login" className="ms-1 text-decoration-none fw-medium">
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

export default ForgotPassword;
