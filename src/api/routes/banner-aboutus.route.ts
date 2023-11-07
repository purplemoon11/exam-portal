import { Router } from "express";
import {
  getAboutUs,
  getBanners,
} from "../controllers/banner-aboutus.controller";

const router = Router();

router.get("/aboutus", getAboutUs);
router.get("/banners", getBanners);

export default router;
