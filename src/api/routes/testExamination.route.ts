import { Router } from "express";
import {
  createTestExam,
  getTestExamById,
  getTestExamByUser,
  updateTestStatus,
  deleteTestExam,
  getTestExamDetails,
} from "../controllers/testExamination.controller";
import { authUser } from "../middlewares/auth.middleware";

const router = Router();

router.get("/details", authUser, getTestExamDetails);
router
  .route("/")
  .post(authUser, createTestExam)
  .get(authUser, getTestExamByUser);
router
  .route("/:id")
  .get(authUser, getTestExamById)
  .delete(authUser, deleteTestExam);
router.route("/status/:id").patch(authUser, updateTestStatus);

export default router;
