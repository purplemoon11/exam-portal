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

      const rightAnswerId = answerData.id

      const candExamData = new CandidateExamAttempt()

      candExamData.questionId = question_id
      candExamData.answerId = answer_id
      candExamData.testId = test_id
      candExamData.isCorrect = rightAnswerId === answer_id ? true : false
      candExamData.examDate = new Date()
      candExamData.candId = userId

      const candExam = await candidateExamRepo.save(candExamData)
      results.push(candExam)
    }
    return res
      .status(201)
      .json({ data: results, message: "Candidate exam created succesfully" })
  } catch (err) {
    logger.error(err)
    return res.status(500).send(err)
  }
}

export const getCandExamByTest = async (
  req: CandidateExamRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const testId = parseInt(req.params.testId)
    const candExams = await candidateExamRepo
      .createQueryBuilder("candExam")
      .leftJoinAndSelect("candExam.answer", "answer")
      .innerJoin("candExam.candidate", "candidate")
      .innerJoinAndSelect("candExam.question", "question")
      .leftJoinAndSelect("question.answers", "answers")
      .innerJoinAndSelect("candExam.test", "test")
      .where("candExam.testId = :testId", { testId })
      .addSelect("candidate.fullname")
      .getMany()

    res.json({ data: candExams })
  } catch (err) {
    logger.error(err)
    res.status(500).send(err)
  }
}

export const getCandExamById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id)
    const candExams = await candidateExamRepo
      .createQueryBuilder("candExam")
      .leftJoinAndSelect("candExam.answer", "answer")
      .innerJoin("candExam.candidate", "candidate")
      .innerJoinAndSelect("candExam.question", "question")
      .leftJoinAndSelect("question.answers", "answers")
      .innerJoinAndSelect("candExam.test", "test")
      .where("candExam.id = :id", { id })
      .addSelect("candidate.fullname")
      .getMany()

    res.json({ data: candExams })
  } catch (err) {
    logger.error(err)
    res.status(500).send(err)
  }
}
