import nodemailer from "nodemailer";

export const sendVerificationCode = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"JobGrids" <${process.env.SMTP_MAIL}>`,
      to: email,
      subject: "JobGrids | Email Verification OTP",
      html: `<div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:40px 0;">
            <div style="max-width:500px; margin:auto; background:white; border-radius:10px; padding:30px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
      
            <h2 style="color:#1a73e8; margin-bottom:10px;">JobGrids</h2>

            <p style="font-size:16px; color:#333;">
            Hello,
            </p>

            <p style="font-size:15px; color:#555;">
            Thank you for registering with <strong>JobGrids</strong>.  
            Please use the verification code below to complete your registration.
            </p>

            <div style="text-align:center; margin:30px 0;">
            <span style="font-size:32px; letter-spacing:6px; font-weight:bold; color:#111; background:#f1f3f5; padding:12px 25px; border-radius:8px;">
            ${otp}
            </span>
            </div>

            <p style="font-size:14px; color:#666;">
            This OTP will expire in <strong>10 minutes</strong>. Please do not share this code with anyone.
            </p>

            <hr style="border:none; border-top:1px solid #eee; margin:25px 0;" />

            <p style="font-size:13px; color:#999;">
            If you did not request this email, you can safely ignore it.
            </p>

            <p style="font-size:13px; color:#999;">
            © ${new Date().getFullYear()} JobGrids. All rights reserved.
            </p>

            </div>
            </div>
            `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
