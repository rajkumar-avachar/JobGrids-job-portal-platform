import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: "Please login to continue",
        success: false,
      });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "Invalid or expired token",
      success: false,
    });
  }
};

export const isEmployer = (req, res, next) => {
  if (!req.user || req.user.role !== "employer") {
    return res.status(403).json({
      message: "Unauthorized Access",
      success: false,
    });
  }
  next();
};

export const isJobseeker = (req, res, next) => {
  if (!req.user || req.user.role !== "jobseeker") {
    return res.status(403).json({
      message: "Unauthorized Access",
      success: false,
    });
  }
  next();
};
