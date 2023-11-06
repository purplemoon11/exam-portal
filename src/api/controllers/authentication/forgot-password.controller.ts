import { Request, Response } from "express";
import { forgotPasswordService } from "../../services/index.service";
import AppErrorUtil from "../../utils/error-handler/appError";
import { catchAsync } from "../../utils/error-handler/catchAsync";

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const result = await forgotPasswordService.resetPasswordWithOTP(req.body);
  if (!result) {
    throw new AppErrorUtil(400, "Error resetting Password,Please try again");
  }
  return res.status(200).json({
    message: "Password reset successfully",
    success: true,
    result,
  });
});

export const forgotPassword = catchAsync(
  async (req: Request, res: Response) => {
    const origin = req.headers.origin;
    const result = await forgotPasswordService.forgetPassword(req.body, origin);
    if (!result) {
      throw new AppErrorUtil(400, "Cannot send email");
    }
    return res.status(200).json({
      message: "Check your email to reset password",
      success: true,
      result,
    });
  }
);

export const verifyOtp = catchAsync(async (req: Request, res: Response) => {
  const result = await forgotPasswordService.verifyOTP(req.body);
  if (!result) {
    throw new AppErrorUtil(400, "Cannot verify");
  }
  return res.status(200).json({
    message: "Validated successfully",
    success: true,
    result,
  });
});

export const sendOtp = catchAsync(async (req: Request, res: Response) => {
  const result = await forgotPasswordService.sendOtp(req.body, req.body);
  if (!result) {
    throw new AppErrorUtil(400, "OTP not sent");
  }
  return res.status(200).json({
    message: "OTP Sent Successfully!!!",
    success: true,
    result,
  });
});

// export const validateOtp = catchAsync(async (req: Request, res: Response) => {
//   const result = await forgotPasswordService.resetPasswordWithOTP(req.body);
//   if (!result) {
//     throw new AppErrorUtil(400, "OTP not validated");
//   }
//   return res.status(200).json({
//     message: "OTP validated successfully!!!",
//     success: true,
//     result,
//   });
// });
