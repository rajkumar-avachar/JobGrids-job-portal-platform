import React from "react";
import { styled, alpha } from "@mui/material/styles";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import {
  LogOut,
  CircleUserRound,
  Settings,
  TableRowsSplit,
  Briefcase
} from "lucide-react";
import { USER_API } from "../../../utils/apis";
import { toast } from "react-toastify";
import axios from "axios";
import { logout } from "../../../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "top",
      horizontal: "left",
    }}
    transformOrigin={{
      vertical: "bottom",
      horizontal: "left",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: "rgb(55, 65, 81)",
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
        ...theme.applyStyles("dark", {
          color: "inherit",
        }),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
    ...theme.applyStyles("dark", {
      color: theme.palette.grey[300],
    }),
  },
}));

const UserActions = () => {

  const {user} = useSelector((state) => state.auth);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    handleClose();
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
      toast.error(error.response?.data?.message || "Failed to Logout.", {
        position: "bottom-right",
        autoClose: 2000,
      });
    }
  };

  return (
    <div>
      <button
        id="demo-customized-button"
        aria-controls={open ? "demo-customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : "false"}
        onClick={handleClick}
        className="w-100 border-0 rounded-3 employer-account bg-white"
      >
        <div className="d-flex align-items-center p-2">
          {user?.profile?.profilePhoto ? (
            <img 
              src={user.profile.profilePhoto} 
              alt="avatar" 
              width={36} 
              height={36} 
              className="rounded-circle object-fit-cover me-2" 
            />
          ) : (
            <i className="bi bi-person-circle text-primary fs-2 me-2"></i>
          )}
          <div className="text-start overflow-hidden">
            <p className="mb-0 fs-14 fw-medium text-truncate">{user?.fullname || "Employer"}</p>
            <p className="text-muted fs-12 mb-0 text-truncate d-flex align-items-center gap-1">
              <Briefcase size={12} className="text-primary" />
              {user?.profile?.headline || (user?.role === 'employer' ? 'Hiring Manager' : user?.role)}
            </p>
          </div>
        </div>
      </button>

      <StyledMenu
        id="demo-customized-menu"
        slotProps={{
          list: {
            "aria-labelledby": "demo-customized-button",
          },
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          className: "custom-menu",
        }}
      >
        <MenuItem
          disableRipple
          className=" fs-14 text-black rounded-3"
          disabled
        >
          <CircleUserRound size={16} className="me-2" />
          {user?.email}
        </MenuItem>
        <MenuItem 
          disableRipple 
          className="fs-14 rounded-3"
          onClick={() => {
            handleClose();
            navigate("/employer/profile");
          }}
        >
          <CircleUserRound size={16} className="me-2" />
          Profile
        </MenuItem>
        <MenuItem 
          disableRipple 
          className="fs-14 rounded-3"
          onClick={() => {
            handleClose();
            navigate("/employer/settings");
          }}
        >
          <Settings size={16} className=" me-2" />
          Settings
        </MenuItem>
        <MenuItem
          disableRipple
          className="fs-14 rounded-3"
          onClick={logoutHandler}
        >
          <LogOut size={16} className=" me-2" />
          Log out
        </MenuItem>
      </StyledMenu>
    </div>
  );
};

export default UserActions;
