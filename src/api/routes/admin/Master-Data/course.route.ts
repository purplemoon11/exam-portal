import { Router } from "express";
import {
  createCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
  getCoursesByCluster,
  getPopularCourse,
  getSessionsByCourseId,
  updateCourse,
} from "../../../controllers/admin/Master-Data/course.controller";
import { upload } from "../../../middlewares/files.middleware";
import { isAdmin } from "../../../middlewares/isAdmin.middleware";

const router = Router();

router.get("/", getAllCourses);

router.get("/sessions", getSessionsByCourseId);

router.post("/create", isAdmin, upload.single("courseFile"), createCourse);
router.put("/update/:id", isAdmin, upload.single("courseFile"), updateCourse);
router.get("/getById/:id", getCourseById);
router.get("/popular", getPopularCourse);
router.get("/cluster-courses", getCoursesByCluster);
router.delete("/delete/:id", isAdmin, deleteCourse);

export default router;
