import { Request, Response } from "express";
import { catchAsync } from "../../utils/error-handler/catchAsync";
import { userManagementService } from "../../services/index.service";
import AppErrorUtil from "../../utils/error-handler/appError";
import { User } from "../../entity/user.entity";
import ormConfig from "../../../config/ormConfig";
import { ExamSetting } from "../../entity/examSetting.entity";
import { SelectQueryBuilder } from "typeorm";
const userRepo = ormConfig.getRepository(User);
const examSettingRepo = ormConfig.getRepository(ExamSetting);

export const userManagement = catchAsync(
  async (req: Request, res: Response) => {
    const result = await userManagementService.userManagement();
    if (!result || result.length === 0) {
      throw new AppErrorUtil(400, "No active users found");
    }
    return res.status(200).json({
      message: "User fetched successfully!!!",
      success: true,
      result,
    });
  }
);

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const examDetails = await examSettingRepo.find();
    console.log({ examDetails });
    const users = await userRepo
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.testGroup", "testGroup")
      .orderBy("testGroup.exam_group_date", "DESC")
      .getMany();

    const extractedData = users.map((user: any) => {
      const userData = {
        name: user.fullname,
        passportNum: user.passportNum,
        phNumber: user.phNumber,
        emailAddress: user.email,
      };
      const latestTestGroupAttempts =
        user.testGroup.length > 0 ? user.testGroup[0].total_attempts : null;
      return {
        ...userData,
        examStatus: `${latestTestGroupAttempts}/${examDetails[0].exam_frequency}`,
      };
    });

    return res.status(200).json({ data: extractedData });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};
