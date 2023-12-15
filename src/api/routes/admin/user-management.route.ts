import { Router } from "express";
import {
  getAllUsers,
  userManagement,
} from "../../controllers/admin/user-management.controller";
import { isAdmin } from "../../middlewares/isAdmin.middleware";

const router = Router();

router.get("/user-management", isAdmin, userManagement);
router.get("/all-users", getAllUsers);

export default router;
