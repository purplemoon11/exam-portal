import { Router } from "express"
import {
  updatePaymentAttemptNo,
  sendPaymentRequest,
  verifyPayment,
} from "../controllers/payment.controller"
import { authUser } from "../middlewares/auth.middleware"

const router = Router()

router.route("/send").post(authUser, sendPaymentRequest)
router.route("/verify").patch(authUser, verifyPayment)
router.route("/check").patch(authUser, updatePaymentAttemptNo)

export default router
