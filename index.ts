import app from "./src/config/express";
import datasource from "./src/config/ormConfig";
import logger from "./src/config/logger";
import env from "./src/api/utils/env";
import dotenv from "dotenv";
import { connectToMongoDB } from "./src/config/mongoDB";
import { redisClient } from "./src/config/redisConfig";

const PORT = env.PORT;
dotenv.config();

// redisClient
//   .on("connect", () => console.log("Connected to Redis"))
//   .on("error", (err) => console.error("Error connecting to Redis:", err));
redisClient
  .on("connect", () => logger.info("Connected to Redis"))
  .on("error", (err) => logger.error("Error connecting to Redis:", err));

datasource
  .initialize()
  .then(async () => {
    app.listen(PORT, () => {
      logger.info(`⚡️[server]: Server is running at http://localhost:${PORT}`);
    });

    logger.info(`⚡️[database]: Database connected successfully !!!`);
    await connectToMongoDB();
  })
  .catch((error) => {
    logger.error(`Failed to connect to database`, error);
  });
