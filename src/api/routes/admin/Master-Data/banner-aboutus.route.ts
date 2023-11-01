import { Router } from "express";
import {
  createBannerImage,
  updateAboutUs,
} from "../../../controllers/admin/Master-Data/banner-aboutus.controller";
import { upload } from "../../../utils/multer";

const router = Router();

router.post("/about-us", updateAboutUs);
router.post("/add-banner", upload.array("image_url"), createBannerImage);

export default router;
