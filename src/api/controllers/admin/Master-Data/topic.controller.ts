import { Request, Response } from "express";
import { catchAsync } from "../../../utils/error-handler/catchAsync";
import ormConfig from "../../../../config/ormConfig";
import { Session } from "../../../entity/admin/Master-Data/session.entity";
import AppErrorUtil from "../../../utils/error-handler/appError";
import { Course } from "../../../entity/admin/Master-Data/course.entity";
import { Topic } from "../../../entity/admin/Master-Data/topic.entity";
const sessionRepo = ormConfig.getRepository(Session);
const topicRepo = ormConfig.getRepository(Topic);
export const createTopic = catchAsync(async (req: Request, res: Response) => {
  try {
    const isTopicExist = await sessionRepo.findOneBy(req.body.code);
    const existingSession = await sessionRepo.findOne({
      where: { code: req.body.SessionCode },
    });
    if (!existingSession) throw new AppErrorUtil(400, "Unable to find session");
    if (isTopicExist)
      throw new AppErrorUtil(400, "Topic with this code already exist");
    const newTopic = new Topic();
    newTopic.nameEnglish = req.body.nameEnglish;
    newTopic.nameNepali = req.body.nameNepali;
    newTopic.contentType = req.body.contentType;
    newTopic.order = req.body.order;
    newTopic.descriptionNepali = req.body.descriptionEnglish;
    newTopic.descriptionNepali = req.body.descriptionNepali;
    // newTopic.topicFiles = req.body.topicFiles.map((file: any) => file.filename);
    newTopic.session = existingSession;
    const result = await topicRepo.save(newTopic);
    if (!result)
      throw new AppErrorUtil(400, "Unable to add topic,please try again");
    return res
      .status(200)
      .json({ message: " Topic added successfully", result });
  } catch (err) {
    throw new AppErrorUtil(500, err);
  }
});

export const updateTopic = catchAsync(async (req: Request, res: Response) => {
  try {
    const topicId = +req.params.id;
    const existingTopic = await topicRepo.findOneBy({ id: topicId });

    if (!existingTopic) {
      throw new AppErrorUtil(404, "Topic not found");
    }

    const existingSession = await sessionRepo.findOne({
      where: { code: req.body.SessionCode },
    });

    if (!existingSession) {
      throw new AppErrorUtil(400, "Unable to find session");
    }

    existingTopic.nameEnglish = req.body.nameEnglish;
    existingTopic.nameNepali = req.body.nameNepali;
    existingTopic.contentType = req.body.contentType;
    existingTopic.order = req.body.order;
    existingTopic.descriptionEnglish = req.body.descriptionEnglish;
    existingTopic.descriptionNepali = req.body.descriptionNepali;
    // existingTopic.topicFiles = req.body.topicFiles.map(
    //   (file: any) => file.filename
    // );

    existingTopic.session = existingSession;

    const result = await topicRepo.save(existingTopic);

    if (!result) {
      throw new AppErrorUtil(400, "Unable to update topic, please try again");
    }

    return res
      .status(200)
      .json({ message: "Topic updated successfully", result });
  } catch (err) {
    throw new AppErrorUtil(500, err);
  }
});

export const deleteTopic = catchAsync(async (req: Request, res: Response) => {
  try {
    const topicId = +req.params.id;
    const existingTopic = await topicRepo.findOneBy({ id: topicId });

    if (!existingTopic) {
      throw new AppErrorUtil(404, "Topic not found");
    }

    await topicRepo.remove(existingTopic);

    return res.status(204).json({ message: "Topic deleted" });
  } catch (err) {
    throw new AppErrorUtil(500, err);
  }
});

export const getAllTopics = catchAsync(async (req: Request, res: Response) => {
  try {
    const topics = await topicRepo.find();

    const requiredData = await Promise.all(topics.map(async (topic) => {}));
  } catch (err) {}
});
