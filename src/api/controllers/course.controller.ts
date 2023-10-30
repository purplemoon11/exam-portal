import { Request, Response } from "express";
import { catchAsync } from "../utils/error-handler/catchAsync";
import ormConfig from "../../config/ormConfig";
import { Course } from "../entity/course.entity";

const courseRepo = ormConfig.getRepository(Course);
export const createCourse = catchAsync(async (req: Request, res: Response) => {
  const existingCourse = await courseRepo.findOneBy(req.body?.code);
  const newCourse = new Course();
  newCourse.nameNepali = req.body.nameNepali;
});
