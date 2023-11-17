import { Router } from "express"
import {
  createExamQuestion,
  getExamQuestion,
  getExamQuestionForUser,
  updateQuestion,
  getExamQuestionById,
  deleteQuestion,
} from "../controllers/question.controller"
import { FileUpload } from "../utils/multer"
import { isAdmin } from "../middlewares/isAdmin.middleware"

const router = Router()
const uploadQuestionImage = FileUpload.fields([
  {
    name: "media_file",
    maxCount: 1,
  },
])

router
  .route("/")
  .post(isAdmin, uploadQuestionImage, createExamQuestion)
  .get(isAdmin, getExamQuestion)

router
  .route("/:id")
  .get(getExamQuestionById)
  .patch(isAdmin, updateQuestion)
  .delete(isAdmin, deleteQuestion)

router.route("/cand/user").get(getExamQuestionForUser)

export default router
