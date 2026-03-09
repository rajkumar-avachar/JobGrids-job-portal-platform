import express from "express";
import {
  register,
  verifyEmail,
  resendOtp,
  login,
  googleLogin,
  logout,
  updateProfile,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { profileResumeUpload } from "../utils/upload.js";
import { User } from "../model/user.model.js";

const router = express.Router();

router.route("/register").post(register);

router.route("/verify-email").post(verifyEmail);

router.route("/resend-otp").post(resendOtp);

router.route("/login").post(login);

router.route("/google-login").post(googleLogin);

router.route("/logout").get(logout);

router
  .route("/updateProfile")
  .put(isAuthenticated, profileResumeUpload, updateProfile);

router.get("/me", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

export default router;
