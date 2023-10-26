import { Router } from "express"
import { sendPaymentRequest } from "../controllers/payment.controller"

const router = Router()

router.route("/send").post(sendPaymentRequest)

export default router
