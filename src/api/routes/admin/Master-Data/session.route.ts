import { Router } from "express";
import {
  createSession,
  deleteSession,
  getAllSession,
  updateSession,
} from "../../../controllers/admin/Master-Data/session.controller";
import { upload } from "../../../middlewares/files.middleware";

const router = Router();

router.get("/all", getAllSession);
// router.get("/one/:id", getClusterById);
router.post("/create", upload.single("session_image"), createSession);
router.put("/update/:id", upload.single("session_image"), updateSession);

router.delete("/delete/:id", deleteSession);

export default router;
