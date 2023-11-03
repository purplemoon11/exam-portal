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
  updateVideo,
} from "../../../controllers/admin/Master-Data/video.controller";
import { addPdf } from "../../../controllers/admin/Master-Data/pdf.controller";
import { addSlide } from "../../../controllers/admin/Master-Data/slide.controller";

const router = Router();

router.get("/contents/:id", getContentsByTopicId);
// router.get("/one/:id", getClusterById);
router.post("/create", upload.single("filePath"), createTopic);
router.put("/update/:id", upload.single("filePath"), updateTopic);
router.delete("/delete/:id", deleteTopic);
router.post("/add-video", upload.single("videoPath"), addVideo);
router.put("/update-video/:id", upload.single("videoPath"), updateVideo);

router.post("/add-pdf", upload.single("pdfPath"), addPdf);
router.post("/add-slide", upload.single("slidePath"), addSlide);

export default router;
