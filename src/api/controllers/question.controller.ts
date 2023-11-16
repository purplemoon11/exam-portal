import { Request, Response, NextFunction } from "express"
import {
  examQuestionCreate,
  examQuestionGet,
  examQuestionGetById,
  examQuestionUpdate,
  examQuestionDelete,
} from "../services/question.service"
import { Cluster } from "../entity/admin/Master-Data/cluster.entity"
import { ExamQuestion } from "../entity/question.entity"
import ormConfig from "../../config/ormConfig"
import logger from "../../config/logger"
import { ExamAnswer } from "../entity/answer.entity"
import { Country } from "../entity/country.entity"
import {
  examAnswerCreate,
  examAnswerDeleteByQueId,
  examAnswerGetById,
  examAnswerGetByQueId,
} from "../services/answer.service"
import { ExamQuestionCountry } from "../entity/questionCountry.entity"
import {
  examQuestionCountryCreate,
  examQuestionCountryDeleteByQueId,
  examQuestionCountryGetById,
  examQuestionCountryGetByQueId,
} from "../services/questionCountry.service"
import { userCountryGetByUserId } from "../services/userCountry.service"

const examQuestionRepo = ormConfig.getRepository(ExamQuestion)
const clusterRepo = ormConfig.getRepository(Cluster)
const countryRepo = ormConfig.getRepository(Country)

interface QuestionRequest extends Request {
  user: {
    id: string
  }
}

export const createExamQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { question_text, answers, countries, cluster_id } = req.body

    let isCorrectAnsExists = false
    for (let answer of answers) {
      if (answer.isCorrect) {
        isCorrectAnsExists = true
        break
      }
    }

    if (!isCorrectAnsExists) {
      return res
        .status(400)
        .json({ message: "Please choose one correct answer" })
    }

    const isExistsCluster = await clusterRepo.findOne({
      where: { id: cluster_id },
    })

    if (!isExistsCluster) {
      return res.status(404).json({ message: "Cluster not found" })
    }

    const questionData = new ExamQuestion()

    let fileType = "Others"
    if (req.files && req.files["media_file"]) {
      const media = req.files["media_file"][0].filename
      const mime_type = req.files["media_file"][0].mimetype

      let media_file = `${req.secure ? "https" : "http"}://${req.get(
        "host"
      )}/medias/${media}`

      if (mime_type.startsWith("image")) {
        fileType = "Image"
      } else if (mime_type.startsWith("video")) {
        fileType = "Video"
      } else if (mime_type.startsWith("application")) {
        fileType = "Application"
      } else {
        fileType = "Others"
      }

      questionData.media_file = media_file
    } else {
      questionData.media_file = ""
    }

    questionData.question_text = question_text
    questionData.cluster_id = isExistsCluster.id
    questionData.fileType = fileType

    const question = await examQuestionCreate(questionData)

    for (let answer of answers) {
      const { answer_text, isCorrect } = answer
      const answerData = new ExamAnswer()
      answerData.answer_text = answer_text
      answerData.isCorrect = isCorrect
      answerData.question_id = question.id

      await examAnswerCreate(answerData)
    }

    if (countries && countries.length > 0) {
      for (let country of countries) {
        const { country_name } = country
        const countryData = new ExamQuestionCountry()

        countryData.country_name = country_name
        countryData.question_id = question.id

        await examQuestionCountryCreate(countryData)
      }
    }

    logger.info("Question created successfully")

    res.status(201).json({
      question,
      message: "Question created successfully",
      file: fileType,
    })
  } catch (err) {
    logger.error(err)
    res.status(500).send(err)
  }
}

export const getExamQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const questions = await examQuestionGet()

    res.json({ data: questions })
  } catch (err) {
    logger.error(err)
    res.status(500).send(err)
  }
}

export const getExamQuestionForUser = async (
  req: QuestionRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = parseInt(req.user.id)

    const country = await userCountryGetByUserId(userId)

    if (!country) {
      return res.status(400).json({ message: "Please select country" })
    }

    const country_id = country?.country?.id

    const countries = await countryRepo
      .createQueryBuilder("country")
      .leftJoinAndSelect("country.examSection", "examSection")
      .leftJoinAndSelect("examSection.clusterId", "cluster")
      .leftJoinAndSelect("cluster.examQuestions", "examQuestion")
      .leftJoinAndSelect("examQuestion.answers", "answers")
      .where("country.id = :id", { id: country_id })
      .andWhere("answers.answer_text IS NOT NULL")
      .andWhere("answers IS NOT NULL")
      .select([
        "country",
        "examSection",
        "cluster",
        "examQuestion",
        "answers.answer_text",
      ])
      .getOne()

    interface Answer {
      id: number
      question_id: number
      answer_text: string
      isCorrect: boolean
    }

    interface ExamQuestion {
      id: number
      cluster_id: number
      question_text: string
      media_file: string
      fileType: string
      answers: Answer[]
    }

    interface Cluster {
      id: number
      cluster_name: string
      cluster_code: string
      description: string
      examQuestions: ExamQuestion[]
    }

    interface ExamSection {
      id: number
      name: string
      cluster_id: number
      noOfQuestions: number
      country_id: number
      clusterId: Cluster
    }

    interface CountryData {
      id: number
      country_name: string
      examSection: ExamSection[]
    }

    const result: any[] = []

    countries.examSection.forEach(section => {
      const numberOfQuestions = section.noOfQuestions

      const selectedQuestions: any[] = []

      const examQuestions = section.clusterId["examQuestions"]

      examQuestions.forEach((examQue: any) => {
        const availableQuestions = examQuestions.length

        if (availableQuestions <= numberOfQuestions) {
          selectedQuestions.push(examQue)
        } else {
          while (selectedQuestions.length < numberOfQuestions) {
            const randomIndex = Math.floor(Math.random() * availableQuestions)

            const selectedQuestion = examQuestions[randomIndex]

            if (!selectedQuestions.includes(selectedQuestion)) {
              selectedQuestions.push(selectedQuestion)
            }
          }
        }
      })

      result.push(...selectedQuestions)
    })

    res.json({ data: result })
  } catch (err) {
    logger.error(err)
    res.status(500).send(err)
  }
}

export const getExamQuestionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id)
    const examQuestion = await examQuestionGetById(id)

    if (!examQuestion) {
      return res.status(404).json({ message: "Exam question not found" })
    }

    res.json({ examQuestion })
  } catch (err) {
    logger.error(err)
    res.status(500).send(err)
  }
}

export const updateQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { question_text, answers, countries, cluster_id } = req.body
    const id = parseInt(req.params.id)

    const question = await examQuestionRepo.findOne({
      where: { id },
    })

    if (!question) {
      return res.status(404).json({ message: "Question not found" })
    }

    const isExistsQuestion = await examQuestionRepo.findOne({
      where: { question_text },
    })

    if (isExistsQuestion) {
      return res.status(400).json({ message: "Question already exists" })
    }

    const isExistsCluster = await clusterRepo.findOne({
      where: { id: cluster_id },
    })

    if (!isExistsCluster) {
      return res.status(404).json({ message: "Cluster not found" })
    }

    let questionData: Object
    if (req.files && req.files["media_file"]) {
      let media_file = req.files["media_file"][0].filename
      media_file = `${req.secure ? "https" : "http"}://${req.get(
        "host"
      )}/images/${media_file}`

      questionData = {
        question_text,
        cluster_id,
        media_file,
      }
    } else {
      questionData = {
        question_text,
        cluster_id,
      }
    }

    const questionUpdate = await examQuestionUpdate(questionData, question)

    for (const answer of answers) {
      const answerId = answer.id || ""
      const existingAnswer = await examAnswerGetById(answerId)

      if (existingAnswer) {
        existingAnswer.answer_text = answer.answer_text
        existingAnswer.isCorrect = answer.isCorrect

        await examAnswerCreate(existingAnswer)
      } else {
        const newAnswer = new ExamAnswer()
        newAnswer.answer_text = answer.answer_text
        newAnswer.isCorrect = answer.isCorrect
        newAnswer.question_id = questionUpdate.id

        await examAnswerCreate(newAnswer)
      }
    }

    for (const country of countries) {
      const countryId = country.id || ""
      const existingCountry = await examQuestionCountryGetById(countryId)

      if (existingCountry) {
        existingCountry.country_name = country.country_name

        await examQuestionCountryCreate(existingCountry)
      } else {
        const newCountry = new ExamQuestionCountry()
        newCountry.country_name = country.country_name
        newCountry.question_id = question.id

        await examQuestionCountryCreate(newCountry)
      }
    }
  } catch (err) {
    logger.error(err)
    res.status(500).send(err)
  }
}

export const deleteQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id)
    const examQuestion = await examQuestionRepo.findOne({ where: { id } })

    if (!examQuestion) {
      return res.status(404).json({ message: "Exam question not found" })
    }

    const examAnswer = await examAnswerGetByQueId(id)
    const examQueCountry = await examQuestionCountryGetByQueId(id)

    if (examAnswer.length > 0) {
      await examAnswerDeleteByQueId(id)
    }

    if (examQueCountry.length > 0) {
      await examQuestionCountryDeleteByQueId(id)
    }

    await examQuestionDelete(id)

    res.json({ message: "Exam question deleted" })
  } catch (err) {
    logger.error(err)
    res.status(500).send(err)
  }
}
