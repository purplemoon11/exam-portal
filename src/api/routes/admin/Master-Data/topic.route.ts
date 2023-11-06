import { Router } from "express";
import { upload } from "../../../middlewares/files.middleware";
import {
  createTopic,
  deleteTopic,
  getContentsByTopicId,
  updateTopic,
} from "../../../controllers/admin/Master-Data/topic.controller";
import {
  addVideo,
  deleteVideo,
  updateVideo,
} from "../../../controllers/admin/Master-Data/video.controller";
import {
  addPdf,
  deletePdf,
  updatePdf,
} from "../../../controllers/admin/Master-Data/pdf.controller";
import {
  addSlide,
  deleteSlide,
  updateSlide,
} from "../../../controllers/admin/Master-Data/slide.controller";
import { isAdmin } from "../../../middlewares/isAdmin.middleware";

const router = Router();

router.get("/contents/:id", getContentsByTopicId);
// router.get("/one/:id", getClusterById);
router.post("/create", isAdmin, upload.single("filePath"), createTopic);
router.put("/update/:id", isAdmin, upload.single("filePath"), updateTopic);
router.delete("/delete/:id", isAdmin, deleteTopic);

router.post("/add-video", isAdmin, upload.single("videoPath"), addVideo);
router.put(
  "/update-video/:id",
  isAdmin,
  upload.single("videoPath"),
  updateVideo
);
router.delete("/delete-video/:id", isAdmin, deleteVideo);

router.post("/add-pdf", isAdmin, upload.single("pdfPath"), addPdf);
router.put("/update-pdf/:id", isAdmin, upload.single("pdfPath"), updatePdf);
router.delete("/delete-pdf/:id", isAdmin, deletePdf);

router.post("/add-slide", isAdmin, upload.single("slidePath"), addSlide);
router.put(
  "/update-slide/:id",
  isAdmin,
  upload.single("slidePath"),
  updateSlide
);
router.delete("/delete-slide/:id", isAdmin, deleteSlide);

export default router;
