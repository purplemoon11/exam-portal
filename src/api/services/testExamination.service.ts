import { TestExamination } from "../entity/testExamination.entity"
import ormConfig from "../../config/ormConfig"

const testExamRepo = ormConfig.getRepository(TestExamination)

export const testExamCreate = async (testExamData: object) => {
  const testExam = await testExamRepo.save(testExamData)

  return testExam
}

export const testExamGetByUser = async (userId: number) => {
  const testExam = await testExamRepo.find({
    where: { cand_id: userId },
    order: { test_date: "DESC" },
  })

  return testExam
}

export const testExamGetByName = async (testName: string) => {
  const testExam = await testExamRepo.findOne({
    where: { test_name: testName },
  })

  return testExam
}

export const testExamGetById = async (testExamId: number) => {
  const testExam = await testExamRepo.findOne({ where: { id: testExamId } })

  return testExam
}

export const testExamUpdate = async (
  updateData: object,
  testExamData: TestExamination
) => {
  const testExam = testExamRepo.merge(testExamData, updateData)

  await testExamRepo.save(testExam)
  return testExam
}

export const testExamDelete = async (testExamId: number) => {
  const testExam = await testExamRepo.findOne({
    where: { id: testExamId },
  })

  return await testExamRepo.remove(testExam)
}
