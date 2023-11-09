import { Router } from "express"
import {
  updatePaymentAttemptNo,
  sendPaymentRequest,
  verifyPayment,
  checkCurrentPaymentStatus,
  checkPaymentStatus,
} from "../controllers/payment.controller"
import { authUser } from "../middlewares/auth.middleware"

const router = Router()

router.route("/send").post(authUser, sendPaymentRequest)
router.route("/verify").patch(authUser, verifyPayment)
router.route("/update-attempt").patch(authUser, updatePaymentAttemptNo)
router.route("/check").get(authUser, checkPaymentStatus)
router.route("/status/check").get(authUser, checkCurrentPaymentStatus)

export default router
