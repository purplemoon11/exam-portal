import app from "./src/config/express";
import dotenv from "dotenv";
import datasource from "./src/config/ormConfig";
import logger from "./src/config/logger";

dotenv.config();
app.listen(process.env.PORT, () => {
  logger.info(`Server is running on port ${process.env.PORT}`);
});

datasource
  .initialize()
  .then(() => {
    logger.info(`Database connected successfully !!!`);
  })
  .catch((error) => {
    logger.error(`Failed to connect to database`, error);
  });
