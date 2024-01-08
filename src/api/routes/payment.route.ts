import { Router } from "express";
import {
  updatePaymentAttemptNo,
  sendPaymentRequest,
  verifyPayment,
  checkCurrentPaymentStatus,
  checkPaymentStatus,
  sendPaymentRequestForMobile,
  verifyMobilePayment,
} from "../controllers/payment.controller";
import { authUser } from "../middlewares/auth.middleware";
import {  paymentInitiation,  } from "../controllers/khalti-payment.controller";

const router = Router();

router.route("/send").post(authUser, sendPaymentRequest);

router.route("/send-mobile").get(sendPaymentRequestForMobile);

router.route("/verify").patch(authUser, verifyPayment);
router.route("/verify-mobile").patch(authUser, verifyMobilePayment);

router.route("/update-attempt").patch(authUser, updatePaymentAttemptNo);
router.route("/check").get(authUser, checkPaymentStatus);
router.route("/status/check").get(authUser, checkCurrentPaymentStatus);

export default router;
