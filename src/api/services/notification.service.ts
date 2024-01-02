import { Notification } from "../entity/notification.entity";
import ormConfig from "../../config/ormConfig";

const notificationRepo = ormConfig.getRepository(Notification);

export const notificationCreate = async (notificationData: object) => {
  const notification = await notificationRepo.save(notificationData);

  return notification;
};

export const notificationGet = async () => {
  const notification = await notificationRepo.findAndCount();

  return notification;
};

export const notificationGetById = async (notificationId: number) => {
  const notification = await notificationRepo.findOneBy({ id: notificationId });

  return notification;
};

export const notificationUpdate = async (
  updateData: any,
  notificationData: any
) => {
  const notification = notificationRepo.merge(notificationData, updateData);

  await notificationRepo.save(notification);
  return notification;
};

export const notificationDelete = async (notificationId: number) => {
  const notification = await notificationRepo.findOne({
    where: { id: notificationId },
  });

  return await notificationRepo.remove(notification);
};
