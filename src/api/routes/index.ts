import express from "express";
import Authentication from "./authentication/authentication.route";

const router = express.Router();

router.use("/authentication", Authentication);

export default router;
