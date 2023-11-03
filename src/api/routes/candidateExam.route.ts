import { Router } from "express"
import {
  createCandidateExam,
  getCandExamByUser,
} from "../controllers/candidateExam.controller"
import { authUser } from "../middlewares/auth.middleware"

const router = Router()

router
  .route("/")
  .post(authUser, createCandidateExam)
  .get(authUser, getCandExamByUser)

export default router
