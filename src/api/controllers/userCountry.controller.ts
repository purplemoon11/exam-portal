import { Request, Response, NextFunction } from "express";
import {
  userCountryCreate,
  userCountryGet,
  userCountryGetById,
  userCountryUpdate,
  userCountryDelete,
} from "../services/userCountry.service";
import { Country } from "../entity/country.entity";
import { UserCountry } from "../entity/userCountry.entity";
import ormConfig from "../../config/ormConfig";
import AppErrorUtil from "../utils/error-handler/appError";
import logger from "../../config/logger";
import env from "../utils/env";

const countryRepo = ormConfig.getRepository(Country);
const userCountryRepo = ormConfig.getRepository(UserCountry);

interface UserCountryRequest extends Request {
  user: {
    id: string;
  };
}

export const createUserCountry = async (
  req: UserCountryRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { countryName } = req.body;

    const isExistsCountry = await countryRepo.findOneBy({
      country_name: countryName,
    });

    if (!isExistsCountry) {
      return res.status(404).json({ message: "Country doesnot exist" });
    }

    const cand_id = parseInt(req.user.id);
    const country_id = isExistsCountry.id;

    const userCountryData = new UserCountry();

    userCountryData.cand_id = cand_id;
    userCountryData.country_id = country_id;

    const userCountry = await userCountryCreate(userCountryData);

    logger.info("User country created", userCountry);
    res.status(201).json({
      data: userCountry,
      message: "User country created successfully",
    });
  } catch (err) {
    logger.error("Fail to add user country", err);
    res.status(500).send("Internal server error");
  }
};

export const getUserCountries = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userCountries = await userCountryGet();

    res.json({ data: userCountries });
  } catch (err) {
    logger.error("Unable to fetch usercountries", err);
    res.status(500).send("Internal Server error");
  }
};

export const getUserCountryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    const userCountry = await userCountryGetById(id);

    if (!userCountry) {
      return res.status(404).json({ message: "User country not found" });
    }

    res.json({ data: userCountry });
  } catch (err) {
    logger.error("Unable to fetch user country", err);
    res.status(500).send("Internal Server error");
  }
};

export const updateUserCountry = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    const { countryName } = req.body;
    const cand_id = parseInt(req.params.id);

    const userCountryData = await userCountryRepo.findOneBy({
      id,
    });

    const isExistsCountry = await countryRepo.findOneBy({
      country_name: countryName,
    });

    if (!isExistsCountry) {
      return res.status(404).json({ message: "Country doesnot exist" });
    }

    if (!userCountryData) {
      return res.status(404).json({ message: "User country data not found" });
    }

    const country_id = isExistsCountry.id;

    const userCountry = await userCountryUpdate(
      { country_id },
      userCountryData
    );

    logger.info("User country updated successfully");
    res.json({
      data: userCountry,
      message: "User country updated successfully",
    });
  } catch (err) {
    logger.error("Unable to update user country data", err);
    res.status(500).send("Internal Server error");
  }
};

export const deleteUserCountry = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);

    const userCountryData = await userCountryRepo.findOneBy({
      id,
    });

    if (!userCountryData) {
      return res.status(404).json({ message: "User country data not found" });
    }

    await userCountryDelete(id);

    return res.json({ message: "User country deleted successfully" });
  } catch (err) {
    logger.error("Unable to delete user country", err);
    res.status(500).send("Internal Server error");
  }
};
