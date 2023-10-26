import { Router } from "express"
import { createOtp, verifyOtp, testOtp } from "../controllers/otp.controller"
import { authUser } from "../middlewares/auth.middleware"

const router = Router()

router.route("/send").post(authUser, createOtp)
router.route("/verify").get(authUser, verifyOtp)
router.route("/").get(authUser, testOtp)

export default router
