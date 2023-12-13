import { Router } from "express";
import {
  createTestExamGroup,
  getTestExamDetails,
  getTestExamGroup,
  getTestExamGroupById,
} from "../controllers/testExamGroup.controller";
import { authUser } from "../middlewares/auth.middleware";

const router = Router();

router.get("/details", authUser, getTestExamDetails);
router
  .route("/")
  .post(authUser, createTestExamGroup)
  .get(authUser, getTestExamGroup);

router.route("/:id").get(authUser, getTestExamGroupById);

export default router;
