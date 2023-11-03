import { Request, Response } from "express";
import ormConfig from "../../../../config/ormConfig";
import { Topic } from "../../../entity/admin/Master-Data/topic.entity";
import { catchAsync } from "../../../utils/error-handler/catchAsync";
import { Videos } from "../../../entity/admin/Master-Data/videos.entity";
import AppErrorUtil from "../../../utils/error-handler/appError";
import { MoreThanOrEqual } from "typeorm";

const topicRepo = ormConfig.getRepository(Topic);
const videoRepo = ormConfig.getRepository(Videos);

export const addVideo = catchAsync(async (req: Request, res: Response) => {
  try {
    const { topicId } = req.body;
    let existingTopic: Topic;
    topicId
      ? (existingTopic = await topicRepo.findOneBy({ id: topicId }))
      : null;
    // console.log(existingTopic);
    const isVideoOrderExist = await videoRepo.findOne({
      where: { order: req.body?.order },
    });
    const isVideoNameExist = await videoRepo.findOne({
      where: { name: req.body?.name },
    });
    if (!existingTopic) throw new AppErrorUtil(400, "Unable to find topic");
    if (isVideoOrderExist)
      throw new AppErrorUtil(400, "Video with this order already exist");
    if (isVideoNameExist)
      throw new AppErrorUtil(40, "Video with this name already exist");
    const videoFile = `${req.secure ? "https" : "http"}://${req.get(
      "host"
    )}/medias/${req.file?.filename}`;
    const newVideo = new Videos();
    newVideo.name = req.body.name;
    newVideo.order = req.body.order;

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

export const updateVideo = catchAsync(async (req: Request, res: Response) => {
  try {
    const videoId = +req.params.id;
    const newOrder = +req.body.order;
    const existingTopic = await topicRepo.findOneBy({ id: req.body?.topicId });

    if (!existingTopic) throw new AppErrorUtil(400, "Unable to find topic");
    const isNameInUse = await videoRepo
      .createQueryBuilder("video")
      .where("video.name = :name AND video.id != :videoId", {
        name: req.body.name,
        videoId: videoId,
      })
      .getOne();
    if (isNameInUse)
      throw new AppErrorUtil(400, "Topic with this name already exist");

    const existingVideo = await videoRepo.findOneBy({ id: videoId });
    if (!existingVideo) {
      throw new AppErrorUtil(400, "Video not found");
    }
    const videoFile = `${req.secure ? "https" : "http"}://${req.get(
      "host"
    )}/medias/${req.file?.filename}`;

    if (newOrder !== existingVideo.order) {
      // Video order is being changed

      // Find other videos with the new order
      const isVideoWithSameOrderExist = await videoRepo.findOneBy({
        id: newOrder,
      });
      //   if (isVideoWithSameOrderExist) {
      //   }
      const videoAfterSameOrder = await videoRepo.find({
        where: { order: MoreThanOrEqual(newOrder) },
        order: { order: "ASC" },
      });
      console.log("testVideo", videoAfterSameOrder);
      if (videoAfterSameOrder) throw new AppErrorUtil(400, "hello");

      // Update the order of the current video
      existingVideo.order = newOrder;
      existingVideo.name = req.body.name;
      existingVideo.videoPath = videoFile;
      existingVideo.topic = existingTopic;

      // Increment the order of other videos with the same order
      let incrementOrder = newOrder + 1;
      for (const video of videoAfterSameOrder) {
        if (video.id !== videoId) {
          video.order = incrementOrder;
          incrementOrder++;
          await videoRepo.save(video);
        }
      }
    } else {
      // Video order is not being changed
      // Simply update the video
      existingVideo.order = newOrder;
    }

    // const videosWithSameOrder = await videoRepo.find({
    //   where: { order: req.body.order },
    //   order: { order: "ASC" },
    // });

    // const videoFile = `${req.secure ? "https" : "http"}://${req.get(
    //   "host"
    // )}/medias/${req.file?.filename}`;
    // const newVideo = new Videos();
    // newVideo.name = req.body.name;
    // newVideo.order = req.body.order;

    // newVideo.videoPath = videoFile;
    // newVideo.topic = existingTopic;
    const result = await videoRepo.save(existingVideo);
    if (!result)
      throw new AppErrorUtil(400, "Unable to update video,please try again");
    return res
      .status(200)
      .json({ message: " Video added successfully", result });
  } catch (err) {
    throw new AppErrorUtil(400, err.message);
  }
});
