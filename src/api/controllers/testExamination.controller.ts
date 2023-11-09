import { Request, Response, NextFunction } from "express"
import {
  testExamCreate,
  testExamGetByUser,
  testExamGetById,
  testExamUpdate,
  testExamDelete,
} from "../services/testExamination.service"
import { TestExamination } from "../entity/testExamination.entity"
import { Transaction } from "../entity/transaction.entity"
import logger from "../../config/logger"
import { userCountryGetByUserId } from "../services/userCountry.service"
import ormConfig from "../../config/ormConfig"
import { TestExamGroup } from "../entity/testExamGroup.entity"

const testExamRepo = ormConfig.getRepository(TestExamination)
const testExamGroupRepo = ormConfig.getRepository(TestExamGroup)
const transactionRepo = ormConfig.getRepository(Transaction)

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
    const { test_group_id } = req.body
    const userId = parseInt(req.user.id)

    const testGroup = await testExamGroupRepo.findOne({
      where: { id: test_group_id },
    })

    if (!testGroup) {
      return res.status(400).json({ message: "No test group found" })
    }

    const transactionData = await transactionRepo.findOne({
      where: { cand_id: userId },
      order: { created_date: "DESC" },
    })

    // if (isTestExamExists) {
    //   let testTotalAttempts: number
    //   if (isTestExamExists.total_attempts >= 3) {
    //     testTotalAttempts = 1
    //   } else {
    //     testTotalAttempts = isTestExamExists.total_attempts + 1
    //   }
    //   const examDate = new Date(isTestExamExists.test_date)
    //     .toISOString()
    //     .split("T")[0]

    //   const resultTest = await testExamRepo
    //     .createQueryBuilder("testExam")
    //     .leftJoinAndSelect("testExam.examCand", "examCand")
    //     .where("examCand.examDate = :examDate", { examDate })
    //     .getMany()

    //   let examAttempts
    //   examAttempts = resultTest[0].examCand

    //   const requiredCorrectAnswers: number = Math.ceil(examAttempts.length / 2)

    //   const correctAnswers = examAttempts.filter(exam => exam.isCorrect).length

    //   const examStatus =
    //     correctAnswers >= requiredCorrectAnswers ? "Pass" : "Fail"

    //   const testExam = await testExamUpdate(
    //     {
    //       time_taken,
    //       test_status: examStatus,
    //       total_attempts: testTotalAttempts,
    //     },
    //     isTestExamExists
    //   )

    //   return res.json({ data: testExam, message: "Test exam updated" })
    // }

    // const testExamAttemptData = await testExamRepo.find({
    //   where: { cand_id: userId, test_group_id },
    // })

    const testExamData = new TestExamination()

    testExamData.cand_id = userId
    testExamData.test_date = new Date()
    testExamData.test_group_id = test_group_id
    testExamData.time_taken = ""
    testExamData.payment_id = transactionData.id
    testExamData.test_status = "Ongoing"
    // testExamData.total_attempts =
    //   testExamAttemptData.length > 0 ? testExamAttemptData.length + 1 : 1

    const testExam = await testExamCreate(testExamData)

    logger.info("Test exam created")
    return res
      .status(201)
      .json({ data: testExam, message: "Test exam created" })
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

export const updateTestStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id)
    const { time_taken } = req.body

    const testExamData = await testExamRepo.findOne({ where: { id } })

    if (!testExamData) {
      return res.status(400).json({ message: "Test exam data not found" })
    }

    const resultTest = await testExamRepo
      .createQueryBuilder("testExam")
      .leftJoinAndSelect("testExam.examCand", "examCand")
      .where("testExam.id = :id", { id })
      .getOne()

    let examAttempts
    examAttempts = resultTest.examCand

    const requiredCorrectAnswers: number = Math.ceil(examAttempts.length / 2)

    const correctAnswers = examAttempts.filter(exam => exam.isCorrect).length

    const examStatus =
      correctAnswers >= requiredCorrectAnswers ? "Pass" : "Fail"

    const testExam = await testExamUpdate(
      {
        test_status: examStatus,
        time_taken,
      },
      testExamData
    )

    return res.json({ data: testExam, message: "Test exam updated" })
  } catch (err) {
    logger.error(err.message)
    res.status(500).send(err)
  }
}

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
