import { Request, Response, NextFunction } from "express"
import {
  countryCreate,
  countryGet,
  countryUpdate,
  countryDelete,
  countryGetById,
} from "../services/country.service"
import { Country } from "../entity/country.entity"
import ormConfig from "../../config/ormConfig"
import AppErrorUtil from "../utils/error-handler/appError"
import logger from "../../config/logger"
import env from "../utils/env"

const countryRepo = ormConfig.getRepository(Country)

export const createCountry = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      country_name,
      contact_person,
      phone_number,
      embassy_ph_number,
      embassy_address,
    } = req.body
    const country_image = req.files["image"][0].filename

    const isExistsCountry = await countryRepo.findOneBy({
      country_name,
    })

    if (isExistsCountry) {
      return res.status(400).json({ message: "Country already exists" })
    }

    const countryData = new Country()

    countryData.country_name = country_name
    countryData.contact_person = contact_person
    countryData.phone_number = phone_number
    countryData.embassy_ph_number = embassy_ph_number
    countryData.embassy_address = embassy_address
    countryData.country_image = `${req.secure ? "https" : "http"}://${req.get(
      "host"
    )}/images/${country_image}`

    const country = await countryCreate(countryData)

    logger.info("Country created", country)
    res
      .status(201)
      .json({ data: country, message: "Country created successfully" })
  } catch (err) {
    logger.error("Fail to add country", err)
    res.status(500).send("Internal server error")
  }
}

export const getCountries = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const country = await countryGet()

    res.json({ data: country })
  } catch (err) {
    logger.error("Unable to fetch country data", err)
    res.status(500).send("Internal Server error")
  }
}

export const getCountryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id)
    const country = await countryGetById(id)

    if (!country) {
      return res.status(404).json({ message: "Country not found" })
    }

    res.json({ data: country })
  } catch (err) {
    logger.error("Unable to fetch country data", err)
    res.status(500).send("Internal Server error")
  }
}

export const updateCountry = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id)
    const {
      country_name,
      contact_person,
      phone_number,
      embassy_ph_number,
      embassy_address,
    } = req.body

    let country_image = req.files["image"][0].filename
    console.log(country_image)

    country_image = `${req.secure ? "https" : "http"}://${req.get(
      "host"
    )}/images/${country_image}`

    const countryData = await countryRepo.findOneBy({
      id,
    })

    if (!countryData) {
      return res.status(404).json({ message: "Country data not found" })
    }

    const isExistsCountry = await countryRepo.findOneBy({
      country_name,
    })

    if (isExistsCountry) {
      return res.status(400).json({ message: "Country already exists" })
    }

    const country = await countryUpdate(
      {
        country_name,
        contact_person,
        phone_number,
        embassy_ph_number,
        embassy_address,
        country_image,
      },
      countryData
    )

    logger.info("Country updated successfully")
    res.json({ data: country, message: "Country updated successfully" })
  } catch (err) {
    logger.error("Unable to update country data", err)
    res.status(500).send("Internal Server error")
  }
}

export const deleteCountry = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id)

    const countryData = await countryRepo.findOneBy({
      id,
    })

    if (!countryData) {
      return res.status(404).json({ message: "Country data not found" })
    }

    await countryDelete(id)

    return res.json({ message: "Country deleted successfully" })
  } catch (err) {
    logger.error("Unable to delete country data", err)
    res.status(500).send("Internal Server error")
  }
}
