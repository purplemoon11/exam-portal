import { Router } from "express"
import {
  createExamSetting,
  getExamSettings,
  getExamSettingById,
  deleteExamSetting,
} from "../controllers/examSetting.controller"
import { isAdmin } from "../middlewares/isAdmin.middleware"

const router = Router()

router.route("/").post(isAdmin, createExamSetting).get(getExamSettings)
router.route("/:id").get(getExamSettingById).delete(isAdmin, deleteExamSetting)

export default router
