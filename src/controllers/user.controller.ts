import { Request, Response, NextFunction } from "express"
import { userRegister } from "../services/user.service"
import { User } from "../entity/user.entity"
import env from "../api/utils/env"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import ormConfig from "../config/ormConfig"
import AppError from "../api/utils/appError"
import logger from "../config/logger"

const userRepository = ormConfig.getRepository(User)
const JWTSECRET = env.JWTSECRET

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { fullName, phNumber, email, passportNum } = req.body

    const isUserExists = await userRepository.findOne({
      where: { passportNum },
    })

    if (isUserExists) {
      throw new AppError(400, "User already exists")
    }

    let user = new User()

    user.fullname = fullName
    user.phNumber = phNumber
    user.email = email
    user.passportNum = passportNum

    let data = await userRegister(user)

    const payload = {
      user: {
        id: data.id,
      },
    }

    jwt.sign(
      payload,
      JWTSECRET as string,
      { expiresIn: "30d" },
      (err, token) => {
        if (err) {
          throw new AppError(400, err.message)
        }
        logger.info("User created successfully")
        res.status(201).json({ data, token })
      }
    )
  } catch (err) {
    logger.error(err)
    throw new AppError(500, "Internal server error")
  }
}
