import { Router } from "express";
import {
  createCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
} from "../../../controllers/admin/Master-Data/course.controller";
import { MediaUpload } from "../../../utils/multer";
import { upload } from "../../../middlewares/files.middleware";

const router = Router();

router.get("/", getAllCourses);
router.post("/create", upload.single("course_image"), createCourse);
router.put("/update/:id", upload.single("course_image"), updateCourse);
router.get("/getById/:id", getCourseById);
router.delete("/delete/:id", deleteCourse);

export default router;
