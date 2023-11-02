import logger from "../../../config/logger"
import datasource from "../../../config/ormConfig"
import { User } from "../../entity/user.entity"
import AppErrorUtil from "../../utils/error-handler/appError"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
// import { LoginData } from "../../utils/interface/user.interface";

const userRepository = datasource.getRepository(User) // Get the repository from the DataSource

export const loginUser = async (data: any) => {
  const { passportNum, password } = data

  if (!passportNum || !password) {
    throw new AppErrorUtil(400, "Passport number and password are required")
  }

  try {
    const user = await userRepository.findOne({ where: { passportNum } })

    if (!user) {
      throw new AppErrorUtil(
        404,
        "The email or password you entered is incorrect"
      )
    }

    const hash = user.password

    const verify = await bcrypt.compare(password, hash)

    if (!verify) {
      throw new AppErrorUtil(
        400,
        "The email or password you entered is invalid"
      )
    } else {
      const payload = {
        user: {
          id: user.id,
        },
      }

      const secretKey = process.env.JWT_SECRET_KEY || ""
      const token = jwt.sign(payload, secretKey)

      const { password, ...userData } = user

      console.log(verify, token, userData)
      return { verify, token, data: userData }
    }
  } catch (error) {
    logger.error(`Error occurred: ${error.message}`)
  }
}
