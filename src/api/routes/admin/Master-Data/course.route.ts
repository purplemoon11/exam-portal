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

const router = Router();

router.get("/", getAllCourses);
router.get("/sessions/:id", getSessionsByCourseId);
router.post("/create", upload.single("courseFile"), createCourse);
router.put("/update/:id", upload.single("courseFile"), updateCourse);
router.get("/getById/:id", getCourseById);
router.delete("/delete/:id", deleteCourse);

export default router;
