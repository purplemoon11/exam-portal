import { Request, Response } from "express";
import { catchAsync } from "../../../utils/error-handler/catchAsync";
import ormConfig from "../../../../config/ormConfig";
import { Session } from "../../../entity/admin/Master-Data/session.entity";
import AppErrorUtil from "../../../utils/error-handler/appError";
import { Course } from "../../../entity/admin/Master-Data/course.entity";
const sessionRepo = ormConfig.getRepository(Session);
const courseRepo = ormConfig.getRepository(Course);

export const createSession = catchAsync(async (req: Request, res: Response) => {
  try {
    const isSessionExist = await sessionRepo.findOneBy({ code: req.body.code });
    const existingCourse = await courseRepo.findOne({
      where: { code: req.body.courseCode },
    });
    if (!existingCourse) throw new AppErrorUtil(400, "Unable to find course");
    if (isSessionExist)
      throw new AppErrorUtil(400, "Session with this code already exist");
    const newSession = new Session();
    newSession.nameEnglish = req.body.nameEnglish;
    newSession.nameNepali = req.body.nameNepali;
    newSession.code = req.body.code;
    newSession.descriptionEnglish = req.body.descriptionEnglish;
    newSession.descriptionNepali = req.body.descriptionNepali;
    newSession.sessionFile = req.file.filename;
    newSession.course = existingCourse;
    const result = await sessionRepo.save(newSession);
    if (!result)
      throw new AppErrorUtil(400, "Unable to create session,please try again");
    return res
      .status(200)
      .json({ message: "Session created successfully", result });
  } catch (err) {
    throw new AppErrorUtil(400, err.message);
  }
});

export const updateSession = catchAsync(async (req: Request, res: Response) => {
  try {
    const sessionId = +req.params.id;
    const existingSession = await sessionRepo.findOneBy({ id: sessionId });

    if (!existingSession) {
      throw new AppErrorUtil(404, "Session not found");
    }

    const existingCourse = await courseRepo.findOne({
      where: { code: req.body.courseCode },
    });

    if (!existingCourse) {
      throw new AppErrorUtil(400, "Unable to find course");
    }

    existingSession.nameEnglish = req.body.nameEnglish;
    existingSession.nameNepali = req.body.nameNepali;
    existingSession.code = req.body.code;
    existingSession.descriptionEnglish = req.body.descriptionEnglish;
    existingSession.descriptionNepali = req.body.descriptionNepali;
    existingSession.sessionFile = req.file.filename;
    existingSession.course = existingCourse;

    const result = await sessionRepo.save(existingSession);

    if (!result) {
      throw new AppErrorUtil(400, "Unable to update session, please try again");
    }

    return res
      .status(200)
      .json({ message: "Session updated successfully", result });
  } catch (err) {
    throw new AppErrorUtil(400, err.message);
  }
});

export const deleteSession = catchAsync(async (req: Request, res: Response) => {
  try {
    const sessionId = +req.params.id;
    const existingSession = await sessionRepo.findOneBy({ id: sessionId });

    if (!existingSession) {
      throw new AppErrorUtil(404, "Session not found");
    }

    await sessionRepo.remove(existingSession);

    return res.status(200).json({ message: "Session deleted" });
  } catch (err) {
    throw new AppErrorUtil(400, err.message);
  }
});

export const getAllSession = catchAsync(async (req: Request, res: Response) => {
  try {
    // const courses = await courseRepo.find({
    //   relations: ['session'],
    // });

    // const sessions = await sessionRepo
    //   .createQueryBuilder("session")
    //   .leftJoinAndSelect("session.topic", "topic")
    //   .getMany();

    // const extractedData = await Promise.all(
    //   sessions.map(async (session) => {
    //     const totalSessions = await sessionRepo
    //       .createQueryBuilder("session")
    //       .leftJoinAndSelect("session.topic", "topic")
    //       .where("topic.id = :id", { id: session.id })
    //       .getCount();

    //     return {
    //       name: session.nameEnglish,
    //       code: session.code,
    //       totalSessions: totalSessions,
    //     };
    //   })
    // );
    const sessions = await sessionRepo
      .createQueryBuilder("session")
      .select([
        " session.nameEnglish as session_name",
        " session.code",
        "COUNT(topic.id) as totalTopics",
      ])
      .leftJoin("session.topic", "topic")
      .groupBy("session.id")
      .getRawMany();

    return res.status(200).json({ sessions });
  } catch (err) {
    throw new AppErrorUtil(400, err.message);
  }
});
