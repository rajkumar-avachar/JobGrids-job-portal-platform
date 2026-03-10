// import nodemailer from "nodemailer";

// export const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.EMAIL,
//     pass: process.env.EMAIL_PASS,
//   },
// });



// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export const sendVerificationCode = async (email, otp) => {
//   try {
//     await resend.emails.send({
//       from: `JobGrids <${process.env.EMAIL}>`,
//       to: email,
//       subject: "JobGrids | Email Verification OTP",
//       html: `your html here...`,
//     });
//   } catch (error) {
//     console.error("Error sending email:", error);
//   }
// };
