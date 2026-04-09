import mongoose from "mongoose";
import { Company } from "../model/company.model.js";
import { Job } from "../model/job.model.js";
import { User } from "../model/user.model.js";
import { Application } from "../model/application.model.js";

//Get Dashboard Stats
export const getDashboardStats = async (req, res) => {
  try {
    const employerId = req.user.userId;

    const company = await Company.findOne({ employer: employerId });

    if (!company) {
      return res.status(200).json({
        stats: {
          totalJobs: 0,
          activeJobs: 0,
          totalApplications: 0,
          hiredCandidates: 0,
        },
        recentJobs: [],
        recentApplications: [],
        success: true,
      });
    }

    const companyId = company._id;

    // Aggregate statistics
    const totalJobs = await Job.countDocuments({ company: companyId });
    const activeJobs = await Job.countDocuments({ company: companyId, openings: { $gt: 0 } });
    const totalApplications = await Application.countDocuments({ company: companyId });
    const hiredCandidates = await Application.countDocuments({ company: companyId, status: "shortlisted" }); // Assuming shortlisted means hired or progressed

    // Fetch recent items
    const recentJobs = await Job.find({ company: companyId })
      .sort({ createdAt: -1 })
      .limit(5);

    const recentApplications = await Application.find({ company: companyId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("applicant", "fullname profile");

    return res.status(200).json({
      stats: {
        totalJobs,
        activeJobs,
        totalApplications,
        hiredCandidates,
      },
      recentJobs,
      recentApplications,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

//Create Company
export const createCompany = async (req, res) => {
  try {
    const {
      name,
      industry,
      location,
      size,
      foundedYear,
      website,
      about,
      specialties,
    } = req.body;

    console.log(req.body);

    const employerId = req.user?.userId;

    const cleaned = {
      name: name?.trim().replace(/\s+/g, " "),
      industry: industry?.trim().replace(/\s+/g, " "),
      location: location?.trim().replace(/\s+/g, " "),
      size: size?.trim().replace(/\s+/g, ""),
      foundedYear: foundedYear,
      website: website?.trim() || "",
      about: about?.trim().replace(/\s+/g, " "),
      specialties: specialties?.trim().replace(/\s+/g, " "),
    };

    const companyLogoUrl = req.file?.path;
    console.log(companyLogoUrl);

    if (
      !cleaned.name ||
      !cleaned.industry ||
      !cleaned.location ||
      !cleaned.size ||
      !cleaned.foundedYear ||
      !cleaned.website ||
      !cleaned.about ||
      !cleaned.specialties ||
      !employerId ||
      !companyLogoUrl
    ) {
      return res.status(400).json({
        message: "All fields are required to create a company profile",
        success: false,
      });
    }

    const existingCompany = await Company.findOne({ employer: employerId });
    if (existingCompany) {
      return res.status(400).json({
        message: "You have already created a company profile.",
        success: false,
      });
    }

    const duplicateCompany = await Company.findOne({ name: cleaned.name });
    if (duplicateCompany) {
      return res.status(400).json({
        message: "A company with this name already exists",
        success: false,
      });
    }

    const company = await Company.create({
      ...cleaned,
      employer: employerId,
      logo: companyLogoUrl,
    });

    await User.findByIdAndUpdate(employerId, { company: company._id });

    return res.status(201).json({
      message: "Company created successfully",
      company,
      success: true,
    });
  } catch (error) {
    console.error("Error creating company:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

//Get all companies
export const getAllCompanies = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const location = req.query.location || "";

    const query = {
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { industry: { $regex: keyword, $options: "i" } },
      ],
      location: { $regex: location, $options: "i" },
    };

    const companies = await Company.find(query)
      .populate("jobs")
      .sort({ createdAt: -1 });

    if (companies.length === 0) {
      return res.status(200).json({
        companies: [],
        message: "Companies Not Found",
        success: true,
      });
    }
    return res.status(200).json({
      companies,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching all companies:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

//Get a single company by id
export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({
        message: "Invalid Company ID",
        success: false,
      });
    }

    const company = await Company.findById(companyId).populate("jobs");
    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }
    return res.status(200).json({
      company,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching company by ID:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

//Get company created by employer
export const getCompanyByEmployer = async (req, res) => {
  try {
    const employerId = req.user.userId;
    const company = await Company.findOne({ employer: employerId }).populate(
      "jobs",
    );
    if (!company) {
      return res.status(200).json({
        message: "You have not created any Company yet",
        success: true,
      });
    }

    return res.status(200).json({
      company,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching employer company:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

//Update Company detais
export const updateCompany = async (req, res) => {
  try {
    const companyId = req.params.id;
    const employerId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({
        message: "Invalid Company ID",
        success: false,
      });
    }

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        message: "Company Not Found",
        success: false,
      });
    }

    if (company.employer.toString() !== employerId.toString()) {
      return res.status(403).json({
        message: "You are not authorized to update this company",
        success: false,
      });
    }

    const {
      name,
      industry,
      location,
      size,
      foundedYear,
      website,
      about,
      specialties,
    } = req.body;

    const cleaned = {
      name: name?.trim().replace(/\s+/g, " "),
      industry: industry?.trim().replace(/\s+/g, " "),
      location: location?.trim().replace(/\s+/g, " "),
      size: size?.trim().replace(/\s+/g, ""),
      foundedYear: foundedYear,
      website: website?.trim().replace(/\s+/g, ""),
      about: about?.trim().replace(/\s+/g, " "),
      specialties: specialties?.trim().replace(/\s+/g, " "),
    };

    const existingCompany = await Company.findOne({
      name: cleaned.name,
      _id: { $ne: companyId },
    });
    if (existingCompany) {
      return res.status(400).json({
        message: "Company name already exists",
        success: false,
      });
    }

    if (!Object.keys(req.body).length) {
      return res.status(400).json({
        message: "At least one field is required to update company details",
        success: false,
      });
    }

    // if (
    //   !cleaned.name ||
    //   !cleaned.industry ||
    //   !cleaned.location ||
    //   !cleaned.size ||
    //   !cleaned.foundedYear ||
    //   !cleaned.website ||
    //   !cleaned.about ||
    //   !cleaned.specialties
    // ) {
    //   return res.status(400).json({
    //     message: "All fields are required",
    //     success: false,
    //   });
    // }

    for (const [key, value] of Object.entries(cleaned)) {
      if (value !== undefined && (value === null || value === "")) {
        return res.status(400).json({ message: `${key} is required` });
      }
    }

    // if (cleaned.name !== undefined) {
    //   if (!cleaned.name) {
    //     return res.status(400).json({
    //       message: "Company Name is required",
    //       success: false,
    //     });
    //   }
    //   const existingCompany = await Company.findOne({
    //     name: cleaned.name,
    //     _id: { $ne: companyId },
    //   });
    //   if (existingCompany) {
    //     return res.status(400).json({
    //       message: "Company name already exists",
    //       success: false,
    //     });
    //   }
    // }

    // if (cleaned.industry !== undefined && !cleaned.industry) {
    //   return res.status(400).json({
    //     message: "Industry is required",
    //     success: false,
    //   });
    // }

    // if (cleaned.location !== undefined && !cleaned.location) {
    //   return res.status(400).json({
    //     message: "Location is required",
    //     success: false,
    //   });
    // }

    const updatedCompany = await Company.findByIdAndUpdate(
      companyId,
      { $set: cleaned },
      {
        new: true,
        runValidators: true,
      },
    );

    return res.status(200).json({
      message: "Company updated successfully",
      company: updatedCompany,
      success: true,
    });
  } catch (error) {
    console.error("Error updating company:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

//Delete Company
export const deleteCompany = async (req, res) => {
  try {
    const companyId = req.params.id;
    const employerId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({
        message: "Invalid Company ID",
        success: false,
      });
    }
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }

    if (company.employer.toString() !== employerId.toString()) {
      return res.status(403).json({
        message: "You are not authorized to delete this company",
        success: false,
      });
    }

    await Company.findByIdAndDelete(companyId);

    await Job.deleteMany({ company: companyId });

    await User.findByIdAndUpdate(employerId, { company: null });

    return res.status(200).json({
      message: "Company deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting company:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
