import datasource from "../../../config/ormConfig";
import { User } from "../../entity/user.entity";
import AppErrorUtil from "../../utils/error-handler/appError";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { RegistrationData } from "../../utils/interface/user.interface";

const userRepository = datasource.getRepository(User); // Get the repository from the DataSource

export const registerUser = async (data: RegistrationData) => {
  const { passport, password } = data;
  const user = await userRepository.findOneBy({ passport });
  if (!user) {
    throw new AppErrorUtil(
      404,
      "The email or password you entered is incorrect"
    );
  }
  const verify = await bcrypt.compare(password, user.password!);
  if (!verify) {
    throw new AppErrorUtil(400, "The email or password you entered is invalid");
  } else {
    const payload = {
      id: user.id,
      email: user.email,
      name: user.full_name,
      passport: user.passport,
    };
    const secretKey = process.env.JWT_SECRET_KEY
      ? process.env.JWT_SECRET_KEY
      : "";
    const token = jwt.sign(payload, secretKey);
    const { password, ...userData } = user;
    console.log(verify, token, userData);
    return { verify, token, data: userData };
  }
};
