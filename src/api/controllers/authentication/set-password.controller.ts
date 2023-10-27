import { Request, Response, NextFunction } from "express"
import bcrypt from "bcryptjs"
import { userUpdatePass } from "../../services/authentication/set-password.service"
import { User } from "../../entity/user.entity"
import ormConfig from "../../../config/ormConfig"
import AppErrorUtil from "../../utils/error-handler/appError"
import logger from "../../../config/logger"
import moment from "moment"
import jwt from "jsonwebtoken"
import env from "../../utils/env"

const userRepository = ormConfig.getRepository(User)

interface userRequest extends Request {
  user: any
}

export const updatePassword = async (req: userRequest, res: Response) => {
  try {
    const { password, confirmPassword } = req.body

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Password doesnot match" })
    }

    const user = await userRepository.findOneBy({ id: req.user.id })

    if (!user) {
      return res.status(400).json({ message: "User not found" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const updatedData = await userUpdatePass(hashedPassword, req.user)

    await userRepository.save(updatedData)

    res.json({ updatedData, message: "Password set successfully" })
  } catch (err) {
    logger.error(err)
    res.status(500).send(err)
  }
}
