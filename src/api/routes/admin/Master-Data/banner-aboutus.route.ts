import { Router } from "express";
import {
  createBannerImage,
  deleteBannerImage,
  updateAboutUs,
  updateBannerImage,
} from "../../../controllers/admin/Master-Data/banner-aboutus.controller";
import { FileUpload } from "../../../utils/multer";
import { upload } from "../../../middlewares/files.middleware";

const router = Router();

// const BannerImageUrl = FileUpload.fields([
//   {
//     name: "image_url",
//     maxCount: 1,
//   },
// ]);

router.post("/about-us", updateAboutUs);
router.post("/add-banner", upload.array("image_url"), createBannerImage);
router.put("/update-banner/:id", upload.array("image_url"), updateBannerImage);
router.delete("/delete-banner/:id", deleteBannerImage);

export default router;
