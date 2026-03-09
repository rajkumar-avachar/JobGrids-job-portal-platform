import { sendVerificationCode } from "./sendEmail.js";

export const generateAndSendOtp = async (user) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.otp = otp;
  user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  await user.save();

  await sendVerificationCode(user.email, otp);
};
