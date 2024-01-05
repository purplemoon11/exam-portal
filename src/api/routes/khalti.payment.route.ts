import { Router } from "express";
import {
  paymentInitiation,
  paymentVerification,
} from "../controllers/khalti-payment.controller";

const router = Router();

router.post("/initiate", paymentInitiation);
router.get("/verify", paymentVerification);

export default router;
