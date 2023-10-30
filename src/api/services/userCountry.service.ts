import { UserCountry } from "../entity/userCountry.entity"
import ormConfig from "../../config/ormConfig"

const userCountryRepo = ormConfig.getRepository(UserCountry)

export const userCountryCreate = async (userCountryData: object) => {
  const userCountry = await userCountryRepo.save(userCountryData)

  return userCountry
}

export const userCountryGet = async () => {
  const userCountry = await userCountryRepo.findAndCount({
    relations: ["country"],
  })

  return userCountry
}

export const userCountryGetById = async (userCountryId: number) => {
  const userCountry = await userCountryRepo.findOne({
    relations: ["country"],
    where: { id: userCountryId },
  })

  return userCountry
}

export const userCountryUpdate = async (
  updateData: object,
  userCountryData: object
) => {
  const userCountry = userCountryRepo.merge(userCountryData, updateData)

  await userCountryRepo.save(userCountry)
  return userCountry
}

export const userCountryDelete = async (userCountryId: number) => {
  const userCountry = await userCountryRepo.findOne({
    where: { id: userCountryId },
  })

  return await userCountryRepo.remove(userCountry)
}
