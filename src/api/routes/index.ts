import express from "express"
import Authentication from "./authentication/authentication.route"
import PaymentRoute from "./payment.route"
import UserRoute from "./user.route"
import OtpRoute from "./otp.route"
import CountryRoute from "./country.route"
import NotificationRoute from "./notification.route"
import UserCountryRoute from "./userCountry.route"
import AdminCluster from "./admin/Master-Data/cluster.route"
import AdminUserManagement from "./admin/user-management.route"
import QuestionRoute from "./question.route"
import courseRoute from "./admin/Master-Data/course.route"
import sessionRoute from "./admin/Master-Data/session.route"
import topicRoute from "./admin/Master-Data/topic.route"
import AdminBannerAboutUs from "./admin/Master-Data/banner-aboutus.route"
import BannerAboutUs from "./banner-aboutus.route"
import TestExamRoute from "./testExamination.route"
import CandExamRoute from "./candidateExam.route"

const router = express.Router()

router.use("/admin/topic", topicRoute)
router.use("/authentication", Authentication)
router.use("/payment", PaymentRoute)
router.use("/user", UserRoute)
router.use("/otp", OtpRoute)
router.use("/country", CountryRoute)
router.use("/notification", NotificationRoute)
router.use("/usercountry", UserCountryRoute)
router.use("/admin", AdminCluster)
router.use("/admin/course", courseRoute)
router.use("/admin/session", sessionRoute)
router.use("/admin", AdminUserManagement)
router.use("/question", QuestionRoute)
router.use("/banner-aboutus", AdminBannerAboutUs)
router.use("/banner-aboutus", BannerAboutUs)
router.use("/test-exam", TestExamRoute)
router.use("/candidate-exam", CandExamRoute)

export default router
