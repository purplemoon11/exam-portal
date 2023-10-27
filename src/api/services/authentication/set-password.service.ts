import { User } from "../../entity/user.entity"
import ormConfig from "../../../config/ormConfig"

const userRepository = ormConfig.getRepository(User)

export const userUpdatePass = async (password: string, user: object) => {
  const pass = userRepository.merge(user, { password })

  return pass
}
