import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Popover from "./Popover";
import "./Navbar.css";
import { AiFillHome } from "react-icons/ai";
import { BsBuildingsFill } from "react-icons/bs";
import { IoLogOut } from "react-icons/io5";
import LanguageIcon from "@mui/icons-material/Language";
import { USER_API } from "../utils/apis";
import { logout } from "../redux/authSlice";
import axios from "axios";
import { toast } from "react-toastify";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const closeMobileDrawer = () => setMobileDrawerOpen(false);

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
    <>
      <nav className="navbar navbar-expand-lg bg-light border-bottom sticky-top">
        <div className="container">
          <Link
            className="navbar-brand fw-bold me-5 d-flex"
            to="/"
            onClick={closeMobileDrawer}
          >
            <img src="/logo/jobgridslogo1.png" alt="Logo" />
          </Link>

          <button
            className="navbar-toggler d-lg-none fs-6 px-2"
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className="collapse navbar-collapse d-none d-lg-flex"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 fw-medium gap-lg-3 text-center ms-lg-5 fs-14">
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    `nav-link navHover ${isActive ? "active-link" : ""}`
                  }
                  to="/"
                  onClick={closeMobileDrawer}
                >
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    `nav-link navHover ${isActive ? "active-link" : ""}`
                  }
                  to="/jobs"
                  onClick={closeMobileDrawer}
                >
                  Find Jobs
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    `nav-link navHover ${isActive ? "active-link" : ""}`
                  }
                  to="/companies"
                  onClick={closeMobileDrawer}
                >
                  Companies
                </NavLink>
              </li>
            </ul>

            <div className="d-flex align-items-center ms-auto">
              {user ? (
                <Popover />
              ) : (
                <div className="d-flex gap-3">
                  <Link to="/login">
                    <button className="btn btn-outline-primary fw-medium">
                      Login
                    </button>
                  </Link>
                  <Link to="/signup">
                    <button className="btn bg-blue fw-medium">Signup</button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`mobile-drawer ${mobileDrawerOpen ? "show bg-light" : ""}`}
      >
        {user ? (
          <Link
            className="text-decoration-none"
            to="/profile"
            onClick={closeMobileDrawer}
          >
            <div className="account p-4 border-bottom">
              {user?.profile?.profilePhoto ? (
                <img
                  src={user?.profile?.profilePhoto}
                  alt="Avatar"
                  className="rounded-circle"
                  width={100}
                  height={100}
                  style={{ cursor: "pointer" }}
                />
              ) : (
                <AccountCircleIcon
                  style={{ fontSize: "100px", color: "lightgray" }}
                  className="rounded-circle"
                />
              )}

              <p className="fw-bold fs-4 text-black mt-3 mb-1">
                {user?.fullname}
              </p>
              <p className="fs-14 mb-2 text-black">{user?.profile?.headline}</p>
              <p className="text-muted fs-14 mb-0">
                {user?.profile?.location}
              </p>
            </div>
          </Link>
        ) : (
          <div className="border p-4 text-center">
            <Link
              className="navbar-brand fw-bold fs-3"
              to="/"
              onClick={closeMobileDrawer}
            >
              <img src="/logo/jobgridslogo1.png" alt="Logo" />
            </Link>
          </div>
        )}

        <div className="drawer-body p-4">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active-link" : ""}`
                }
                to="/"
                onClick={() => {
                  closeMobileDrawer();
                  changeActiveHandler();
                }}
              >
                <AiFillHome className="fs-5 mb-1 me-2" />
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active-link" : ""}`
                }
                to="/dashboard"
                onClick={() => {
                  closeMobileDrawer();
                  changeActiveHandler();
                }}
              >
                <i className="bi bi-grid-fill me-2"></i> Dashboard
              </NavLink>
            </li>
            {user?.role === "jobseeker" && (
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active-link" : ""}`
                  }
                  to="/saved-jobs"
                  onClick={() => {
                    closeMobileDrawer();
                  }}
                >
                  <i className="bi bi-bookmark-fill me-2"></i> Saved Jobs
                </NavLink>
              </li>
            )}
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active-link" : ""}`
                }
                to="/jobs"
                onClick={() => {
                  closeMobileDrawer();
                  changeActiveHandler();
                }}
              >
                <i className="bi bi-briefcase-fill me-2"></i> Find Jobs
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active-link" : ""}`
                }
                to="/companies"
                onClick={() => {
                  closeMobileDrawer();
                  changeActiveHandler();
                }}
              >
                <BsBuildingsFill className="me-2" /> Companies
              </NavLink>
            </li>
          </ul>

          <hr />

          {user ? (
            <div className="mt-3 d-none d-lg-block">
              <Popover />
            </div>
          ) : (
            <div className="d-flex flex-column gap-2 mt-3">
              <Link to="/login" onClick={closeMobileDrawer}>
                <button className="btn text-light bg-blue w-100 fw-medium">
                  Login
                </button>
              </Link>
              <Link to="/signup" onClick={closeMobileDrawer}>
                <button className="btn text-light bg-blue w-100 fw-medium">
                  Signup
                </button>
              </Link>
            </div>
          )}

          {user && (
            <button
              className="btn dropdown-item d-flex align-items-center gap-2"
              onClick={logoutHandler}
            >
              <IoLogOut className="fs-2" />
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Overlay */}
      {mobileDrawerOpen && (
        <div className="drawer-overlay" onClick={closeMobileDrawer}></div>
      )}
    </>
  );
};

export default Navbar;
