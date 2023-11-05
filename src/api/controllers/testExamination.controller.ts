import { Request, Response, NextFunction } from "express"
import {
  testExamCreate,
  testExamGetByUser,
  testExamGetById,
  testExamUpdate,
  testExamDelete,
  testExamGetByNameUser,
} from "../services/testExamination.service"
import { TestExamination } from "../entity/testExamination.entity"
import logger from "../../config/logger"
import { userCountryGetByUserId } from "../services/userCountry.service"
import ormConfig from "../../config/ormConfig"

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
    const { time_taken } = req.body
    const userId = parseInt(req.user.id)

    const country = await userCountryGetByUserId(userId)

    if (!country) {
      return res.status(400).json({ message: "Please select country" })
    }

    const country_name = country?.country?.country_name

    const isTestExamExists = await testExamGetByNameUser(
      userId,
      country_name + " test"
    )

    if (isTestExamExists) {
      let testTotalAttempts: number
      if (isTestExamExists.total_attempts >= 3) {
        testTotalAttempts = 1
      } else {
        testTotalAttempts = isTestExamExists.total_attempts + 1
      }
      const examDate = new Date(isTestExamExists.test_date)
        .toISOString()
        .split("T")[0]

      const resultTest = await testExamRepo
        .createQueryBuilder("testExam")
        .leftJoinAndSelect("testExam.examCand", "examCand")
        .where("examCand.examDate = :examDate", { examDate })
        .getMany()

      let examAttempts
      examAttempts = resultTest[0].examCand

      const requiredCorrectAnswers: number = Math.ceil(examAttempts.length / 2)

      const correctAnswers = examAttempts.filter(exam => exam.isCorrect).length

      const examStatus =
        correctAnswers >= requiredCorrectAnswers ? "Pass" : "Fail"

      const testExam = await testExamUpdate(
        {
          time_taken,
          test_status: examStatus,
          total_attempts: testTotalAttempts,
        },
        isTestExamExists
      )

      return res.json({ data: testExam, message: "Test exam updated" })
    }

    const testExamData = new TestExamination()

    testExamData.cand_id = userId
    testExamData.test_date = new Date()
    testExamData.test_name = country_name + " test"
    testExamData.time_taken = time_taken
    testExamData.test_status = "Ongoing"

    testExamData.total_attempts = 1

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

export const getTestExamById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id)
    const testExam = await testExamGetById(id)

    res.json({ data: testExam })
  } catch (err) {
    logger.error(err)
    res.status(500).send(err)
  }
}

// export const updateTestExam = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { test_name, test_status } = req.body
//     const id = parseInt(req.params.id)

//     const testExam = await testExamGetById(id)

//     if (!testExam) {
//       return res.status(404).json({ message: "Test exam data not found" })
//     }

//     const updatedData = await testExamUpdate(
//       {
//         test_name,
//         test_status,
//       },
//       testExam
//     )

//     logger.info("Test exam updated")
//     return res.json({ data: updatedData, message: "Test exam updated" })
//   } catch (err) {
//     logger.error(err)
//     res.status(500).send(err)
//   }
// }

export const deleteTestExam = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id)
    const testExam = await testExamGetById(id)

    if (!testExam) {
      return res.status(404).json({ message: "Test exam not found" })
    }

    await testExamDelete(id)

    return res.json({ message: "Test exam deleted" })
  } catch (err) {
    logger.error(err)
    res.status(500).send(err)
  }
}
