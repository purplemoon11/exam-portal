import app from "./src/config/express";
import datasource from "./src/config/ormConfig";
import logger from "./src/config/logger";
import env from "./src/api/utils/env";
import { redisClient } from "./src/config/redisConfig";

const PORT = env.PORT;

redisClient
  .on("connect", () => console.log("Connected to Redis"))
  .on("error", (err) => console.error("Error connecting to Redis:", err));

datasource
  .initialize()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`⚡️[server]: Server is running at http://localhost:${PORT}`);
    });
    logger.info(`⚡️[database]: Database connected successfully !!!`);
  })
  .catch((error) => {
    logger.error(`Failed to connect to database`, error);
  });
