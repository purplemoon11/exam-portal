import { Request, Response } from "express";
import { catchAsync } from "../../../utils/error-handler/catchAsync";
import ormConfig from "../../../../config/ormConfig";
import { Course } from "../../../entity/admin/Master-Data/course.entity";
import AppErrorUtil from "../../../utils/error-handler/appError";
import { Cluster } from "../../../entity/admin/Master-Data/cluster.entity";
import { Country } from "../../../entity/country.entity";

const clusterRepo = ormConfig.getRepository(Cluster);
const courseRepo = ormConfig.getRepository(Course);
const countryRepo = ormConfig.getRepository(Country);

export const createCourse = catchAsync(async (req: Request, res: Response) => {
  try {
    console.log("jfj");
    const existingCourse = await courseRepo.findOneBy({ code: req.body?.code });
    if (existingCourse)
      throw new AppErrorUtil(400, "Course with the given code already exist");
    const cluster = await clusterRepo.findOne({
      where: { cluster_name: req.body.clusterName },
    });
    console.log(cluster);
    let exiCountry: Country = null;
    if (req.body.countryName) {
      exiCountry = await countryRepo.findOne({
        where: { country_name: req.body.countryName },
      });
      console.log(exiCountry);
    }
    const courseFile = `${req.secure ? "https" : "http"}://${req.get(
      "host"
    )}/medias/${req.file?.filename}`;
    const newCourse = new Course();
    newCourse.nameNepali = req.body.nameNepali;
    newCourse.nameEnglish = req.body.nameEnglish;
    newCourse.code = req.body.code;
    newCourse.duration = req.body.duration;
    newCourse.descriptionEnglish = req.body.descriptionEnglish;
    newCourse.descriptionNepali = req.body.descriptionNepali;
    newCourse.courseFile = courseFile;
    if (exiCountry) newCourse.country = exiCountry;
    newCourse.cluster = cluster;

    const result = await courseRepo.save(newCourse);
    if (!result)
      return res
        .status(500)
        .json({ message: "Unable to create cluster,Please try again" });
    return res
      .status(200)
      .json({ message: "Course created successfully", result });
  } catch (err: any) {
    throw new AppErrorUtil(400, err.message);
  }
});

export const updateCourse = catchAsync(async (req: Request, res: Response) => {
  try {
    const courseId = +req.params.id;
    const existingCourse = await courseRepo.findOneBy({ id: courseId });
    const cluster = await clusterRepo.findOne({
      where: { cluster_name: req.body.clusterName },
    });
    let exiCountry: Country = null;
    if (req.body.countryName) {
      exiCountry = await countryRepo.findOne({
        where: { country_name: req.body.countryName },
      });
    }

    if (!existingCourse) {
      throw new AppErrorUtil(404, "Course not found");
    }
    const courseFile = `${req.secure ? "https" : "http"}://${req.get(
      "host"
    )}/medias/${req.file?.filename}`;
    existingCourse.nameNepali = req.body.nameNepali;
    existingCourse.nameEnglish = req.body.nameEnglish;
    existingCourse.duration = req.body.duration;
    existingCourse.descriptionEnglish = req.body.descriptionEnglish;
    existingCourse.descriptionNepali = req.body.descriptionNepali;
    existingCourse.courseFile = courseFile;
    if (exiCountry) existingCourse.country = exiCountry;
    existingCourse.cluster = cluster;

    const result = await courseRepo.save(existingCourse);

    if (!result) {
      return res
        .status(500)
        .json({ message: "Unable to update course, please try again" });
    }

    return res
      .status(200)
      .json({ message: "Course updated successfully", result });
  } catch (err) {
    throw new AppErrorUtil(400, err.message);
  }
});

export const deleteCourse = catchAsync(async (req: Request, res: Response) => {
  try {
    const courseId = +req.params.id;
    const existingCourse = await courseRepo.findOneBy({ id: courseId });

    if (!existingCourse) {
      throw new AppErrorUtil(404, "Course not found");
    }

    await courseRepo.remove(existingCourse);

    return res.status(200).json({ message: "Course deleted" });
  } catch (err) {
    throw new AppErrorUtil(400, err.message);
  }
});

export const getAllCourses = catchAsync(async (req: Request, res: Response) => {
  try {
    const courses = await courseRepo
      .createQueryBuilder("course")
      .leftJoinAndSelect("course.country", "country")
      .leftJoinAndSelect("course.cluster", "cluster")
      .loadRelationCountAndMap("course.totalSessions", "course.session")
      .getMany();

    return res.status(200).json({ courses });
  } catch (err) {
    throw new AppErrorUtil(400, err.message);
  }
});

export const getCourseById = async (req: Request, res: Response) => {
  try {
    const courseId = +req.params.id;

    const course = await courseRepo.findOneBy({ id: courseId });

    if (!course) {
      throw new AppErrorUtil(404, "Course not found");
    }

    return res.status(200).json({ course });
  } catch (err) {
    throw new AppErrorUtil(400, err.message);
  }
};
