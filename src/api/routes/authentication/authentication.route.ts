import { Router } from "express";
import { login } from "../../controllers/authentication/login-authentication.controller";
import { resetPassword } from "../../controllers/authentication/forgot-password.controller";

const router = Router();

router.post("/login", login);
router.post("/reset-password", resetPassword);

export default router;
