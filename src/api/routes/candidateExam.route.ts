import { Router } from "express"
import {
  createCandidateExam,
  getCandExamByTest,
} from "../controllers/candidateExam.controller"
import { authUser } from "../middlewares/auth.middleware"

const router = Router()

router.route("/").post(authUser, createCandidateExam)

router.route("/:testId").get(authUser, getCandExamByTest)

export default router
