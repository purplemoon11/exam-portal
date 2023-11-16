import { ExamQuestion } from "../entity/question.entity"
import ormConfig from "../../config/ormConfig"
import { userCountryGetByUserId } from "./userCountry.service"

const examQuestionRepo = ormConfig.getRepository(ExamQuestion)

export const examQuestionCreate = async (examQueData: object) => {
  const examQuestion = await examQuestionRepo.save(examQueData)

  return examQuestion
}

export const examQuestionGet = async () => {
  const questions = await examQuestionRepo.find()

  return questions
}

export const examQuestionGetById = async (examQueId: number) => {
  const examQuestion = await examQuestionRepo
    .createQueryBuilder("examQuestion")
    .leftJoinAndSelect("examQuestion.countries", "country")
    .innerJoinAndSelect("examQuestion.answers", "answer")
    .innerJoinAndSelect("examQuestion.cluster", "cluster")
    .innerJoin("cluster.countries", "clusterCountry")
    .addSelect(["clusterCountry.country_name"])
    .where("examQuestion.id = :examQueId", { examQueId })
    .getOne()

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
