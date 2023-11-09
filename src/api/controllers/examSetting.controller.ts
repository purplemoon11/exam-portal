import { Request, Response, NextFunction } from "express"
import { ExamSetting } from "../entity/examSetting.entity"
import ormConfig from "../../config/ormConfig"
import logger from "../../config/logger"

const examSettingRepo = ormConfig.getRepository(ExamSetting)

interface ExamSettingRequest extends Request {
  user: {
    id: string
  }
}

export const createExamSetting = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { number, exam_fee, exam_frequency, exam_duration } = req.body

    const isExamExists = await examSettingRepo.findOne({ where: { number } })

    if (isExamExists) {
      const examSetting = examSettingRepo.merge(isExamExists, {
        exam_fee,
        exam_frequency,
        exam_duration,
      })
      await examSettingRepo.save(examSetting)

      logger.info("Exam setting updated")
      return res.json({
        data: examSetting,
        message: "Exam setting updated",
      })
    }

    const examSettingData = new ExamSetting()

    examSettingData.number = 1
    examSettingData.exam_fee = exam_fee || "700"
    examSettingData.exam_frequency = exam_frequency || 2
    examSettingData.exam_duration = exam_duration || "15.00"

    const examSetting = await examSettingRepo.save(examSettingData)

    logger.info("Exam setting created")
    return res
      .status(201)
      .json({ data: examSetting, message: "Exam  setting  created" })
  } catch (err) {
    logger.error(err)
    res.status(500).send(err)
  }
}

export const getExamSettings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const examSetting = await examSettingRepo.find()

    res.json({ examSetting })
  } catch (err) {
    logger.error(err)
    res.status(500).send(err)
  }
}

export const getExamSettingById = async (
  req: ExamSettingRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id)
    const examSetting = await examSettingRepo.findOne({ where: { id } })

    if (!examSetting) {
      return res.status(404).json({ message: "Exam setting not found" })
    }

    res.json({ examSetting })
  } catch (err) {
    logger.error(err)
    res.status(500).send(err)
  }
}

export const deleteExamSetting = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id)
    const examSetting = await examSettingRepo.findOne({ where: { id } })

    if (!examSetting) {
      return res.status(404).json({ message: "Exam setting not found" })
    }

    await examSettingRepo.remove(examSetting)

    return res.json({ message: "Exam setting removed" })
  } catch (err) {
    logger.error(err)
    res.status(500).send(err)
  }
}
