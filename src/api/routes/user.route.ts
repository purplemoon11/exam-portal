import { Router } from "express";
import {
  getProfile,
  registerUser,
  setUser,
  updateProfile,
} from "../controllers/user.controller";
import { updatePassword } from "../controllers/authentication/set-password.controller";
import { authUser } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/files.middleware";

const router = Router();

router.route("/register").post(registerUser);
router.route("/update/password").patch(authUser, updatePassword);
router.post("/set-user", setUser);
router.get("/get-profile", authUser, getProfile);
router.patch(
  "/edit-profile",
  authUser,
  upload.single("profileImage"),
  updateProfile
);

export default router;
