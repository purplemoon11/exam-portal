import { Router } from "express";
import {
  createSession,
  deleteSession,
  getAllSession,
  updateSession,
} from "../../../controllers/admin/Master-Data/session.controller";
import { upload } from "../../../middlewares/files.middleware";
import {
  createTopic,
  deleteTopic,
  updateTopic,
} from "../../../controllers/admin/Master-Data/topic.controller";

const router = Router();

router.get("/all", getAllSession);
// router.get("/one/:id", getClusterById);
router.post("/create", upload.single("topic_image"), createTopic);
router.put("/update/:id", upload.single("topic_image"), updateTopic);
router.delete("/delete/:id", deleteTopic);

export default router;
