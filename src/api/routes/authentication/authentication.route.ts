import { Router } from "express";
import { login } from "../../controllers/authentication/login-authentication.controller";
import {
  forgotPassword,
  resetPassword,
} from "../../controllers/authentication/forgot-password.controller";

const router = Router();

router.post("/login", login);
router.post("/reset-password", resetPassword);
router.post("/forgot-password", forgotPassword);

export default router;
