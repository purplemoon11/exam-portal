import { DataSource } from "typeorm"
import { User } from "../entity/user.entity"

import dotenv from "dotenv"
dotenv.config()

const ormConfig = new DataSource({
  type: "postgres",
  host: process.env.HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  synchronize: false,
  entities: [User],
  // logging: true,
})

export default ormConfig
