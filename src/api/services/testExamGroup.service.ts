import { TestExamGroup } from "../entity/testExamGroup.entity"
import ormConfig from "../../config/ormConfig"

const testGroupRepo = ormConfig.getRepository(TestExamGroup)

export const testGroupGetByNameUser = async (
  userId: number,
  testName: string
) => {
  const testExam = await testGroupRepo.findOne({
    where: { test_name: testName, cand_id: userId },
  })

  return testExam
}

export const testGroupUpdate = async (
  updateData: object,
  testGroupData: TestExamGroup
) => {
  const testGroup = testGroupRepo.merge(testGroupData, updateData)

  await testGroupRepo.save(testGroup)
  return testGroup
}
