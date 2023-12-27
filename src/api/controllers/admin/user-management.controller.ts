import { Request, Response } from "express";
import { catchAsync } from "../../utils/error-handler/catchAsync";
import { userManagementService } from "../../services/index.service";
import AppErrorUtil from "../../utils/error-handler/appError";
import { User } from "../../entity/user.entity";
import ormConfig from "../../../config/ormConfig";
import { ExamSetting } from "../../entity/examSetting.entity";
import { SelectQueryBuilder } from "typeorm";
import { TestExamGroup } from "../../entity/testExamGroup.entity";
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
    const { page = 1, pageSize = 10 } = req.query;
    console.log({ page, pageSize });
    const examDetails = await examSettingRepo.find();
    console.log({ examDetails });

    const skip = (Number(page) - 1) * Number(pageSize);
    console.log({ skip });

    const [users, userCount] = await User.createQueryBuilder("user")
      .leftJoinAndSelect(
        "user.testGroup",
        "testGroup",
        "testGroup.exam_group_date = (SELECT MAX(subTestGroup.exam_group_date) FROM test_group subTestGroup WHERE subTestGroup.cand_id = user.id)"
      )
      .orderBy("user.id", "ASC")
      .take(+pageSize)
      .skip(skip)
      .getManyAndCount();

    const userIds = users.map((user) => user.id);
    console.log(userIds);

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
    const totalPages = Math.ceil(+userCount / +pageSize);

    return res.status(200).json({
      data: extractedData,
      totalCount: userCount,
      totalPages,
      currentPage: page,
    });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};
