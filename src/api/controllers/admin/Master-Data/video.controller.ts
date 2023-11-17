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
    const { topicId, order } = req.body;
    let existingTopic: Topic;
    topicId
      ? (existingTopic = await topicRepo.findOneBy({ id: topicId }))
      : null;
    // console.log(existingTopic);
    const isVideoOrderExist = await videoRepo.findOne({
      where: { order: order },
    });
    const isVideoNameExist = await videoRepo.findOne({
      where: { name: req.body?.name },
    });
    if (!existingTopic) throw new AppErrorUtil(400, "Unable to find topic");
    if (isVideoNameExist)
      throw new AppErrorUtil(40, "Video with this name already exist");
    const videoFile = `${req.secure ? "https" : "http"}://${req.get(
      "host"
    )}/medias/${req.file?.filename}`;
    if (isVideoOrderExist) {
      // If the order is taken, adjust the order for this video and others
      const videosAfterSameOrder = await videoRepo.find({
        where: { order: MoreThanOrEqual(order) },
        order: { order: "ASC" },
      });
      console.log("after", videosAfterSameOrder);

      let incrementOrder: number = +order + 1;
      // await Promise.all(
      //   videosAfterSameOrder.map(async (video, index) => {
      //     video.order = order + index + 1;
      //     await videoRepo.save(video);
      //   })
      // );

      // for (let i = 0; i < videosAfterSameOrder.length; i++) {
      //   const video = videosAfterSameOrder[i];
      //   video.order = order + i + 1;
      //   await videoRepo.save(video);
      // }

      for (const video of videosAfterSameOrder) {
        // video.order += 1;
        // await videoRepo.save(video);
        video.order = incrementOrder;
        await videoRepo.save(video);
        incrementOrder += 1;
      }
    }
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
      throw new AppErrorUtil(400, "Video with this name already exist");

    const existingVideo = await videoRepo.findOneBy({ id: videoId });
    if (!existingVideo) {
      throw new AppErrorUtil(400, "Video not found");
    }
    const videoFile = `${req.secure ? "https" : "http"}://${req.get(
      "host"
    )}/medias/${req.file?.filename}`;
    const isVideoWithSameOrderExist = await videoRepo.findOneBy({
      order: newOrder,
    });

    if (newOrder !== existingVideo.order && isVideoWithSameOrderExist) {
      console.log("inside order handlig block");
      const videoAfterSameOrder = await videoRepo.find({
        where: { order: MoreThanOrEqual(newOrder) },
        order: { order: "ASC" },
      });
      console.log("testVideo", videoAfterSameOrder);

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
      existingVideo.order = newOrder;
      existingVideo.name = req.body.name;

      existingVideo.videoPath = videoFile;
      existingVideo.topic = existingTopic;
    }

    const result = await videoRepo.save(existingVideo);
    if (!result)
      throw new AppErrorUtil(400, "Unable to update video,please try again");
    return res
      .status(200)
      .json({ message: " Video updated successfully", result });
  } catch (err) {
    throw new AppErrorUtil(400, err.message);
  }
});

export const deleteVideo = catchAsync(async (req: Request, res: Response) => {
  try {
    const videoId = +req.params.id;
    const existingVideo = await videoRepo.findOneBy({ id: videoId });

    if (!existingVideo) {
      throw new AppErrorUtil(404, "Video not found");
    }

    await videoRepo.remove(existingVideo);

    return res.status(200).json({ message: "Video deleted" });
  } catch (err) {
    throw new AppErrorUtil(400, err.message);
  }
});
