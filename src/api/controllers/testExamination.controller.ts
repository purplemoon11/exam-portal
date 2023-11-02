import { Request, Response, NextFunction } from "express"
import {
  testExamCreate,
  testExamGetByUser,
  testExamGetById,
  testExamUpdate,
  testExamDelete,
} from "../services/testExamination.service"
import ormConfig from "../../config/ormConfig"
import { TestExamination } from "../entity/testExamination.entity"
import logger from "../../config/logger"

const testExamRepo = ormConfig.getRepository(TestExamination)

interface TestExamRequest extends Request {
  user: {
    id: string
  }
}

export const createTestExam = async (
  req: TestExamRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { test_name, exam_date, test_status, total_attempts } = req.body
    const userId = parseInt(req.user.id)

    const testExamData = new TestExamination()

    testExamData.cand_id = userId
    testExamData.exam_date = new Date()
    testExamData.test_name = test_name
    testExamData.exam_date = exam_date
    testExamData.test_status = test_status
    testExamData.total_attempts = total_attempts

    const testExam = await testExamCreate(testExamData)

    logger.info("Test exam created")
    res.status(201).json({ data: testExam, message: "Test exam created" })
  } catch (err) {
    logger.error(err)
    res.status(500).send(err)
  }
}

export const getTestExamByUser = async (
  req: TestExamRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = parseInt(req.user.id)
    const testExam = await testExamGetByUser(userId)

    res.json({ data: testExam })
  } catch (err) {
    logger.error(err)
    res.status(500).send(err)
  }
}
