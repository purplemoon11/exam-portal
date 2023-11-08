import { Request, Response, NextFunction } from "express"
import { TestExamGroup } from "../entity/testExamGroup.entity"
import ormConfig from "../../config/ormConfig"
import logger from "../../config/logger"
import { userCountryGetByUserId } from "../services/userCountry.service"
import {
  testGroupGetByNameUser,
  testGroupUpdate,
} from "../services/testExamGroup.service"

const testExamGroupRepo = ormConfig.getRepository(TestExamGroup)

interface TestExamGroupRequest extends Request {
  user: {
    id: string
  }
}

export const createTestExamGroup = async (
  req: TestExamGroupRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = parseInt(req.user.id)

    const country = await userCountryGetByUserId(userId)

    if (!country) {
      return res.status(400).json({ message: "Please select country" })
    }

    const country_name = country?.country?.country_name

    const isTestGroupExists = await testGroupGetByNameUser(
      userId,
      country_name + " test"
    )

    if (isTestGroupExists) {
      const testGroup = await testGroupUpdate(
        {
          exam_group_date: new Date(),
          total_attempts: isTestGroupExists.total_attempts + 1,
        },
        isTestGroupExists
      )
      return res.json({ data: testGroup })
    }

    let testGroupData = new TestExamGroup()

    testGroupData.cand_id = userId
    testGroupData.test_name = country_name + " test"
    testGroupData.exam_group_date = new Date()
    testGroupData.total_attempts = 1

    let testGroup = await testExamGroupRepo.save(testGroupData)

    logger.info("Test group created")
    return res
      .status(201)
      .json({ data: testGroup, message: "Test group created" })
  } catch (err) {
    logger.error(err.message)
    res.status(500).send(err)
  }
}

export const getTestExamGroup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const testExamGroup = await testExamGroupRepo
      .createQueryBuilder("testExamGroup")
      .leftJoinAndSelect("testExamGroup.testExam", "testExam")
      .leftJoinAndSelect("testExam.examCand", "examCand")
      .leftJoinAndSelect("examCand.question", "question")
      .leftJoinAndSelect("question.answers", "answers")
      .orderBy("testExam.test_date", "DESC")
      .take(1)
      .getMany()

    res.json({ data: testExamGroup })
  } catch (err) {
    logger.error(err)
    res.status(500).send(err)
  }
}
