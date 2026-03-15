import React, { useEffect, useState } from "react";
import axios from "axios";
import { USER_API } from "../../../utils/apis";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setLoading } from "../../../redux/authSlice";
import "../style.css";
import { MailCheck } from "lucide-react";
import { useLocation } from "react-router-dom";

const OtpVerificationForResetPassword = () => {
  const [otp, setOtp] = useState("");

  useEffect(() => {
    document.title = "OTP Verification For Reset Password| JobGrids";
  }, []);

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const location = useLocation();
  const email = location.state?.email;

  const navigate = useNavigate();
  const { loading } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const res = await axios.post(
        `${USER_API}/verify-otp-for-reset-password`,
        { email, otp },
        {
          withCredentials: true,
        },
      );
      if (res.data.success) {
        toast.success("Email verified successfully", {
          position: "bottom-right",
          autoClose: 2000,
        });
        navigate("/reset-password", { state: { email }, replace: true });
      } else {
        toast.error(res.data.message || "Something went wrong.", {
          position: "bottom-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Email verification failed.",
        {
          position: "bottom-right",
          autoClose: 2000,
        },
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleResendOtp = async () => {
    try {
      const res = await axios.post(
        `${USER_API}/resend-otp`,
        { email, type: "reset-password" },
        {
          withCredentials: true,
        },
      );
      if (res.data.success) {
        toast.success("OTP resent successfully", {
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
      toast.error(error.response?.data?.message || "Failed to resend OTP.", {
        position: "bottom-right",
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="py-5">
      <div className="container pt-5">
        <div className="row mx-2">
          <MailCheck className="text-primary" size={48} />
          <div className="text-center">
            <h3 className="fw-bold mb-0 mt-3">Check Your Email</h3>
            <p className="fs-14 mt-2 text-muted">
              Please enter the OTP sent to your registered email.
            </p>
          </div>
          <div className="col-md-8 border border-2 col-xl-4 mx-auto p-4 p-lg-5 rounded-3 fs-14 bg-white shadow-sm mt-4">
            <form onSubmit={handleOtpVerification}>
              <div className="mb-3">
                <label
                  htmlFor="otp"
                  className="form-label mb-3 fs-14 text-center w-100"
                >
                  Enter OTP
                </label>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={6}
                  pattern="[0-9]*"
                  className="form-control py-2 text-center border-2 fs-4"
                  style={{ letterSpacing: "8px" }}
                  id="otp"
                  name="otp"
                  required
                  onChange={handleOtpChange}
                />
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
                  Verify
                </button>
              )}
              <p className="fs-12 text-center d-flex align-items-center justify-content-center gap-1">
                <span>Didn't get the code?</span>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="btn fs-12 p-0 m-0 text-blue fw-medium"
                >
                  Resend
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerificationForResetPassword;
