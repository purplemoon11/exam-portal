import { Country } from "../entity/country.entity";
import ormConfig from "../../config/ormConfig";

const countryRepo = ormConfig.getRepository(Country);

export const countryCreate = async (countryData: object) => {
  const country = await countryRepo.save(countryData);

  return country;
};

export const countryGet = async () => {
  const country = await countryRepo.find();

  return country;
};

export const countryGetById = async (id: number) => {
  const country = await countryRepo.findOne({ where: { id } });

  return country;
};

export const countryUpdate = async (
  updateData: object,
  countryData: object
) => {
  const country = countryRepo.merge(countryData, updateData);

  await countryRepo.save(country);
  return country;
};

export const countryDelete = async (countryId: number) => {
  const country = await countryRepo.findOne({ where: { id: countryId } });

  return await countryRepo.remove(country);
};
