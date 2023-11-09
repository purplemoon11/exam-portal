import { Router } from "express"
import {
  createExamSetting,
  getExamSettings,
  getExamSettingById,
  deleteExamSetting,
} from "../controllers/examSetting.controller"
import { authUser } from "../middlewares/auth.middleware"

const router = Router()

router
  .route("/")
  .post(authUser, createExamSetting)
  .get(authUser, getExamSettings)
router
  .route("/:id")
  .get(authUser, getExamSettingById)
  .delete(authUser, deleteExamSetting)

export default router
