import { ExamQuestionCountry } from "../entity/questionCountry.entity"
import ormConfig from "../../config/ormConfig"

const examQuestionCountryRepo = ormConfig.getRepository(ExamQuestionCountry)

export const examQuestionCountryCreate = async (examQueCountryData: object) => {
  const examQuestionCountry = await examQuestionCountryRepo.save(
    examQueCountryData
  )

  return examQuestionCountry
}

export const examQuestionCountryGetById = async (examQueCountryId: number) => {
  const examQuestionCountry = await examQuestionCountryRepo.findOne({
    where: { id: examQueCountryId },
  })

  return examQuestionCountry
}

export const examQuestionCountryGetByQueId = async (queId: number) => {
  const examQuestionCountry = await examQuestionCountryRepo.find({
    where: { question_id: queId },
  })

  return examQuestionCountry
}

export const examQuestionCountryUpdate = async (
  updateData: object,
  examQueCountryData: ExamQuestionCountry
) => {
  const examQuestionCountry = examQuestionCountryRepo.merge(
    examQueCountryData,
    updateData
  )

  await examQuestionCountryRepo.save(examQuestionCountry)
  return examQuestionCountry
}

export const examQuestionCountryDelete = async (queCountryId: number) => {
  const examQuestionCountry = await examQuestionCountryRepo.find({
    where: { id: queCountryId },
  })

  return await examQuestionCountryRepo.remove(examQuestionCountry)
}

export const examQuestionCountryDeleteByQueId = async (queID: number) => {
  const examQuestionCountry = await examQuestionCountryRepo.find({
    where: { question_id: queID },
  })

  return await examQuestionCountryRepo.remove(examQuestionCountry)
}
