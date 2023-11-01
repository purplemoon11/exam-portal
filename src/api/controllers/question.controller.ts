import { Request, Response, NextFunction } from "express"
import {
  examQuestionCreate,
  examQuestionGet,
  examQuestionGetById,
  examQuestionUpdate,
  examQuestionDelete,
} from "../services/question.service"
import { Cluster } from "../entity/cluster.entity"
import { ExamQuestion } from "../entity/question.entity"
import ormConfig from "../../config/ormConfig"
import AppErrorUtil from "../utils/error-handler/appError"
import logger from "../../config/logger"
import { ExamAnswer } from "../entity/answer.entity"
import { examAnswerCreate, examAnswerGetById } from "../services/answer.service"
import { ExamQuestionCountry } from "../entity/questionCountry.entity"
import {
  examQuestionCountryCreate,
  examQuestionCountryGetById,
} from "../services/questionCountry.service"

const examQuestionRepo = ormConfig.getRepository(ExamQuestion)
const clusterRepo = ormConfig.getRepository(Cluster)

export const createExamQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { question_text, answers, countries, cluster_id } = req.body

    const isExistsCluster = await clusterRepo.findOne({
      where: { id: cluster_id },
    })

    if (!isExistsCluster) {
      return res.status(404).json({ message: "Cluster not found" })
    }

    const questionData = new ExamQuestion()

    if (req.files && req.files["media_file"]) {
      const media = req.files["media_file"][0].filename
      let media_file = `${req.secure ? "https" : "http"}://${req.get(
        "host"
      )}/medias/${media}`
      questionData.media_file = media_file
    }

    questionData.question_text = question_text
    questionData.cluster_id = isExistsCluster.id

    console.log(req.body)

    for (let answer of answers) {
      const { answer_text, isCorrect } = answer
      const answerData = new ExamAnswer()

      answerData.answer_text = answer_text
      answerData.isCorrect = isCorrect
      answerData.question_id = questionData.id

      await examAnswerCreate(answerData)
    }

    for (let country of countries) {
      const { country_name } = country
      console.log(typeof countries)
      const countryData = new ExamQuestionCountry()

      countryData.country_name = country_name
      countryData.question_id = questionData.id

      await examQuestionCountryCreate(countryData)
    }

    const question = await examQuestionCreate(questionData)

    logger.info("Question created successfully")

    res.status(201).json({ question, message: "Question created successfully" })
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
    const examQuestion = await examQuestionGet()

    res.json({ examQuestion })
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

    let media_file = req.files["media_file"][0].filename
    media_file = `${req.secure ? "https" : "http"}://${req.get(
      "host"
    )}/images/${media_file}`

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

    const questionUpdate = await examQuestionUpdate(
      { question_text, cluster_id, media_file },
      question
    )

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
    const examQuestion = await examQuestionGetById(id)

    if (!examQuestion) {
      return res.status(404).json({ message: "Exam question not found" })
    }

    await examQuestionDelete(id)

    res.json({ message: "Exam question deleted" })
  } catch (err) {
    logger.error(err)
    res.status(500).send(err)
  }
}
