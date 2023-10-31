import { Router } from "express"
import {
  createExamQuestion,
  getExamQuestion,
  getExamQuestionById,
} from "../controllers/question.controller"
import { authUser } from "../middlewares/auth.middleware"
import { MediaUpload } from "../utils/multer"

const router = Router()
const uploadQuestionImage = MediaUpload.fields([
  {
    name: "media_file",
    maxCount: 1,
  },
])

router
  .route("/")
  .post(authUser, uploadQuestionImage, createExamQuestion)
  .get(authUser, getExamQuestion)

router.route("/:id").get(authUser, getExamQuestionById)

export default router
