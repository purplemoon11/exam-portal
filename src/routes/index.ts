import { Router } from "express"
import PaymentRoute from "./payment.route"
import UserRoute from "./user.route"

const router = Router()

router.use("/payment", PaymentRoute)
router.use("/user", UserRoute)

export default router
