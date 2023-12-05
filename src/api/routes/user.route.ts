import { Router } from "express";
import { registerUser, setUser } from "../controllers/user.controller";
import { updatePassword } from "../controllers/authentication/set-password.controller";
import { authUser } from "../middlewares/auth.middleware";

const router = Router();

router.route("/register").post(registerUser);
router.route("/update/password").patch(authUser, updatePassword);
router.post("/set-user", setUser);

export default router;
