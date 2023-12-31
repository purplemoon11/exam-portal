import { Transaction } from "../entity/transaction.entity"
import ormConfig from "../../config/ormConfig"

const transactionRepo = ormConfig.getRepository(Transaction)

export const transactionCreate = async (transData: object) => {
  const transaction = await transactionRepo.save(transData)

  return transaction
}

export const transactionGet = async () => {
  const transaction = await transactionRepo.find()

  return transaction
}

export const transactionGetById = async (transId: number) => {
  const transaction = await transactionRepo.findOne({ where: { id: transId } })

  return transaction
}

export const transactionGetByUser = async (userId: number) => {
  let transaction = await transactionRepo
    .createQueryBuilder("transaction")
    .leftJoinAndSelect("transaction.testExams", "testExams")
    .where("transaction.cand_id = :userId", { userId })
    .orderBy("transaction.created_date", "DESC")
    .getOne()

  return transaction
}

export const transactionUpdate = async (
  transData: Transaction,
  updateData: object
) => {
  const transaction = transactionRepo.merge(transData, updateData)

  await transactionRepo.save(transaction)
  return transaction
}

export const transactionDelete = async (transId: number) => {
  const transaction = await transactionRepo.findOne({
    where: { id: transId },
  })

  return await transactionRepo.remove(transaction)
}
