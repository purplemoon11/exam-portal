import { Router } from "express"
import {
  createTestExam,
  getTestExamById,
  getTestExamByUser,
  //   updateTestExam,
  updateTestStatus,
  deleteTestExam,
} from "../controllers/testExamination.controller"
import { authUser } from "../middlewares/auth.middleware"

const router = Router()

router
  .route("/")
  .post(authUser, createTestExam)
  .get(authUser, getTestExamByUser)
router
  .route("/:id")
  .get(authUser, getTestExamById)
  //   .patch(authUser, updateTestExam)
  .delete(authUser, deleteTestExam)
router.route("/status/:id").patch(authUser, updateTestStatus)

export default router
