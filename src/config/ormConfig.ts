import { DataSource } from "typeorm";
import { User } from "../api/entity/user.entity";
import { OtpAuth } from "../api/entity/otp.entity";

import dotenv from "dotenv";
dotenv.config();

const ormConfig = new DataSource({
  type: "postgres",
  host: process.env.HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  synchronize: false,
  entities: [User, OtpAuth],
  logging: false,
});

export default ormConfig;
