import { Router } from "express"
import { registerUser } from "../controllers/user.controller"
import { updatePassword } from "../controllers/authentication/set-password.controller"
import { authUser } from "../middlewares/auth.middleware"

const router = Router()

router.route("/register").post(registerUser)
router.route("/update/password").patch(authUser, updatePassword)

export default router
