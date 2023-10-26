import app from "./src/config/express"
import datasource from "./src/config/ormConfig"
import logger from "./src/config/logger"
import env from "./src/api/utils/env"

const PORT = env.PORT

app.listen(PORT, () => {
  logger.info(`⚡️[server]: Server is running at http://localhost:${PORT}`)
})

datasource
  .initialize()
  .then(() => {
    logger.info(`⚡️[database]: Database connected successfully !!!`)
  })
  .catch(error => {
    logger.error(`Failed to connect to database`, error)
  })
