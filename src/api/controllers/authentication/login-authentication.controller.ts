import { authenticationService } from "../../services/index.service";
import AppErrorUtil from "../../utils/error-handler/appError";
import { catchAsync } from "../../utils/error-handler/catchAsync";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import ormConfig from "../../../config/ormConfig";
import { User } from "../../entity/user.entity";
import jwt from "jsonwebtoken";
const userRepo = ormConfig.getRepository(User);

export const login = catchAsync(async (req: Request, res: Response) => {
  const result = await authenticationService.loginUser(req.body);
  if (!result) {
    throw new AppErrorUtil(400, "Cannot login, please try again");
  }
  return res.status(200).json({
    message: "Successfully Login",
    success: true,
    token: result.token,
    user: result.data,
  });
});

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { userName } = req.body;
    console.log(req.body.password);
    if (!userName || !req.body.password) {
      return res.status(400).json({ message: "Username or password required" });
    }
    const user = await userRepo.findOne({
      where: { fullname: userName, role: "admin" },
    });
    console.log(user);
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found or unauthorized user" });
    }

    const verify = await bcrypt.compare(req.body.password, user.password);
    console.log(verify);
    if (!verify) {
      return res.status(400).json({ message: "Invalid userName or password" });
    }
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };
    const secretKey = process.env.JWT_SECRET_KEY!;
    const token = jwt.sign(payload, secretKey);

    const { password, ...userData } = user;
    return res
      .status(200)
      .json({ message: "Successfully login", token, userData });
  } catch (err: any) {
    return res.status(400).json({ errorMessage: err.message });
  }
};
