import { Router } from "express";
import {
  createSession,
  deleteSession,
  getAllSession,
  getTopicsBySessionId,
  updateSession,
} from "../../../controllers/admin/Master-Data/session.controller";
import { upload } from "../../../middlewares/files.middleware";

const router = Router();

router.get("/all", getAllSession);
router.get("/topics/:id", getTopicsBySessionId);

// router.get("/one/:id", getClusterById);
router.get("/topics:id", getTopicsBySessionId);

router.post("/create", upload.single("sessionFile"), createSession);
router.put("/update/:id", upload.single("sessionFile"), updateSession);

router.delete("/delete/:id", deleteSession);

export default router;
