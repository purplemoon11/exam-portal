import datasource from "../../../config/ormConfig";
import { User } from "../../entity/user.entity";
import bcrypt from "bcrypt";
import AppErrorUtil from "../../utils/error-handler/appError";
import { sendMailService } from "../../utils/sendOtpMail";
import { MoreThan, getRepository } from "typeorm";
import { OtpAuth } from "../../entity/otp.entity";

const userRepository = datasource.getRepository(User);
const otpRepository = datasource.getRepository(OtpAuth);

export const forgetPassword = async (data: any, origin: any) => {
  const { passportNum } = data;

  const user = await userRepository.findOneBy({ passportNum: passportNum });

  if (!user) {
    throw new AppErrorUtil(404, "User with this passport number not found");
  }

  return { userId: user.id, email: user.email, phNumber: user.phNumber };
};

export const sendOtp = async (data: any, origin: any) => {
  const { userId, selectedOption } = data;

  const user = await userRepository.findOneBy({ id: userId });

  if (!user) {
    throw new AppErrorUtil(404, "User not found");
  }

  let otp: string;
  if (selectedOption === "phone") {
    otp = "123456"; // Default OTP for phone option
  } else {
    otp = generateRandomOTP(); // Generate random OTP for email option
  }

  const expirationTime = new Date();
  expirationTime.setMinutes(expirationTime.getMinutes() + 10);

  const otpEntity = new OtpAuth();
  otpEntity.otp = otp;
  otpEntity.created_date = new Date();
  otpEntity.valid_upto = expirationTime;
  otpEntity.candAuth = user;

  await otpRepository.save(otpEntity);

  if (selectedOption === "email") {
    await sendMailService({
      email: user.email,
      otp: otp,
      subject: "Your OTP to reset password",
      origin,
    });
  }

  return { message: "OTP sent successfully", otp: otp };
};

export const resetPasswordWithOTP = async (data: any) => {
  const { userId, newPassword, confirmPassword, otpData } = data;

  if (!otpData) {
    throw new AppErrorUtil(400, "Invalid OTP");
  }

  const otpDataFromDB = await otpRepository.findOne({
    where: {
      candAuth: { id: userId },
      otp: otpData.trim(),
      valid_upto: MoreThan(new Date()),
    },
  });

  if (!otpDataFromDB) {
    throw new AppErrorUtil(400, "Invalid OTP");
  }

  if (newPassword !== confirmPassword) {
    throw new AppErrorUtil(400, "Passwords do not match");
  }

  const user = await userRepository.findOneBy({ id: userId });

  if (!user) {
    throw new AppErrorUtil(404, "User not found");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;

  await userRepository.save(user);

  await otpRepository.remove(otpDataFromDB);

  return { message: "Password reset successfully" };
};

function generateRandomOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const verifyOTP = async (data: any): Promise<boolean> => {
  try {
    const { userId, otp } = data;
    const otpDataFromDB = await otpRepository.findOne({
      where: {
        candAuth: { id: userId },
        otp: otp,
        valid_upto: MoreThan(new Date()),
      },
    });

    if (otpDataFromDB) {
      return true;
    } else {
      throw new AppErrorUtil(400, "Invalid OTP");
    }
  } catch (error) {
    throw new AppErrorUtil(500, "Failed to verify OTP");
  }
};
