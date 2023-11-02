import { Router } from "express"
import {
  checkPaymentStatus,
  sendPaymentRequest,
  verifyPayment,
} from "../controllers/payment.controller"
import { authUser } from "../middlewares/auth.middleware"

const router = Router()

router.route("/send").post(authUser, sendPaymentRequest)
router.route("/verify").patch(authUser, verifyPayment)
router.route("/check").patch(authUser, checkPaymentStatus)

export default router
