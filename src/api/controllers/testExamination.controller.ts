import { Request, Response, NextFunction } from "express"
import {
  testExamCreate,
  testExamGetByUser,
  testExamGetById,
  testExamUpdate,
  testExamDelete,
  testExamGetByName,
} from "../services/testExamination.service"
import ormConfig from "../../config/ormConfig"
import { TestExamination } from "../entity/testExamination.entity"
import logger from "../../config/logger"
import { userCountryGetByUserId } from "../services/userCountry.service"

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
    const { test_status, time_taken } = req.body
    const userId = parseInt(req.user.id)

    const country = await userCountryGetByUserId(userId)

    if (!country) {
      return res.status(400).json({ message: "Please select country" })
    }

    const country_name = country?.country?.country_name

    const isTestExamExists = await testExamGetByName(country_name + "test")

    if (isTestExamExists) {
      const testExam = await testExamUpdate(
        {
          exam_date: new Date(),
          time_taken,
          test_status,
          total_attempts: isTestExamExists.total_attempts + 1,
        },
        isTestExamExists
      )

      return res.json({ data: testExam, message: "Test exam updated" })
    }

    const testExamData = new TestExamination()

    testExamData.cand_id = userId
    testExamData.exam_date = new Date()
    testExamData.test_name = country_name + "test"
    testExamData.time_taken = time_taken
    testExamData.test_status = test_status

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
