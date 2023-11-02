import { ExamAnswer } from "../entity/answer.entity"
import ormConfig from "../../config/ormConfig"

const examAnswerRepo = ormConfig.getRepository(ExamAnswer)

export const examAnswerCreate = async (examAnsData: object) => {
  const examAnswer = await examAnswerRepo.save(examAnsData)

  return examAnswer
}

export const examAnswerGet = async () => {
  const examAnswer = await examAnswerRepo.find()

  return examAnswer
}

export const examAnswerGetById = async (examAnsId: number) => {
  const examAnswer = await examAnswerRepo.findOne({
    where: { id: examAnsId },
  })

  return examAnswer
}

export const examAnswerGetByQueId = async (queId: number) => {
  const examAnswer = await examAnswerRepo.find({
    where: { question_id: queId },
  })

  return examAnswer
}

export const examAnswerUpdate = async (
  updateData: object,
  examAnsData: ExamAnswer
) => {
  const examAnswer = examAnswerRepo.merge(examAnsData, updateData)

  await examAnswerRepo.save(examAnswer)
  return examAnswer
}

export const examAnswerDelete = async (examQueId: number) => {
  const examAnswer = await examAnswerRepo.findOne({
    where: { id: examQueId },
  })

  return await examAnswerRepo.remove(examAnswer)
}

export const examAnswerDeleteByQueId = async (queID: number) => {
  const examAnswer = await examAnswerRepo.find({
    where: { question_id: queID },
  })

  return await examAnswerRepo.remove(examAnswer)
}
