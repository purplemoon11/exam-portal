import { NextFunction, Request, Response } from "express";
import logger from "../../config/logger";
import AppErrorUtil from "../utils/error-handler/appError";

export const errorHandler = (
  err: AppErrorUtil,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err);
  if (err instanceof AppErrorUtil) {
    return res.status(err.status).json({
      message: err.message,
    });
  }

  return res.status(500).send("Something went wrong");
};

/**
 * If error is not an instanceOf APIError, convert it.
 */
export const errorConverter = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let convertedError = err as any;

  if (!(err instanceof AppErrorUtil)) {
    let message = err.message || "internal Server Error";
    let status = err.status || 500;
    convertedError = new AppErrorUtil(status, message);
  }

  return errorHandler(convertedError, req, res, next);
};

/**
 * Catch 404 and forward to error handler
 */
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  let message = "Route Not found";
  let status = 404;
  const err = new AppErrorUtil(status, message);
  return errorHandler(err, req, res, next);
};
