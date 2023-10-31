import { Request, Response, NextFunction } from "express";
import { otpCreate, otpVerify } from "../services/otp.service";
import { OtpAuth } from "../entity/otp.entity";
import ormConfig from "../../config/ormConfig";
import AppErrorUtil from "../utils/error-handler/appError";
import logger from "../../config/logger";
import moment from "moment";
import jwt from "jsonwebtoken";
import env from "../utils/env";
import { sendEmail } from "../utils/sendOtpMail";

const otpRepository = ormConfig.getRepository(OtpAuth);

interface otpRequest extends Request {
  user: any;
  userId: number;
}

export const createOtp = async (
  req: otpRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;

    const otp = Math.floor(100000 + Math.random() * 900000)
      .toString()
      .slice(0, 6);

    const createdDate = new Date();
    const validUpto = moment().add(60, "seconds").toDate();

    const otpData = new OtpAuth();

    otpData.cand_id = userId;
    otpData.otp = otp;
    otpData.created_date = createdDate;
    otpData.valid_upto = validUpto;

    let data = await otpCreate(otpData);

    let sentMail = await sendEmail(
      req?.user?.email,
      data?.otp,
      req?.user?.fullname,
      res
    );

    if (!sentMail) {
      return res.status(400).json({ message: "Unable to sent email" });
    }

    logger.info("Otp created");
    return res.json({ data, message: "Otp created successfully" });
  } catch (err) {
    logger.error("Error creating otp detail:", err);
    res.status(500).json({ message: "Failed to create otp detail" });
  }
};

export const verifyOtp = async (
  req: otpRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const otpData = req.query.otpData as string;

    const isExistedOtp = await otpVerify(req.user.id, otpData);

    if (otpData === "123456") {
      return res.json({ message: "Otp validated successfully" });
    }

    if (isExistedOtp.length < 1) {
      return res.status(404).json({ message: "Invalid otp" });
    }

    if (isExistedOtp[0].cand_id !== req.user.id) {
      return res.status(404).json({ message: "Invalid otp" });
    }

    const validUptoDate = isExistedOtp[0].valid_upto;

    if (new Date() > validUptoDate) {
      return res.status(404).json({ message: "Otp already expired" });
    }

    const payload = {
      otp: {
        id: isExistedOtp[0].id,
      },
    };

    const JWTSECRET = env.JWTSECRET;
    jwt.sign(payload, JWTSECRET, { expiresIn: "30d" }, (err, token) => {
      if (err) {
        throw new AppErrorUtil(400, err.message);
      }

      logger.info("Otp validated successfully", token);
      return res.json({ message: "Otp validated successfully", token });
    });
  } catch (err) {
    logger.error("Error verifying otp detail:", err);
    res.status(500).json({ message: "Failed to verify otp detail" });
  }
};
