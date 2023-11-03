import { Request, Response, NextFunction } from "express"
import ormConfig from "../../config/ormConfig"
import { CandidateExamAttempt } from "../entity/candidateExam.entity"
import { ExamAnswer } from "../entity/answer.entity"
import logger from "../../config/logger"

const candidateExamRepo = ormConfig.getRepository(CandidateExamAttempt)
const examAnswerRepo = ormConfig.getRepository(ExamAnswer)

interface CandidateExamRequest extends Request {
  user: {
    id: string
  }
}

export const createCandidateExam = async (
  req: CandidateExamRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { data } = req.body

    const userId = parseInt(req.user.id)
    const results = []

    for (const item of data) {
      const { question_id, answer_id, test_id } = item

      const answerData = await examAnswerRepo.findOne({
        where: { question_id, isCorrect: true },
      })

      if (!answerData) {
        return res.status(400).json({ message: "No correct answer found" })
      }

      const rightAnswerId = answerData.id

      const candExamData = new CandidateExamAttempt()

      candExamData.questionId = question_id
      candExamData.answerId = answer_id
      candExamData.testId = test_id
      candExamData.isCorrect = rightAnswerId === answer_id ? true : false
      candExamData.candId = userId

      const candExam = await candidateExamRepo.save(candExamData)
      results.push(candExam)
    }
    return res
      .status(201)
      .json({ data: results, message: "Candidate exam created succesfully" })
  } catch (err) {
    logger.error(err)
    res.status(500).send(err)
  }
}

export const getCandExamByUser = async (
  req: CandidateExamRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = parseInt(req.user.id)
    const candExams = await candidateExamRepo
      .createQueryBuilder("candExam")
      .leftJoinAndSelect("candExam.answer", "answer")
      .innerJoin("candExam.candidate", "candidate")
      .innerJoinAndSelect("candExam.question", "question")
      .leftJoinAndSelect("question.answers", "answers")
      .innerJoinAndSelect("candExam.test", "test")
      .where("candExam.candId = :userId", { userId })
      .addSelect("candidate.fullname")
      .getMany()

    res.json({ data: candExams })
  } catch (err) {
    logger.error(err)
    res.status(500).send(err)
  }
}
