import { Router } from "express"
import {
  createCandidateExam,
  getCandExamById,
  getCandExamByTest,
  getOnlyCandExam,
} from "../controllers/candidateExam.controller"

const router = Router()

router.route("/").post(createCandidateExam)

router.route("/:testId").get(getCandExamByTest)

router.route("/get/:id").get(getCandExamById)

router.route("/get/test/:testId").get(getOnlyCandExam)

export default router
