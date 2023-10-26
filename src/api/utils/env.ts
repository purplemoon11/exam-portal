import dotenv from "dotenv"

dotenv.config()

export default {
  PORT: process.env.PORT,
  JWTSECRET: process.env.JWTSECRET,
}
