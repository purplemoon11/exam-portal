import express from "express";
import Authentication from "./authentication/authentication.route";
import PaymentRoute from "./payment.route";
import UserRoute from "./user.route";
import OtpRoute from "./otp.route";
import CountryRoute from "./country.route";
import NotificationRoute from "./notification.route";
import UserCountryRoute from "./userCountry.route";
import AdminCluster from "./admin/Master-Data/cluster.route";
import UserCluster from "./admin/Master-Data/cluster.route";
import AdminUserManagement from "./admin/user-management.route";
import QuestionRoute from "./question.route";
import courseRoute from "./admin/Master-Data/course.route";
import sessionRoute from "./admin/Master-Data/session.route";
import topicRoute from "./admin/Master-Data/topic.route";
import AdminBannerAboutUs from "./admin/Master-Data/banner-aboutus.route";
import BannerAboutUs from "./banner-aboutus.route";
import TestExamRoute from "./testExamination.route";
import CandExamRoute from "./candidateExam.route";
import TestExamGroupRoute from "./testExamGroup.route";
import ExamSectionRoute from "./examSection.route";
import ExamSettingRoute from "./examSetting.route";
import KhaltiRoute from "./khalti.payment.route";
import { authUser } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/isAdmin.middleware";
import { isUser } from "../middlewares/isUser.middleware";

const router = express.Router();

router.use("/admin/topic", authUser, topicRoute);
router.use("/authentication", Authentication);
router.use("/payment", authUser, isUser, PaymentRoute);
router.use("/user", UserRoute);
router.use("/otp", OtpRoute);
router.use("/country", authUser, CountryRoute);
router.use("/epayment", KhaltiRoute);

router.use("/notification", NotificationRoute);
router.use("/usercountry", authUser, UserCountryRoute);
router.use("/admin/course", authUser, courseRoute);
router.use("/admin/session", authUser, sessionRoute);
router.use("/admin", authUser, AdminCluster);
router.use("/admin", authUser, AdminUserManagement);
router.use("/question", authUser, QuestionRoute);
router.use("/banner-aboutus", authUser, isAdmin, AdminBannerAboutUs);
router.use("/banneraboutus", authUser, isUser, BannerAboutUs);
router.use("/test-exam", TestExamRoute);
router.use("/exam-group", TestExamGroupRoute);
router.use("/candidate-exam", authUser, CandExamRoute);
router.use("/exam-section", authUser, ExamSectionRoute);
router.use("/exam-setting", authUser, ExamSettingRoute);

export default router;
