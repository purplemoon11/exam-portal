import { Request, Response } from "express";
import { forgotPasswordService } from "../../services/index.service";
import AppErrorUtil from "../../utils/error-handler/appError";
import { catchAsync } from "../../utils/error-handler/catchAsync";

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const result = await forgotPasswordService.resetPassword(req.body);
  if (!result) {
    throw new AppErrorUtil(400, "Error resetting Password,Please try again");
  }
  return res.status(200).json({
    message: "Password reset successfully",
    success: true,
    result,
  });
});
