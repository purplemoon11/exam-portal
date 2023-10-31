import { ExamQuestion } from "../entity/question.entity"
import ormConfig from "../../config/ormConfig"

const examQuestionRepo = ormConfig.getRepository(ExamQuestion)

export const examQuestionCreate = async (examQueData: object) => {
  const examQuestion = await examQuestionRepo.save(examQueData)

  return examQuestion
}

export const examQuestionGet = async () => {
  const examQuestion = await examQuestionRepo.find({
    relations: ["countries", "answers"],
  })

  return examQuestion
}

export const examQuestionGetById = async (examQueId: number) => {
  const examQuestion = await examQuestionRepo.findOne({
    relations: ["countries", "answers"],
    where: { id: examQueId },
  })

  return examQuestion
}

export const examQuestionUpdate = async (
  updateData: object,
  examQueData: ExamQuestion
) => {
  const examQuestion = examQuestionRepo.merge(examQueData, updateData)

  await examQuestionRepo.save(examQuestion)
  return examQuestion
}

export const examQuestionDelete = async (examQueId: number) => {
  const examQuestion = await examQuestionRepo.findOne({
    where: { id: examQueId },
  })

  return await examQuestionRepo.remove(examQuestion)
}
