import { Router } from "express"
import {
  createExamQuestion,
  getExamQuestion,
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
  .get(getExamQuestion)

router.route("/:id").get(getExamQuestionById).delete(isAdmin, deleteQuestion)

export default router
