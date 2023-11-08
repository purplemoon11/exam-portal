import { Router } from "express"
import {
  createExamSection,
  getExamSectionById,
  getExamSections,
  updateExamSection,
  deleteExamSection,
} from "../controllers/examSection.controller"
import { authUser } from "../middlewares/auth.middleware"

const router = Router()

router
  .route("/")
  .get(authUser, getExamSections)
  .post(authUser, createExamSection)

router
  .route("/:id")
  .get(authUser, getExamSectionById)
  .patch(authUser, updateExamSection)
  .delete(authUser, deleteExamSection)

export default router