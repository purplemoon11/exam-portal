import { DataSource } from "typeorm"
import { User } from "../api/entity/user.entity"
import { OtpAuth } from "../api/entity/otp.entity"
import { Country } from "../api/entity/country.entity"
import { Notification } from "../api/entity/notification.entity"
import { UserCountry } from "../api/entity/userCountry.entity"

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
  entities: [User, OtpAuth, Country, Notification, UserCountry],
  logging: false,
})

export default ormConfig
