import { Router } from "express"
import {
  sendPaymentRequest,
  verifyPayment,
} from "../controllers/payment.controller"
import { authUser } from "../middlewares/auth.middleware"

const router = Router()

router.route("/send").post(authUser, sendPaymentRequest)
router.route("/verify").get(authUser, verifyPayment)

export default router
