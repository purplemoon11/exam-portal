import { Router } from "express";
import { userManagement } from "../../controllers/admin/user-management.controller";

const router = Router();

router.get("/user-management", userManagement);

export default router;
