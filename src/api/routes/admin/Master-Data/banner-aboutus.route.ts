import { Router } from "express";
import { updateAboutUs } from "../../../controllers/admin/Master-Data/banner-aboutus.controller";

const router = Router();

router.post("/about-us", updateAboutUs);

export default router;
