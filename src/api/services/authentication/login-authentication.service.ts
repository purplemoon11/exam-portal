import logger from "../../../config/logger";
import datasource from "../../../config/ormConfig";
import { User } from "../../entity/user.entity";
import AppErrorUtil from "../../utils/error-handler/appError";
import { UserType } from "../../utils/interface/user.interface";
import bcrypt from "bcrypt";

const userRepository = datasource.getRepository(User); // Get the repository from the DataSource

export const registerUser = async (data: UserType) => {
  const { passport, password } = data;
  const user = await userRepository.findOneBy({ passport });
  if (!user) {
    throw new AppErrorUtil(
      404,
      "The email or password you entered is incorrect"
    );
  }
  const verify = await bcrypt.compare(password, user.password);
};
