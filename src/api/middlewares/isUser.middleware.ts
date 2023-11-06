import { NextFunction, Request, Response } from "express";
import logger from "../../config/logger";
import AppErrorUtil from "../utils/error-handler/appError";

export interface User {
  id: number;
  role: string;
  // Add other user properties here
}
export const isUser = async (
  req: Request & { user?: User },
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user.role === "user") {
    logger.info("Authorized user");
    next();
  } else {
    logger.error("Unauthorized user");
    throw new AppErrorUtil(401, "Unauthorized user");
  }
};
