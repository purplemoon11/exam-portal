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
    console.log(req.body.sessionCode);
    const isTopicExist = await topicRepo.findOneBy({ name: req.body?.name });
    const existingSession = await sessionRepo.findOne({
      where: { id: req.body.topicId },
    });
    console.log(existingSession);
    if (!existingSession) throw new AppErrorUtil(400, "Unable to find session");
    if (isTopicExist)
      throw new AppErrorUtil(400, "Topic with this name already exist");

    const topicFile = `${req.secure ? "https" : "http"}://${req.get(
      "host"
    )}/medias/${req.file?.filename}`;
    const newTopic = new Topic();
    newTopic.name = req.body.name;
    newTopic.description = req.body.description;
    newTopic.filePath = topicFile;
    newTopic.session = existingSession;
    const result = await topicRepo.save(newTopic);
    if (!result)
      throw new AppErrorUtil(400, "Unable to add topic,please try again");
    return res
      .status(200)
      .json({ message: " Topic added successfully", result });
  } catch (err) {
    throw new AppErrorUtil(400, err.message);
  }
});

export const updateTopic = catchAsync(async (req: Request, res: Response) => {
  try {
    const topicId = +req.params.id;
    const existingTopic = await topicRepo.findOneBy({ id: topicId });

    if (!existingTopic) {
      throw new AppErrorUtil(404, "Topic not found");
    }
    const isNameInUse = await topicRepo
      .createQueryBuilder("topic")
      .where("topic.name = :name AND topic.id != :topicId", {
        name: req.body.name,
        topicId: topicId,
      })
      .getOne();
    if (isNameInUse)
      throw new AppErrorUtil(400, "Topic with this name already exist");

    const existingSession = await sessionRepo.findOne({
      where: { id: req.body.sessionId },
    });

    if (!existingSession) {
      throw new AppErrorUtil(400, "Unable to find session");
    }
    const topicFile = `${req.secure ? "https" : "http"}://${req.get(
      "host"
    )}/medias/${req.file?.filename}`;
    existingTopic.name = req.body.name;
    existingTopic.description = req.body.description;
    existingTopic.filePath = topicFile;
    existingTopic.session = existingSession;

    const result = await topicRepo.save(existingTopic);

    if (!result) {
      throw new AppErrorUtil(400, "Unable to update topic, please try again");
    }

    return res
      .status(200)
      .json({ message: "Topic updated successfully", result });
  } catch (err) {
    throw new AppErrorUtil(400, err.message);
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

    return res.status(200).json({ message: "Topic deleted" });
  } catch (err) {
    throw new AppErrorUtil(400, err.message);
  }
});

export const getAllTopics = catchAsync(async (req: Request, res: Response) => {
  try {
    // const topics = await topicRepo.find();
    const topics = await topicRepo
      .createQueryBuilder("topic")
      .leftJoin("topic.videosContent", "videos")
      .leftJoin("topic.pdfContent", "pdfs")
      .leftJoin("topic.slidesContent", "slides")
      .select([
        "topic.id as topic_id",
        "topic.name as topic_name",
        "COUNT(videos.id) as totalVideos",
        "COUNT(pdfs.id) as totalPdfs",
        "COUNT(slides.id) as totalSlides",
      ])
      .groupBy("topic.id")
      .getRawMany();
    return res.status(200).json({ topics });
  } catch (err) {
    throw new AppErrorUtil(400, err.message);
  }
});

export const getContentsByTopicId = catchAsync(
  async (req: Request, res: Response) => {
    try {
      const topicId = +req.params.id;
      const topics = await topicRepo
        .createQueryBuilder("topic")
        .leftJoinAndSelect("topic.session", "session")
        .leftJoinAndSelect("topic.videosContent", "videos")
        .leftJoinAndSelect("topic.pdfContent", "pdfs")
        .leftJoinAndSelect("topic.slidesContent", "slides")
        .loadRelationCountAndMap("topic.totalVideos", "topic.videosContent")
        .loadRelationCountAndMap("topic.totalpdfs", "topic.pdfContent")
        .loadRelationCountAndMap("topic.totalSlides", "topic.slidesContent")
        .where("topic.id=:id", { id: topicId })
        .getMany();

      return res.status(200).json({ topics });
    } catch (err) {
      throw new AppErrorUtil(400, err.message);
    }
  }
);
