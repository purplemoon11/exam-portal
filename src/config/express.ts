import express from "express"
import cors from "cors"

// Routes
import IndexRoute from "../routes/index"

// Config env file

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

app.use("/api", IndexRoute)

export default app
