import { Request, Response, NextFunction } from "express";
import { userRegister } from "../services/user.service";
import { User } from "../entity/user.entity";
import env from "../utils/env";
import jwt from "jsonwebtoken";
import ormConfig from "../../config/ormConfig";
import AppErrorUtil from "../utils/error-handler/appError";
import logger from "../../config/logger";
// import { client, getAsync, setAsync } from "../../config/redisConfig";

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
      return res.status(400).json({ message: "User already exists" });
    }

    let user = new User();

    user.fullname = fullName;
    user.phNumber = phNumber;
    user.email = email;
    user.passportNum = passportNum;
    user.payment_status = false;

    let data = await userRegister(user);

    const payload = {
      user: {
        id: data?.id,
        role: data?.role,
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
        res.status(201).json({
          message: "Registered successfully",
          success: true,
          token,
          user: data,
        });
      }
    );
  } catch (err) {
    logger.error(err);
    throw new AppErrorUtil(500, "Internal server error");
  }
};

// export const setUser = async (req: Request, res: Response) => {
//   try {
//     const { fullName, phNumber, email, passportNum } = req.body;

//     const isUserExists = await userRepository.findOne({
//       where: { passportNum },
//     });

//     if (isUserExists) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     let user = {
//       fullname: fullName,
//       phNumber: phNumber,
//       email: email,
//       passportNum: passportNum,
//       payment_status: false,
//     };
//     // const result = await client.set(passportNum, JSON.stringify(user));
//     // console.log("resulttttt", result);
//     // const data = await setAsync(passportNum, JSON.stringify(user));
//     // console.log("daaataaa", data);
//     // const getData = await getAsync(passportNum);
//     const cachedUsers = await client.get(passportNum);
//     console.log(cachedUsers);
//     res.status(201).json({
//       message: "User data saved to Redis successfully",
//       data: cachedUsers,
//     });
//   } catch (err: any) {
//     res
//       .status(500)
//       .json({ error: "Internal Server Error", errorMessage: err.message });
//   }
// };
