import { Router } from "express"
import {
  createCandidateExam,
  getCandExamById,
  getCandExamByTest,
  getOnlyCandExam,
} from "../controllers/candidateExam.controller"
import { authUser } from "../middlewares/auth.middleware"

const router = Router()

router.route("/").post(authUser, createCandidateExam)

router.route("/:testId").get(authUser, getCandExamByTest)

router.route("/get/:id").get(authUser, getCandExamById)

router.route("/get/test/:testId").get(authUser, getOnlyCandExam)

export default router
