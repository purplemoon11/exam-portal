import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import env from "../utils/env";
import { findByIdUser } from "../services/user.service";
import logger from "../../config/logger";

// Error messages
const ERROR_MESSAGES = {
  UNKNOWN_REQUEST: "Unknown request, no token",
  NOT_AUTHORIZED: "Not authorized, Invalid token",
};

interface UserRequest extends Request {
  userId: any;
  user: any;
}

export const authUser = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    return res.status(400).json({ msg: ERROR_MESSAGES.UNKNOWN_REQUEST });
  }

  try {
    const token = req.headers.authorization.split(" ")[1];
    const jwtSecret = env.JWTSECRET;

    const decoded: any = jwt.verify(token, jwtSecret as string);

    const user: any = decoded.id || decoded.user.id;

    req.userId = user;

    let userData = await findByIdUser(req.userId);

    if (!userData) {
      return res.status(404).json({ msg: ERROR_MESSAGES.NOT_AUTHORIZED });
    }

    req.user = userData;

    next();
  } catch (err) {
    console.error(err);
    res.status(404).json({ msg: ERROR_MESSAGES.NOT_AUTHORIZED });
  }
};
