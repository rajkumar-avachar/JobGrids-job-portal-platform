import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    logo: {
      type: String,
      required: true,
    },
    industry: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    foundedYear: {
      type: Number,
      min: 1800,
      max: new Date().getFullYear(),
      required: true,
    },
    website: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      maxlength: 2000,
      required: true,
    },
    specialties: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // recruiters: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User",
    //   },
    // ],
    jobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
      },
    ],
    socialLinks: {
      linkedin: { type: String, default: "" },
      facebook: { type: String, default: "" },
      x: { type: String, default: "" },
      instagram: { type: String, default: "" }
    },
  },
  {
    timestamps: true,
  },
);

export const Company = mongoose.model("Company", companySchema);
