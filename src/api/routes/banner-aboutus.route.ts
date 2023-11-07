import { Router } from "express";
import {
  getAboutUs,
  getBanners,
} from "../controllers/banner-aboutus.controller";
import { authUser } from "../middlewares/auth.middleware";
import { isUser } from "../middlewares/isUser.middleware";

const router = Router();

router.get("/aboutus", authUser, isUser, getAboutUs);
router.get("/banners", authUser, isUser, getBanners);

export default router;
