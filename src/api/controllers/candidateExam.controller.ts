import { Request, Response, NextFunction } from "express"
import ormConfig from "../../config/ormConfig"
import { CandidateExamAttempt } from "../entity/candidateExam.entity"
import { ExamAnswer } from "../entity/answer.entity"
import logger from "../../config/logger"
import { candExamUpdate } from "../services/candidateExam.service"

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
    const { questionId, answerId, testId, time_taken } = req.body
    const userId = parseInt(req.user.id)

    const answerData = await examAnswerRepo.findOne({
      where: { question_id: questionId, isCorrect: true },
    })

    const rightAnswerId = answerData.id

    const isExistsExam = await candidateExamRepo.findOne({
      where: { candId: userId, testId, questionId },
    })

    if (isExistsExam) {
      const candExam = await candExamUpdate(
        {
          answerId: answerId || -1,
          isCorrect: rightAnswerId === answerId ? true : false,
          time_taken,
          is_attempted: answerId ? true : false,
        },
        isExistsExam
      )

      return res.json({ data: candExam, message: "Candidate exam updated" })
    }

    const candExamData = new CandidateExamAttempt()

    candExamData.questionId = questionId
    candExamData.answerId = answerId || -1
    candExamData.is_attempted = answerId ? true : false
    candExamData.testId = testId
    candExamData.isCorrect = rightAnswerId === answerId ? true : false
    candExamData.examDate = new Date()
    candExamData.time_taken = time_taken
    candExamData.candId = userId

    const candExam = await candidateExamRepo.save(candExamData)

    return res.status(201).json({
      data: candExam,
      message: "Candidate exam created succesfully",
    })
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

export const getOnlyCandExam = async (
  req: CandidateExamRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const testId = parseInt(req.params.testId)
    const userId = parseInt(req.user.id)

    const getCandExam = await candidateExamRepo.find({
      where: { candId: userId, testId: testId },
      order: { examDate: "DESC" },
    })

    res.json({ data: getCandExam })
  } catch (err) {
    logger.error(err)
    res.status(500).send(err)
  }
}
