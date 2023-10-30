import { Request, Response } from "express";
import { catchAsync } from "../../utils/error-handler/catchAsync";
import { userManagementService } from "../../services/index.service";
import AppErrorUtil from "../../utils/error-handler/appError";

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
