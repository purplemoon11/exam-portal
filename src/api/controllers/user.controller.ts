import { Request, Response, NextFunction } from "express";
import { userRegister } from "../services/user.service";
import { User } from "../entity/user.entity";
import env from "../utils/env";
import jwt from "jsonwebtoken";
import ormConfig from "../../config/ormConfig";
import AppErrorUtil from "../utils/error-handler/appError";
import logger from "../../config/logger";
import { getAsync, setAsync } from "../../config/redisConfig";
import { userService } from "../services/index.service";
import { Not } from "typeorm";

const userRepository = ormConfig.getRepository(User);
const JWTSECRET = env.JWTSECRET;

interface IUserProfile extends Request {
  user: {
    id: string;
  };
}

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
    user.birthDate = req.body.birthDate;
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
    return res
      .status(500)
      .json({ message: "Internal server error", errorMessage: err.message });
    // throw new AppErrorUtil(500, "Internal server error");
  }
};

export const setUser = async (req: Request, res: Response) => {
  try {
    const { fullName, phNumber, email, passportNum } = req.body;
    const data1 = await getAsync(passportNum);
    console.log(data1);
    const resu = JSON.parse(data1 as string);
    return res.status(200).json(data1);
    const isUserExists = await userRepository.findOne({
      where: { passportNum },
    });

    if (isUserExists) {
      return res.status(400).json({
        message:
          "User with this passportNum already registered, Please login to proceed",
      });
    }

    const isUserInRedis = await getAsync(passportNum);
    if (isUserInRedis) {
      return res.status(400).json({
        message: "Please verify your account using OTP send to your email",
      });
    }

    let user = {
      fullname: fullName,
      phNumber: phNumber,
      email: email,
      passportNum: passportNum,
      payment_status: false,
    };
    // const result = await client.set(passportNum, JSON.stringify(user));
    // console.log("resulttttt", result);
    const data = await setAsync(passportNum, JSON.stringify(user));
    console.log("daaataaa", data);
    // const getData = await getAsync(passportNum);
    // const cachedUsers = await client.get(passportNum);
    // console.log(cachedUsers);
    res.status(201).json({
      message: "User data saved to Redis successfully",
      data,
    });
  } catch (err: any) {
    res
      .status(500)
      .json({ error: "Internal Server Error", errorMessage: err.message });
  }
};

export const getProfile = async (req: IUserProfile, res: Response) => {
  try {
    const userId = +req.user.id;
    const userProfile = await User.findOne({ where: { id: userId } });
    if (!userProfile) {
      return res.status(400).json({ message: "Unable to load user profile" });
    }
    const responseData = {
      fullname: userProfile.fullname,
      phNumber: userProfile.phNumber,
      email: userProfile.email,
      passportNum: userProfile.passportNum,
      birthDate: userProfile.birthDate,
      profileImage: userProfile.profileImage,
    };
    return res.status(200).json(responseData);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

export const updateProfile = async (req: IUserProfile, res: Response) => {
  try {
    const userId = +req.user.id;
    const isPassportInUse = await User.findOne({
      where: {
        passportNum: req.body.passportNum,
        id: Not(userId),
      },
    });
    if (isPassportInUse) {
      return res
        .status(400)
        .json({ message: "Passportport number already in use" });
    }
    const userProfile = await User.findOne({ where: { id: userId } });
    if (!userProfile) {
      return res.status(400).json({ message: "Unable to find user" });
    }
    let profileImage: string;
    if (!req.file) {
      profileImage = "";
    }

    profileImage = `${req.secure ? "https" : "http"}://${req.get(
      "host"
    )}/medias/${req.file?.filename}`;

    const dataToUpdate = { profileImage, ...req.body };
    const updateResult = await userService.updateUser(
      userProfile,
      dataToUpdate
    );
    if (!updateResult) {
      return res
        .status(400)
        .json({ message: "Unable to update user profile,please try again" });
    }
    const responseData = {
      fullname: updateResult.fullname,
      phNumber: updateResult.phNumber,
      email: updateResult.email,
      passportNum: updateResult.passportNum,
      birthDate: updateResult.birthDate,
      profileImage: updateResult.profileImage,
    };
    return res
      .status(200)
      .json({ message: "Profile updated successfully", responseData });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};
