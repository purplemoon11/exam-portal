import { Router } from "express";
import {
  getAllUsers,
  userManagement,
} from "../../controllers/admin/user-management.controller";

const router = Router();

router.get("/user-management", userManagement);
router.get("/all-users", getAllUsers);

export default router;
