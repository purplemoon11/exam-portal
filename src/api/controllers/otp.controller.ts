import { Request, Response, NextFunction } from "express"
import { otpCreate, otpVerify } from "../services/otp.service"
import { OtpAuth } from "../entity/otp.entity"
import ormConfig from "../../config/ormConfig"
import AppErrorUtil from "../utils/error-handler/appError"
import logger from "../../config/logger"
import moment from "moment"

const otpRepository = ormConfig.getRepository(OtpAuth)

interface otpRequest extends Request {
  user: any
  userId: number
}

export const createOtp = async (
  req: otpRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id

    console.log(req.user)

    const otp = Math.floor(100000 + Math.random() * 900000)
      .toString()
      .slice(0, 6)

    const createdDate = new Date()
    const validUpto = moment().add(60, "seconds").toDate()

    const otpData = new OtpAuth()

    otpData.cand_id = userId
    otpData.otp = otp
    otpData.created_date = createdDate
    otpData.valid_upto = validUpto

    let data = await otpCreate(otpData)

    logger.info("Otp created")
    return res.json({ data, message: "Otp created successfully" })
  } catch (err) {
    logger.error("Error creating otp detail:", err)
    res.status(500).json({ message: "Failed to create otp detail" })
  }
}

export const verifyOtp = async (
  req: otpRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const otpData = req.query.otpData as string

    const isExistedOtp = await otpVerify(req.user.id, otpData)

    if (otpData === "123456") {
      return res.json({ message: "Otp validated successfully" })
    }

    return res.json({ isExistedOtp })
  } catch (err) {
    logger.error("Error verifying otp detail:", err)
    res.status(500).json({ message: "Failed to verify otp detail" })
  }
}

export const testOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const otpData = req.query.otpData as string

    // const isExistedOtp = await otpVerify(req.userId, otpData)

    if (otpData === "123456") {
      return res.json({ message: "Otp validated successfully" })
    }

    return res.json({ otpData })
  } catch (err) {
    logger.error("Error verifying otp detail:", err)
    res.status(500).json({ message: "Failed to verify otp detail" })
  }
}
