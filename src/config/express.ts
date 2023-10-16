import express from "express";
import cors from "cors";

const app = express();

/**
 * enable CORS - Cross Origin Resource Sharing
 */
app.use(
  cors({
    origin: "*",
    // methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export default app;
