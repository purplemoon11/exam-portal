import { Router } from "express";
import {
  createBannerImage,
  updateAboutUs,
  updateBannerImage,
} from "../../../controllers/admin/Master-Data/banner-aboutus.controller";
import { FileUpload } from "../../../utils/multer";

const router = Router();

const BannerImageUrl = FileUpload.fields([
  {
    name: "image_url",
    maxCount: 1,
  },
]);

router.post("/about-us", updateAboutUs);
router.post("/add-banner", BannerImageUrl, createBannerImage);
router.put("/update-banner/:id", BannerImageUrl, updateBannerImage);

export default router;
