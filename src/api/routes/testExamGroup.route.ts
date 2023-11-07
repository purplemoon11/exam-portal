import { Router } from "express"
import {
  createTestExamGroup,
  getTestExamGroup,
} from "../controllers/testExamGroup.controller"
import { authUser } from "../middlewares/auth.middleware"

const router = Router()

router
  .route("/")
  .post(authUser, createTestExamGroup)
  .get(authUser, getTestExamGroup)

export default router
