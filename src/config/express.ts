import express from "express";
import cors from "cors";
import session from "express-session";
import V1Route from "../api/routes/index";
import path from "path";
import {
  errorConverter,
  errorHandler,
  notFound,
} from "../api/middlewares/error.middleware";
import morgan from "morgan";

// Config env file

const app = express();

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    preflightContinue: false,
    optionsSuccessStatus: 200,
  })
);
app.use(morgan("combined"));

app.set("trust proxy", 1);
app.use(
  session({
    name: "pdot",
    secret: String(process.env.SESSION_SECRET),
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 60000,
    },
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Server is up and running");
});
app.use("/medias", express.static("./src/api/uploads"));
app.use("/api/v1", V1Route);
app.use("*", notFound);
app.use("*", errorConverter);
app.use("*", errorHandler);

// const uploadsPath = path.join(__dirname, "../uploads");
// app.use("/uploads", express.static(uploadsPath));

export default app;
