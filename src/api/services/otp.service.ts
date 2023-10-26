import { OtpAuth } from "../entity/otp.entity"
import ormConfig from "../../config/ormConfig"

const otpRepository = ormConfig.getRepository(OtpAuth)

export const otpCreate = async (otpData: object) => {
  const otp = await otpRepository.save(otpData)

  return otp
}

export const otpVerify = async (userId: number, otpId: string) => {
  const otp = await otpRepository.find({
    where: { otp: otpId, cand_id: userId },
  })

  return otp
}
