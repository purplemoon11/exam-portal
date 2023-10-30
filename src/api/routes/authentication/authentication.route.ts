import { Router } from "express";
import { login } from "../../controllers/authentication/login-authentication.controller";
import {
  forgotPassword,
  resetPassword,
  verifyOtp,
} from "../../controllers/authentication/forgot-password.controller";

const router = Router();

router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify", verifyOtp);
router.post("/reset-password", resetPassword);

export default router;
