import { DataSource } from "typeorm"
import { User } from "../api/entity/user.entity"
import { OtpAuth } from "../api/entity/otp.entity"
import { Country } from "../api/entity/country.entity"

import dotenv from "dotenv"
dotenv.config()

const ormConfig = new DataSource({
  type: "postgres",
  host: process.env.HOST,
  port: Number(process.env.DB_PORT),
  username: "pdot",
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  synchronize: false,
  entities: [User, OtpAuth, Country],
  logging: false,
})

export default ormConfig
