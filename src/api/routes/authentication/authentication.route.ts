import { Router } from "express";
import { login } from "../../controllers/authentication/login-authentication.controller";

const router = Router();

router.post("/login", login);

export default router;
