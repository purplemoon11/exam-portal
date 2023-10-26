import { Router } from "express"
import PaymentRoute from "./payment.route"
import UserRoute from "./user.route"
import OtpRoute from "./otp.route"

const router = Router()

router.use("/payment", PaymentRoute)
router.use("/user", UserRoute)
router.use("/otp", OtpRoute)

export default router
