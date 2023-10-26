import express from "express";
import cors from "cors";
import session from "express-session";
import V1Route from "../api/routes/index";

const app = express();

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    preflightContinue: false,
    optionsSuccessStatus: 200,
  })
);

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", V1Route);

export default app;
