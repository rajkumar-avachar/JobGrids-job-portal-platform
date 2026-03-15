import axios from "axios";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { USER_API } from "../utils/apis";
import { useSelector, useDispatch } from "react-redux";
import { logout, setUser } from "../redux/authSlice";
import { toast } from "react-toastify";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Popover = () => {
  const closeNavbar = () => {
    const navbar = document.querySelector(".navbar-collapse");
    if (navbar && navbar.classList.contains("show")) {
      new window.bootstrap.Collapse(navbar).toggle();
    }
  };
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(logout());
        localStorage.removeItem("user");
        navigate("/");
        toast.success("Logout successful!", {
          position: "bottom-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error(error.response?.data?.message || "Logout failed.", {
        position: "bottom-right",
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="dropdown">
      {user?.profile?.profilePhoto ? (
        <img
          src={user?.profile?.profilePhoto}
          alt="Avatar"
          className="rounded-circle"
          width={40}
          height={40}
          data-bs-toggle="dropdown"
          style={{ cursor: "pointer" }}
        />
      ) : (
        <AccountCircleIcon
          className="fs-1"
          data-bs-toggle="dropdown"
          style={{ cursor: "pointer", color: "gray" }}
        />
      )}
      <ul className="dropdown-menu dropdown-menu-end mt-2">
        <li>
          <Link
            className="dropdown-item d-flex align-items-center gap-2"
            to="/profile"
            onClick={closeNavbar}
          >
            <i class="bi bi-person"></i>
            Profile
          </Link>
        </li>
        <li>
          <Link
            className="dropdown-item d-flex align-items-center gap-2"
            to="/dashboard"
            onClick={closeNavbar}
          >
            <i className="bi bi-grid"></i>
            Dashboard
          </Link>
        </li>
        {user?.role === "jobseeker" && (
          <li>
            <Link
              className="dropdown-item d-flex align-items-center gap-2"
              to="/saved-jobs"
              onClick={closeNavbar}
            >
              <i className="bi bi-bookmark text-black"></i>
              Saved Jobs
            </Link>
          </li>
        )}
        <li>
          <hr className="dropdown-divider" />
        </li>
        <li>
          <button
            className="btn dropdown-item d-flex align-items-center gap-2"
            onClick={logoutHandler}
          >
            <i className="bi bi-box-arrow-right"></i>Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Popover;
