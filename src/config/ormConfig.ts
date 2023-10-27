import { DataSource } from "typeorm";
import { User } from "../api/entity/user.entity";
import { OtpAuth } from "../api/entity/otp.entity";

import dotenv from "dotenv";
dotenv.config();

const ormConfig = new DataSource({
  type: "postgres",
  host: process.env.HOST,
  port: 5433,
  username: "pdot",
  password: "pdot@123",
  database: "pdot",
  synchronize: false,
  entities: [User, OtpAuth],
  logging: false,
});

export default ormConfig;
