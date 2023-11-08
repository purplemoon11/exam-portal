import { CandidateExamAttempt } from "../entity/candidateExam.entity"
import ormConfig from "../../config/ormConfig"

const candExamRepo = ormConfig.getRepository(CandidateExamAttempt)

export const candExamUpdate = async (
  updateData: object,
  candExamData: CandidateExamAttempt
) => {
  const candExam = candExamRepo.merge(candExamData, updateData)

  await candExamRepo.save(candExam)
  return candExam
}
