import { Request, Response, NextFunction } from "express"
import { ExamQuestion } from "../entity/question.entity"
import ormConfig from "../../config/ormConfig"
import logger from "../../config/logger"

const answerRepo = ormConfig.getRepository(ExamQuestion)

export const submitAnswer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const { answer } = req.body
  } catch (err) {
    logger.error("Fail to submit answer", err)
    res.status(500).send("Internal server error")
  }
}
