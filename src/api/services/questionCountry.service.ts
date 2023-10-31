import { ExamQuestionCountry } from "../entity/questionCountry.entity"
import ormConfig from "../../config/ormConfig"

const examQuestionCountryRepo = ormConfig.getRepository(ExamQuestionCountry)

export const examQuestionCountryCreate = async (examQueCountryData: object) => {
  const examQuestionCountry = await examQuestionCountryRepo.save(
    examQueCountryData
  )

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
