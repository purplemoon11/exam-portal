import { Request, Response, NextFunction } from "express"
import { ExamSection } from "../entity/examSection.entity"
import { Cluster } from "../entity/admin/Master-Data/cluster.entity"
import { Country } from "../entity/country.entity"
import ormConfig from "../../config/ormConfig"
import logger from "../../config/logger"

const examSectionRepo = ormConfig.getRepository(ExamSection)
const clusterRepo = ormConfig.getRepository(Cluster)
const countryRepo = ormConfig.getRepository(Country)

export const createExamSection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, cluster_id, country_id, noOfQue } = req.body

    const cluster = await clusterRepo.findOne({ where: { id: cluster_id } })

    if (!cluster) {
      return res.status(400).json({ message: "Cluster not found" })
    }

    const country = await countryRepo.findOne({ where: { id: country_id } })

    if (!country) {
      return res.status(400).json({ message: "Country not found" })
    }

    const examSectionData = new ExamSection()

    examSectionData.name = name
    examSectionData.cluster_id = cluster_id
    examSectionData.country_id = country_id
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

export const getExamSectionByCountryId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const country_id = parseInt(req.params.country_id)
    const examSection = await examSectionRepo.find({ where: { country_id } })

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
    const { name, cluster_id, country_id, noOfQue } = req.body

    let examSection = await examSectionRepo.findOne({ where: { id } })

    if (!examSection) {
      return res.status(400).json({ message: "Exam section not found" })
    }

    const cluster = await clusterRepo.findOne({ where: { id: cluster_id } })

    if (!cluster) {
      return res.status(400).json({ message: "Cluster not found" })
    }

    const country = await countryRepo.findOne({ where: { id: country_id } })

    if (!country) {
      return res.status(400).json({ message: "Country not found" })
    }

    const examSectionData = { name, cluster_id, country_id, noOfQue }

    examSection = examSectionRepo.merge(examSection, examSectionData)

    await examSectionRepo.save(examSection)
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
