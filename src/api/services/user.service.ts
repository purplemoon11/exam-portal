import { User } from "../entity/user.entity"
import ormConfig from "../../config/ormConfig"

const userRepository = ormConfig.getRepository(User)

export const userRegister = async (userData: object) => {
  let user = await userRepository.save(userData)

  return user
}

export const findByIdUser = async (userId: number) => {
  const user = await userRepository.findOne({ where: { id: userId } })
  return user
}
