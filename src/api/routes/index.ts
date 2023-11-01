import express from "express";
import Authentication from "./authentication/authentication.route";
import PaymentRoute from "./payment.route";
import UserRoute from "./user.route";
import OtpRoute from "./otp.route";
import CountryRoute from "./country.route";
import NotificationRoute from "./notification.route";
import UserCountryRoute from "./userCountry.route";
import AdminCluster from "./admin/Master-Data/cluster.route";
import AdminUserManagement from "./admin/user-management.route";
import QuestionRoute from "./question.route";
import BannerAboutUs from "./admin/Master-Data/banner-aboutus.route";

const router = express.Router();

router.use("/authentication", Authentication);
router.use("/payment", PaymentRoute);
router.use("/user", UserRoute);
router.use("/otp", OtpRoute);
router.use("/country", CountryRoute);
router.use("/notification", NotificationRoute);
router.use("/usercountry", UserCountryRoute);
router.use("/admin", AdminCluster);
router.use("/admin", AdminUserManagement);
router.use("/question", QuestionRoute);
router.use("/banner-aboutus", BannerAboutUs);

export default router;
