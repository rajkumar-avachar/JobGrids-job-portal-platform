import express from "express";
import {
  register,
  verifyEmail,
  resendOtp,
  login,
  googleLogin,
  logout,
  updateProfile,
  sendOtpForForgotPassword,
  verifyOtpForResetPassword,
  resetPassword,
  changeEmployerPassword,
  deleteEmployerAccount,
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

router.route("/forgot-password").post(sendOtpForForgotPassword);

router
  .route("/verify-otp-for-reset-password")
  .post(verifyOtpForResetPassword);

router.route("/reset-password").post(resetPassword);

router.route("/logout").get(logout);

router
  .route("/updateProfile")
  .put(isAuthenticated, profileResumeUpload, updateProfile);

router.route("/change-employer-password").put(isAuthenticated, changeEmployerPassword);

router.route("/delete-employer-account").delete(isAuthenticated, deleteEmployerAccount);

router.get("/me", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select("-password")
      .populate("company");

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
