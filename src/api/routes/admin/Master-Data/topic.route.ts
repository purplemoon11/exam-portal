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

const router = Router();

router.get("/contents/:id", getContentsByTopicId);
// router.get("/one/:id", getClusterById);
router.post("/create", upload.single("filePath"), createTopic);
router.put("/update/:id", upload.single("filePath"), updateTopic);
router.delete("/delete/:id", deleteTopic);

router.post("/add-video", upload.single("videoPath"), addVideo);
router.put("/update-video/:id", upload.single("videoPath"), updateVideo);
router.delete("/delete-video/:id", deleteVideo);

router.post("/add-pdf", upload.single("pdfPath"), addPdf);
router.put("/update-pdf/:id", upload.single("pdfPath"), updatePdf);
router.delete("/delete-pdf/:id", deletePdf);

router.post("/add-slide", upload.single("slidePath"), addSlide);
router.put("/update-slide/:id", upload.single("slidePath"), updateSlide);
router.delete("/delete-slide/:id", deleteSlide);

export default router;
