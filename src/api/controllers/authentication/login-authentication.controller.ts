import { authenticationService } from "../../services/index.service"
import AppErrorUtil from "../../utils/error-handler/appError"
import { catchAsync } from "../../utils/error-handler/catchAsync"
import { Request, Response } from "express"

export const login = catchAsync(async (req: Request, res: Response) => {
  const result = await authenticationService.loginUser(req.body)
  if (!result) {
    throw new AppErrorUtil(400, "Cannot login, please try again")
  }
  return res.status(200).json({
    message: "Successfully Login",
    success: true,
    token: result.token,
    user: result.data,
  })
})
