import { ExamQuestionCountry } from "../entity/questionCountry.entity"
import ormConfig from "../../config/ormConfig"

const examQuestionCountryRepo = ormConfig.getRepository(ExamQuestionCountry)

// export const examQuestionCountryCreate = async (examQueCountryData: object) => {
//   const examQuestion = await examQuestionRepo.save(examQueData)

//   return examQuestion
// }

// export const examQuestionGet = async () => {
//   const examQuestion = await examQuestionRepo.find()

//   return examQuestion
// }

// export const examQuestionGetById = async (examQueId: number) => {
//   const examQuestion = await examQuestionRepo.findOne({
//     relations: ["country", "answer"],
//     where: { id: examQueId },
//   })

//   return examQuestion
// }

// export const examQuestionUpdate = async (
//   updateData: object,
//   examQueData: ExamQuestion
// ) => {
//   const examQuestion = examQuestionRepo.merge(examQueData, updateData)

//   await examQuestionRepo.save(examQuestion)
//   return examQuestion
// }

// export const examQuestionDelete = async (examQueId: number) => {
//   const examQuestion = await examQuestionRepo.findOne({
//     where: { id: examQueId },
//   })

//   return await examQuestionRepo.remove(examQuestion)
// }
