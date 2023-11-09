import { Router } from "express"
import {
  createTestExamGroup,
  getTestExamGroup,
  getTestExamGroupById,
} from "../controllers/testExamGroup.controller"
import { authUser } from "../middlewares/auth.middleware"

const router = Router()

router
  .route("/")
  .post(authUser, createTestExamGroup)
  .get(authUser, getTestExamGroup)

router.route("/:id").get(authUser, getTestExamGroupById)

export default router
