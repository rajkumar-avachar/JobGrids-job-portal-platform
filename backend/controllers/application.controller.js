import { Application } from "../model/application.model.js";
import { Job } from "../model/job.model.js";
import mongoose from "mongoose";
import { Company } from "../model/company.model.js";

//Apply for a Job
export const applyJob = async (req, res) => {
  try {
    const applicantId = req.user.userId;
    const { jobId, resume } = req.body;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        message: "Invalid Job id",
        success: false,
      });
    }

    if (!jobId.trim()) {
      return res.status(400).json({
        message: "Job id is required",
        success: false,
      });
    }
    if (!resume?.trim()) {
      return res.status(400).json({
        message: "Resume is required",
        success: false,
      });
    }

    const job = await Job.findById(jobId).populate("company");
    if (!job) {
      return res.status(404).json({
        message: "Job not Found",
        success: false,
      });
    }

    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: applicantId,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
        success: false,
      });
    }

    const application = await Application.create({
      applicant: applicantId,
      job: jobId,
      jobTitle: job.title,
      resume: resume,
      company: job.company._id,
      companyName: job.company.name,
    });

    job.applications.push(application._id);
    await job.save();

    return res.status(201).json({
      message: "Job Application submitted successfully",
      application,
      success: true,
    });
  } catch (error) {
    console.error("Error applying for job:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// Get all applications by an applicant
export const getApplicationsByApplicant = async (req, res) => {
  try {
    const applicantId = req.user.userId;
    const applications = await Application.find({ applicant: applicantId })
      .populate({
        path: "company",
        select: "name",
      })
      .sort({ appliedAt: -1 });

    if (applications.length === 0) {
      return res.status(200).json({
        applications: [],
        message: "You have not applied for any job",
        success: true,
      });
    }

    return res.status(200).json({ applications, success: true });
  } catch (error) {
    console.error("Error fetching applications for applicant:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// Get all applications for Employer
export const getApplicationsForEmployer = async (req, res) => {
  try {
    const employerId = req.user.userId;
    const company = await Company.findOne({ employer: employerId });

    if (!company) {
      return res.status(200).json({
        applications: [],
        message: "You have not associated with any company",
        success: true,
      });
    }

    const applications = await Application.find({ company: company._id })
      .populate("applicant")
      .populate("job");

    return res.status(200).json({
      applications,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching applications for employer:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

//Get applications for single job (Employer only)
export const getApplicationsForSingleJobByEmployer = async (req, res) => {
  try {
    const employerId = req.user.userId;
    const jobId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        message: "Invalid job id",
        success: false,
      });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }
    if (!job.postedBy || job.postedBy.toString() !== employerId) {
      return res.status(403).json({
        message: "You are not authorized to view applications for this job",
        success: false,
      });
    }

    const applications = await Application.find({ job: jobId })
      .populate("applicant", "fullname email")
      .sort({ createdAt: -1 });

    if (applications.length === 0) {
      return res.status(200).json({
        applications: [],
        message: "No applications found for this job",
        success: true,
      });
    }

    return res.status(200).json({
      applications,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching applications for a specific job:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

//Update application status
export const updateApplicationStatus = async (req, res) => {
  try {
    const applicationId = req.params.id;
    let { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return res.status(400).json({
        message: "Invalid application id",
        success: false,
      });
    }

    status = status?.trim().toLowerCase();

    if (!status) {
      return res.status(400).json({
        message: "Please provide status value",
        success: false,
      });
    }

    if (!["shortlisted", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status value. Status must be shortlisted or rejected",
        success: false,
      });
    }

    const application =
      await Application.findById(applicationId).populate("job");
    if (!application) {
      return res.status(404).json({
        message: "Application not found",
        success: false,
      });
    }

    if (!application.job) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot update status. The job for this application has been deleted.",
      });
    }

    if (application.job.postedBy.toString() !== req.user.userId) {
      return res.status(403).json({
        message:
          "You are not authorized to update the status of this application",
        success: false,
      });
    }

    application.status = status;
    await application.save();

    return res.status(200).json({
      message: "Application status updated successfully",
      application,
      success: true,
    });
  } catch (error) {
    console.error("Error updating application status:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// Cancel application
export const cancelApplication = async (req, res) => {
  try {
    const applicationId = req.params.id;
    const applicantId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return res.status(400).json({
        message: "Invalid application id",
        success: false,
      });
    }

    const application = await Application.findOne({
      _id: applicationId,
      applicant: applicantId,
    });

    if (!application) {
      return res.status(404).json({
        message: "Application Not Found",
        success: false,
      });
    }

    if (["shortlisted", "rejected"].includes(application.status)) {
      return res.status(400).json({
        message:
          "You cannot cancel an application that has been shortlisted or rejected",
        success: false,
      });
    }

    await Job.findByIdAndUpdate(application.job, {
      $pull: { applications: application._id },
    });

    await Application.findByIdAndDelete(applicationId);

    return res.status(200).json({
      message: "Application cancelled successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error cancelling application:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
