import express from "express"
import Authentication from "./authentication/authentication.route"
import PaymentRoute from "./payment.route"
import UserRoute from "./user.route"
import OtpRoute from "./otp.route"
import CountryRoute from "./country.route"
import NotificationRoute from "./notification.route"
import UserCountryRoute from "./userCountry.route"
import QuestionRoute from "./question.route"

const router = express.Router()

router.use("/authentication", Authentication)
router.use("/payment", PaymentRoute)
router.use("/user", UserRoute)
router.use("/otp", OtpRoute)
router.use("/country", CountryRoute)
router.use("/notification", NotificationRoute)
router.use("/usercountry", UserCountryRoute)
router.use("/question", QuestionRoute)

export default router
