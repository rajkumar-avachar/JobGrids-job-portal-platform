import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { USER_API } from "../../utils/apis";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setUser } from "../../redux/authSlice";
import { useDispatch } from "react-redux";

const GoogleLoginComp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      const res = await axios.post(
        `${USER_API}/google-login`,
        { token },
        { withCredentials: true },
      );
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
    }
  };
  return (
    <div>
      <GoogleLogin
        onSuccess={(credentialResponse) => handleSuccess(credentialResponse)}
        onError={() => {
          console.log("Login Failed");
        }}
        text="continue_with"
      />
    </div>
  );
};

export default GoogleLoginComp;
