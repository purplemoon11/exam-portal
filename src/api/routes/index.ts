import express from "express"
import Authentication from "./authentication/authentication.route"
import PaymentRoute from "./payment.route"
import UserRoute from "./user.route"
import OtpRoute from "./otp.route"
import CountryRoute from "./country.route"

const router = express.Router()

router.use("/authentication", Authentication)
router.use("/payment", PaymentRoute)
router.use("/user", UserRoute)
router.use("/otp", OtpRoute)
router.use("/country", CountryRoute)

export default router
