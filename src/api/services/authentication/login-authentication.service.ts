import datasource from "../../../config/ormConfig"
import { User } from "../../entity/user.entity"
import AppErrorUtil from "../../utils/error-handler/appError"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { LoginData } from "../../utils/interface/user.interface"

const userRepository = datasource.getRepository(User) // Get the repository from the DataSource

export const loginUser = async (data: LoginData) => {
  const { passport, password } = data
  const user = await userRepository.findOne({
    where: { passportNum: passport },
  })
  if (!user) {
    throw new AppErrorUtil(
      404,
      "The email or password you entered is incorrect"
    )
  }
  const verify = await bcrypt.compare(password, user.password!)
  if (!verify) {
    throw new AppErrorUtil(400, "The email or password you entered is invalid")
  } else {
    const payload = {
      id: user.id,
      email: user.email,
      name: user.fullname,
      passport: user.passportNum,
    }
    const secretKey = process.env.JWT_SECRET_KEY
      ? process.env.JWT_SECRET_KEY
      : ""
    const token = jwt.sign(payload, secretKey)
    const { password, ...userData } = user
    console.log(verify, token, userData)
    return { verify, token, data: userData }
  }
}
