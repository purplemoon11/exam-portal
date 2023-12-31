import { NextFunction, Request, Response } from "express"
import { User } from "./isUser.middleware"
import logger from "../../config/logger"
import AppErrorUtil from "../utils/error-handler/appError"

export const isAdmin = async (
  req: Request & { user?: User },
  res: Response,
  next: NextFunction
) => {
  const user = req.user
  if (user.role === "admin") {
    logger.info("Authorized user")
    next()
  } else {
    logger.error("Unauthorized user")
    return res.status(401).json({ message: "Unauthorized user" })
  }
}
