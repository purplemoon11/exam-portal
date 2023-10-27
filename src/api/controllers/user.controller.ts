import { Request, Response, NextFunction } from "express";
import { userRegister } from "../services/user.service";
import { User } from "../entity/user.entity";
import env from "../utils/env";
import jwt from "jsonwebtoken";
import ormConfig from "../../config/ormConfig";
import AppErrorUtil from "../utils/error-handler/appError";
import logger from "../../config/logger";

const userRepository = ormConfig.getRepository(User);
const JWTSECRET = env.JWTSECRET;

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { fullName, phNumber, email, passportNum } = req.body;

    const isUserExists = await userRepository.findOne({
      where: { passportNum },
    });

    if (isUserExists) {
      throw new AppErrorUtil(400, "User already exists");
    }

    let user = new User();

    user.fullname = fullName;
    user.phNumber = phNumber;
    user.email = email;
    user.passportNum = passportNum;

    let data = await userRegister(user);

    const payload = {
      user: {
        id: data?.id,
      },
    };

    jwt.sign(
      payload,
      JWTSECRET as string,
      { expiresIn: "30d" },
      (err, token) => {
        if (err) {
          throw new AppErrorUtil(400, err.message);
        }
        logger.info("User created successfully");
        res.status(201).json({ data, token });
      }
    );
  } catch (err) {
    logger.error(err);
    throw new AppErrorUtil(500, "Internal server error");
  }
};
