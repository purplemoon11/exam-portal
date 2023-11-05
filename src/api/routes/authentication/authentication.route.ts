import { Router } from "express";
import { login } from "../../controllers/authentication/login-authentication.controller";
import {
  forgotPassword,
  sendOtp,
  resetPassword,
} from "../../controllers/authentication/forgot-password.controller";

const router = Router();

router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/sendOTP", sendOtp);

export default router;
