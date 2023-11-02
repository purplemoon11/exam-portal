import { Request, Response } from "express";
import ormConfig from "../../../../config/ormConfig";
import { Topic } from "../../../entity/admin/Master-Data/topic.entity";
import { catchAsync } from "../../../utils/error-handler/catchAsync";
import { Videos } from "../../../entity/admin/Master-Data/videos.entity";
import AppErrorUtil from "../../../utils/error-handler/appError";

const topicRepo = ormConfig.getRepository(Topic);
const videoRepo = ormConfig.getRepository(Videos);

export const addVideo = catchAsync(async (req: Request, res: Response) => {
  try {
    const existingTopic = await topicRepo.findOneBy({ id: req.body?.topicId });
    const isVideoExist = await videoRepo.findOne({
      where: { order: req.body?.order },
    });
    if (!existingTopic) throw new AppErrorUtil(400, "Unable to find topic");
    if (isVideoExist)
      throw new AppErrorUtil(400, "Video with this order already exist");

    const videoFile = `${req.secure ? "https" : "http"}://${req.get(
      "host"
    )}/medias/${req.file?.filename}`;
    const newVideo = new Videos();
    newVideo.name = req.body.name;
    newVideo.order = req.body.name;

    newVideo.videoPath = videoFile;
    newVideo.topic = existingTopic;
    const result = await videoRepo.save(newVideo);
    if (!result)
      throw new AppErrorUtil(400, "Unable to add video,please try again");
    return res
      .status(200)
      .json({ message: " Video added successfully", result });
  } catch (err) {
    throw new AppErrorUtil(400, err.message);
  }
});