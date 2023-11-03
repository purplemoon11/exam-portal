import datasource from "../../../config/ormConfig";
import { User } from "../../entity/user.entity";
import bcrypt from "bcrypt";
import AppErrorUtil from "../../utils/error-handler/appError";
import { sendMailService } from "../../utils/sendOtpMail";
import { MoreThan, getRepository } from "typeorm";
import { OtpAuth } from "../../entity/otp.entity";
import logger from "../../../config/logger";
import { OTP } from "../../utils/interface/user.interface";

const userRepository = datasource.getRepository(User);

export const forgetPassword = async (data: any, origin: any) => {
  const { passportNum } = data;

  const user = await userRepository.findOneBy({ passportNum: passportNum });

  if (!user) {
    throw new AppErrorUtil(404, "User with this passport number not found");
  }

  return { userId: user.id, email: user.email, phNumber: user.phNumber };
};

export const resetPassword = async (data: any) => {
  const { userId, otpData, newPassword, confirmPassword } = data;

  const validOtp = await isValidOtp(userId, otpData);

  if (!validOtp) {
    throw new AppErrorUtil(400, "Invalid OTP");
  }

  const passwordPattern =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*?])[\w!@#$%^&*?]{8,20}$/;

  if (!passwordPattern.test(newPassword)) {
    throw new AppErrorUtil(
      400,
      "The password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one special character"
    );
  }

  if (newPassword !== confirmPassword) {
    throw new AppErrorUtil(400, "Passwords do not match");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const user = await userRepository.findOneBy({ id: userId });

  if (!user) {
    throw new AppErrorUtil(404, "User not found");
  }

  user.password = hashedPassword;

  const updatedUser = await userRepository.save(user);

  return updatedUser;
};

export const verifyOtp = async (data: OTP) => {
  const { userId, otpData } = data;

  try {
    const storedOtp = await getStoredOtpFromDatabase(userId);
    console.log(otpData, storedOtp, "$$$$$$$$$$$$");

    if (!otpData || !storedOtp || otpData.trim() !== storedOtp.trim()) {
      throw new AppErrorUtil(400, "Invalid OTP");
    }
    const validOtp = await isValidOtp(userId, storedOtp);

    if (!validOtp) {
      throw new AppErrorUtil(400, "OTP has expired");
    }
    await deleteOtpFromDatabase(userId, storedOtp);
    return { message: "OTP validated successfully" };
  } catch (error) {
    logger.error("Error verifying OTP:", error);
    throw new AppErrorUtil(500, "Failed to verify OTP");
  }
};

async function isValidOtp(
  userId: number,
  receivedOtp: string
): Promise<boolean> {
  const otpRepository = datasource.getRepository(OtpAuth);

  try {
    const otpData = await otpRepository.findOne({
      where: {
        cand_id: userId,
        otp: receivedOtp,
        valid_upto: MoreThan(new Date()),
      },
    });
    return !!otpData;
  } catch (error) {
    throw new Error("Error validating OTP: " + error.message);
  }
}

async function getStoredOtpFromDatabase(
  userId: number
): Promise<string | null> {
  const otpRepository = datasource.getRepository(OtpAuth);

  try {
    const otpData = await otpRepository.findOne({
      where: {
        cand_id: userId,
        valid_upto: MoreThan(new Date()),
      },
      order: {
        created_date: "DESC",
      },
    });

    if (otpData) {
      return otpData.otp;
    }

    return null;
  } catch (error) {
    throw new Error("Error fetching OTP from the database: " + error.message);
  }
}

async function deleteOtpFromDatabase(
  userId: number,
  otp: string
): Promise<void> {
  const otpRepository = datasource.getRepository(OtpAuth);

  try {
    // Find and delete the OTP record from the database
    const otpData = await otpRepository.findOne({
      where: {
        cand_id: userId,
        otp: otp,
        valid_upto: MoreThan(new Date()),
      },
    });

    if (otpData) {
      await otpRepository.remove(otpData);
    }
  } catch (error) {
    throw new Error("Error deleting OTP from the database: " + error.message);
  }
}
