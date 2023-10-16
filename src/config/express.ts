import express from "express"
import cors from "cors"

const app = express()

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    preflightContinue: false,
    optionsSuccessStatus: 200,
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

export default app
