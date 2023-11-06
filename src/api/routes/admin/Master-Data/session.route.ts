import { Router } from "express";
import {
  createSession,
  deleteSession,
  getAllSession,
  getTopicsBySessionId,
  updateSession,
} from "../../../controllers/admin/Master-Data/session.controller";
import { upload } from "../../../middlewares/files.middleware";
import { isAdmin } from "../../../middlewares/isAdmin.middleware";

const router = Router();

router.get("/all", getAllSession);
router.get("/topics/:id", getTopicsBySessionId);

// router.get("/one/:id", getClusterById);
router.get("/topics:id", getTopicsBySessionId);

router.post("/create", isAdmin, upload.single("sessionFile"), createSession);
router.put("/update/:id", isAdmin, upload.single("sessionFile"), updateSession);

router.delete("/delete/:id", isAdmin, deleteSession);

export default router;
