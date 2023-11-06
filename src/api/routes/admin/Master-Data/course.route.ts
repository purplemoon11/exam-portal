import { Router } from "express";
import {
  createCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
  getSessionsByCourseId,
  updateCourse,
} from "../../../controllers/admin/Master-Data/course.controller";
import { upload } from "../../../middlewares/files.middleware";
import { isAdmin } from "../../../middlewares/isAdmin.middleware";

const router = Router();

router.get("/", getAllCourses);
router.get("/sessions/:id", getSessionsByCourseId);
router.post("/create",isAdmin, upload.single("courseFile"),createCourse);
router.put("/update/:id",isAdmin, upload.single("courseFile"),updateCourse);
router.get("/getById/:id", getCourseById);
router.delete("/delete/:id",isAdmin, deleteCourse);

export default router;
