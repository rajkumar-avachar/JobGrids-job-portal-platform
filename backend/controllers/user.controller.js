import { User } from "../model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { generateAndSendOtp } from "../utils/otpService.js";

//Register User
export const register = async (req, res) => {
  try {
    const { fullname, email, password, role } = req.body;

    const cleaned = {
      fullname: fullname?.trim().replace(/\s+/g, " "),
      email: email?.trim().toLowerCase(),
      password: password?.trim(),
      role: role?.trim().replace(/\s+/g, "").toLowerCase(),
    };

    for (let key in cleaned) {
      if (!cleaned[key]) {
        return res.status(400).json({
          message: "Please fill all the details",
          success: false,
        });
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleaned.email)) {
      return res.status(400).json({
        message: "Invalid email format",
        success: false,
      });
    }

    const existingUser = await User.findOne({ email: cleaned.email });

    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({
          message: "Email already registered",
          success: false,
        });
      }

      await generateAndSendOtp(existingUser);

      return res.status(200).json({
        message: "OTP resent. Please verify your email.",
        success: true,
      });
    }

    if (!["jobseeker", "employer"].includes(cleaned.role)) {
      return res.status(400).json({
        message: "Role must be either 'jobseeker' or 'employer'",
        success: false,
      });
    }

    if (cleaned.password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(cleaned.password, 10);

    const user = await User.create({
      ...cleaned,
      password: hashedPassword,
    });

    await generateAndSendOtp(user);

    const userData = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      role: user.role,
    };

    return res.status(201).json({
      message: "Account created successfully",
      user: userData,
      success: true,
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

//Verify Email
export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: "Email is already verified",
        success: false,
      });
    }
    if (user.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
        success: false,
      });
    }

    if (user.otpExpires < new Date()) {
      return res.status(400).json({
        message: "OTP has expired",
        success: false,
      });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    return res.status(200).json({
      message: "Email verified successfully",
      success: true,
    });
  } catch (error) {
    console.error("Email Verification Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

//Resend otp
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: "Email already verified",
        success: false,
      });
    }

    await generateAndSendOtp(user);

    return res.status(200).json({
      message: "OTP resent successfully",
      success: true,
    });
  } catch (error) {
    console.error("Resend OTP Error:", error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

//Login User
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const cleaned = {
      email: email?.trim().toLowerCase(),
      password: password?.trim(),
    };
    for (let key in cleaned) {
      if (!cleaned[key]) {
        return res.status(400).json({
          message: "Please fill all the details",
          success: false,
        });
      }
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleaned.email)) {
      return res.status(400).json({
        message: "Invalid email format",
        success: false,
      });
    }
    let user = await User.findOne({ email: cleaned.email }).populate("company");
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email",
        success: false,
      });
    }

    if (user.googleId && !user.password) {
      return res.status(400).json({
        message:
          "This account was created using Google. Please continue with Google or reset your password.",
        success: false,
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(
      cleaned.password,
      user.password,
    );
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect password",
        success: false,
      });
    }

    const tokenData = {
      userId: user._id,
      role: user.role,
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "15d",
    });

    const userData = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber || "",
      role: user.role,
      profile: user.profile || "",
      company: user.company || null,
    };

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 15 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        user: userData,
        success: true,
      });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

//Login with Google
export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    const { sub, name, email, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        googleId: sub,
        fullname: name,
        email,
        role: "jobseeker",
        profile: {
          profilePhoto: picture,
        },
        isVerified: true,
      });
    } else if (!user.googleId) {
      user.googleId = sub;
      await user.save();
    }
    const tokenData = {
      userId: user._id,
      role: user.role,
    };

    const jwttoken = jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "15d",
    });

    return res
      .status(200)
      .cookie("token", jwttoken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 15 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        user,
        success: true,
      });
  } catch (error) {
    console.error("Outh Google Login Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

//Email OTP for Forgot Password
export const sendOtpForForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
        success: false,
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
        success: false,
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    await generateAndSendOtp(user);
    return res.status(200).json({
      message: "OTP sent to email successfully",
      success: true,
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

//Verify Email for Forgot Password
export const verifyEmailForResetPassword = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
        success: false,
      });
    }

    if (user.otpExpires < new Date()) {
      return res.status(400).json({
        message: "OTP has expired",
        success: false,
      });
    }

    user.otp = null;
    user.otpExpires = null;
    await user.save();

    return res.status(200).json({
      message: "OTP verified successfully",
      success: true,
    });
  } catch (error) {
    console.error("Verify Email for Forgot Password Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

//Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({
        message: "Email and new password are required",
        success: false,
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
        success: false,
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
        success: false,
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      message: "Password reset successfully",
      success: true,
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

//Logout User
export const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0,
      })
      .json({
        message: "Logged out successfully",
        success: true,
      });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

//Update Profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const {
      fullname,
      headline,
      location,
      // gender,
      phoneNumber,
      email,
      portfolio,
      github,
      linkedin,
      about,
      skills,
    } = req.body;

    const profilePhotoUrl =
      req.files?.profilePhoto?.[0]?.path ||
      (req.body.profilePhoto === "null" ? null : undefined);

    const resumeFile = req.files?.resume?.[0];
    const resumeUrl =
      resumeFile?.path || (req.body.resume === "null" ? null : undefined);
    const resumeName = resumeFile?.originalname || null;

    const cleaned = {
      fullname: fullname?.trim().replace(/\s+/g, " "),
      headline: headline?.trim().replace(/\s+/g, " "),
      location: location?.trim().replace(/\s+/g, " "),
      // gender: gender?.trim().toLowerCase(),
      phoneNumber: phoneNumber,
      email: email?.trim(),
      portfolio: portfolio?.trim().replace(/\s+/g, ""),
      github: github?.trim().replace(/\s+/g, ""),
      linkedin: linkedin?.trim().replace(/\s+/g, ""),
      about: about?.trim().replace(/\s+/g, " "),
      skills: skills?.trim().replace(/\s+/g, " "),
    };

    // if (!Object.keys(req.body).length && !profilePhotoUrl && !resumeUrl) {
    //   return res.status(400).json({
    //     message: "At least one field is required to update the profile",
    //     success: false,
    //   });
    // }

    //validate full name
    if (cleaned.fullname !== undefined && !cleaned.fullname) {
      return res
        .status(400)
        .json({ message: "Full Name is required", success: false });
    }

    //validate email
    if (cleaned.email !== undefined) {
      if (!cleaned.email) {
        return res
          .status(400)
          .json({ message: "Email is required", success: false });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleaned.email)) {
        return res
          .status(400)
          .json({ message: "Invalid email format", success: false });
      }

      const isEmailExist = await User.findOne({
        email: cleaned.email,
        _id: { $ne: userId },
      });

      if (isEmailExist) {
        return res
          .status(400)
          .json({ message: "Email already exists", success: false });
      }
    }

    //validate phone number
    if (cleaned.phoneNumber) {
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(cleaned.phoneNumber)) {
        return res
          .status(400)
          .json({ message: "Invalid phone number", success: false });
      }

      const existingPhone = await User.findOne({
        phoneNumber: cleaned.phoneNumber,
        _id: { $ne: userId },
      });

      if (existingPhone) {
        return res
          .status(400)
          .json({ message: "Phone number already exists", success: false });
      }
    }

    const updatedFields = {
      fullname: cleaned.fullname,
      email: cleaned.email,
    };

    if (profilePhotoUrl !== undefined)
      updatedFields["profile.profilePhoto"] = profilePhotoUrl;

    if (resumeUrl !== undefined) {
      updatedFields["profile.resume"] = resumeUrl;
      updatedFields["profile.resumeName"] = resumeName;
    }
    if (cleaned.headline !== undefined)
      updatedFields["profile.headline"] = cleaned.headline;

    if (cleaned.location !== undefined)
      updatedFields["profile.location"] = cleaned.location;

    // if (cleaned.gender !== undefined) {
    //   const validGenders = ["male", "female", "other", ""];
    //   if (!validGenders.includes(cleaned.gender)) {
    //     return res.status(400).json({
    //       message: "Invalid gender value",
    //       success: false,
    //     });
    //   }

    //   updatedFields["profile.gender"] = cleaned.gender;
    // }

    if (cleaned.phoneNumber !== undefined)
      updatedFields.phoneNumber = cleaned.phoneNumber;

    if (cleaned.portfolio !== undefined)
      updatedFields["profile.portfolio"] = cleaned.portfolio;

    if (cleaned.github !== undefined)
      updatedFields["profile.github"] = cleaned.github;

    if (cleaned.linkedin !== undefined)
      updatedFields["profile.linkedin"] = cleaned.linkedin;

    if (cleaned.about !== undefined)
      updatedFields["profile.about"] = cleaned.about;

    if (cleaned.skills !== undefined) {
      updatedFields["profile.skills"] = cleaned.skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updatedFields },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
      success: true,
    });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.phoneNumber) {
      return res.status(400).json({
        message: "Phone number already exists",
        success: false,
      });
    }
    console.error("Update Profile Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
