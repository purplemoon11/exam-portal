import { Request, Response, NextFunction } from "express"
import { ExamSection } from "../entity/examSection.entity"
import { Cluster } from "../entity/admin/Master-Data/cluster.entity"
import ormConfig from "../../config/ormConfig"
import logger from "../../config/logger"

const examSectionRepo = ormConfig.getRepository(ExamSection)
const clusterRepo = ormConfig.getRepository(Cluster)

export const createExamSection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, cluster_id, noOfQue } = req.body

    const cluster = await clusterRepo.findOne({ where: { id: cluster_id } })

    if (!cluster) {
      return res.status(400).json({ message: "Cluster not found" })
    }

    const examSectionData = new ExamSection()

    examSectionData.name = name
    examSectionData.cluster_id = cluster_id
    examSectionData.noOfQuestions = noOfQue

    const examSection = await examSectionRepo.save(examSectionData)

    logger.info("Exam section created")
    res.status(201).json({ data: examSection, message: "Exam section created" })
  } catch (err) {
    logger.error(err)
    res.status(500).send(err)
  }
}

export const getExamSectionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id)
    const examSection = await examSectionRepo.findOne({ where: { id } })

    if (!examSection) {
      return res.status(400).json({ message: "Exam section not found" })
    }

    res.json({ data: examSection })
  } catch (err) {
    logger.error(err)
    res.status(500).send(err)
  }
}

export const getExamSections = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const examSection = await examSectionRepo.find()

    res.json({ data: examSection })
  } catch (err) {
    logger.error(err)
    res.status(500).send(err)
  }
}

export const updateExamSection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id)
    const { name, cluster_id, noOfQue } = req.body

    let examSection = await examSectionRepo.findOne({ where: { id } })

    if (!examSection) {
      return res.status(400).json({ message: "Exam section not found" })
    }

    const cluster = await clusterRepo.findOne({ where: { id: cluster_id } })

    if (!cluster) {
      return res.status(400).json({ message: "Cluster not found" })
    }

    const examSectionData = { name, cluster_id, noOfQue }

    examSection = examSectionRepo.merge(examSection, examSectionData)

    logger.info("Exam section updated")
    res.json({ data: examSection, message: "Exam section updated" })
  } catch (err) {
    logger.error(err)
    res.status(500).send(err)
  }
}

export const deleteExamSection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id)
    const examSection = await examSectionRepo.findOne({ where: { id } })

    if (!examSection) {
      return res.status(400).json({ message: "Exam section not found" })
    }

    await examSectionRepo.remove(examSection)

    res.json({ message: "Exam section removed" })
  } catch (err) {
    logger.error(err)
    res.status(500).send(err)
  }
}
