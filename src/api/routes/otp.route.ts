import { Router } from "express";
import { createOtp, verifyOtp } from "../controllers/otp.controller";
import { authUser } from "../middlewares/auth.middleware";

const router = Router();

router.route("/send").post(authUser, createOtp);
router.route("/verify").get(authUser, verifyOtp);

export default router;
