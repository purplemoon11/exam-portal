import datasource from "../../../config/ormConfig";
import { User } from "../../entity/user.entity";
import AppErrorUtil from "../../utils/error-handler/appError";

const userRepository = datasource.getRepository(User);

export const userManagement = async () => {
  try {
    const users = await userRepository.find({
      where: { status: true },
      select: ["fullname", "passportNum", "email", "phNumber"],
    });
    if (!users || users.length === 0) {
      throw new AppErrorUtil(404, "No active users found");
    }

    return users;
  } catch (error) {
    console.error("Error in userManagement:", error);
  }
};
