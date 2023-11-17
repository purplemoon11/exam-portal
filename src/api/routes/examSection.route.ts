import { Router } from "express"
import {
  createExamSection,
  getExamSectionById,
  getExamSections,
  updateExamSection,
  deleteExamSection,
  getExamSectionByCountryId,
} from "../controllers/examSection.controller"
import { authUser } from "../middlewares/auth.middleware"
import { isAdmin } from "../middlewares/isAdmin.middleware"

const router = Router()

router.route("/").get(getExamSections).post(isAdmin, createExamSection)

router
  .route("/:id")
  .get(getExamSectionById)
  .patch(isAdmin, updateExamSection)
  .delete(isAdmin, deleteExamSection)

router.route("/country/:country_id").get(getExamSectionByCountryId)

export default router
