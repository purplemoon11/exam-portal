import { Router } from "express";
import {
  createBannerImage,
  deleteBannerImage,
  updateAboutUs,
  updateBannerImage,
} from "../../../controllers/admin/Master-Data/banner-aboutus.controller";
import { FileUpload } from "../../../utils/multer";
import { getBanners } from "../../../controllers/banner-aboutus.controller";

const router = Router();

const BannerImageUrl = FileUpload.array("image_url", 10);

router.post("/about-us", updateAboutUs);
router.post("/add-banner", BannerImageUrl, createBannerImage);
router.put("/update-banner/:id", BannerImageUrl, updateBannerImage);
router.delete("/delete-banner/:id", deleteBannerImage);
router.get("/get-banner", getBanners);

export default router;
