import { Request, Response } from "express";
import { catchAsync } from "../../../utils/error-handler/catchAsync";
import ormConfig from "../../../../config/ormConfig";
import { Course } from "../../../entity/admin/Master-Data/course.entity";
import AppErrorUtil from "../../../utils/error-handler/appError";
import { Cluster } from "../../../entity/admin/Master-Data/cluster.entity";
import { Country } from "../../../entity/country.entity";
import { Session } from "../../../entity/admin/Master-Data/session.entity";
import { ILike, In } from "typeorm";
import { query } from "winston";

const clusterRepo = ormConfig.getRepository(Cluster);
const courseRepo = ormConfig.getRepository(Course);
const countryRepo = ormConfig.getRepository(Country);
const sessionRepo = ormConfig.getRepository(Session);

export const createCourse = catchAsync(async (req: Request, res: Response) => {
  try {
    console.log(req.body.countryNames);
    const existingCourse = await courseRepo.findOneBy({ code: req.body?.code });
    if (existingCourse)
      throw new AppErrorUtil(400, "Course with the given code already exist");
    const cluster = await clusterRepo.findOne({
      where: { cluster_name: req.body.clusterName },
    });
    console.log(cluster);
    const countries = req.body.countryNames;
    console.log(countries);
    let existingCountries: Country[] = [];
    if (req.body.countryNames && req.body.countryNames.length > 0) {
      console.log("inside here");
      const CountryNames = Array.isArray(req.body.countryNames)
        ? req.body.countryNames
        : [req.body.countryNames];
      // Find multiple countries based on the array of country names
      existingCountries = await countryRepo.find({
        where: { country_name: In(CountryNames) },
      });

      console.log("testt", existingCountries);
    }
    // let exiCountry: Country = null;
    // if (req.body.countryName) {
    //   exiCountry = await countryRepo.findOne({
    //     where: { country_name: req.body.countryName },
    //   });
    // }

    const courseFile = `${req.secure ? "https" : "http"}://${req.get(
      "host"
    )}/medias/${req.file?.filename}`;
    const newCourse = new Course();
    newCourse.nameNepali = req.body.nameNepali;
    newCourse.nameEnglish = req.body.nameEnglish;
    newCourse.code = req.body.code;
    newCourse.isPopular = Boolean(req.body.isPopular);
    newCourse.duration = req.body.duration;
    newCourse.descriptionEnglish = req.body.descriptionEnglish;
    newCourse.descriptionNepali = req.body.descriptionNepali;
    if (req.file) {
      newCourse.courseFile = courseFile;
    }
    if (existingCountries) newCourse.countries = existingCountries;
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
    console.log(req.body.countryNames);
    const courseId = +req.params.id;
    const existingCourse = await courseRepo.findOneBy({ id: courseId });
    const cluster = await clusterRepo.findOne({
      where: { cluster_name: req.body.clusterName },
    });
    console.log(cluster);
    const isCodeInUse = await courseRepo
      .createQueryBuilder("course")
      .where("course.code =:code AND  course.id!=:courseId", {
        code: req.body.code,
        courseId: courseId,
      })
      .getOne();
    if (isCodeInUse)
      throw new AppErrorUtil(400, "Course with this code already exist");

    if (!existingCourse) {
      throw new AppErrorUtil(404, "Course not found");
    }
    const existingCountries = existingCourse.countries;
    console.log("exiii", existingCountries);

    const newCountryNames = Array.isArray(req.body.countryNames)
      ? req.body.countryNames
      : [req.body.countryNames];
    const newCountries = await countryRepo.find({
      where: { country_name: In(newCountryNames) },
    });
    console.log("newww", newCountries);

    // const countriesToRemove = existingCountries.filter(
    //   (country) => !newCountryNames.includes(country.country_name)
    // );

    // console.log("remove", countriesToRemove);
    // const countriesToAdd = newCountries.filter(
    //   (country) => !existingCountries.some((c) => c.id === country.id)
    // );

    // console.log("adddd", countriesToAdd);

    // const load = await courseRepo
    //   .createQueryBuilder()
    //   .relation(Course, "countries")
    //   .of(existingCourse)
    //   .loadMany();

    // console.log("load", load);

    await Promise.all(
      existingCountries.map(async (countryToRemove) => {
        await courseRepo
          .createQueryBuilder("course")
          .leftJoin("course.countries", "countries")
          .where("countries.id=:cId", { cId: countryToRemove.id })
          .execute();
      })
    );

    const courseFile = `${req.secure ? "https" : "http"}://${req.get(
      "host"
    )}/medias/${req.file?.filename}`;
    existingCourse.nameNepali = req.body.nameNepali;
    existingCourse.nameEnglish = req.body.nameEnglish;
    existingCourse.duration = req.body.duration;
    existingCourse.code = req.body.code;
    existingCourse.isPopular = Boolean(req.body.isPopular);
    existingCourse.descriptionEnglish = req.body.descriptionEnglish;
    existingCourse.descriptionNepali = req.body.descriptionNepali;
    if (req.file) existingCourse.courseFile = courseFile;
    if (newCountries) existingCourse.countries = newCountries;
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
    const { page = 1, pageSize = 5 } = req.query;

    const courses = courseRepo
      .createQueryBuilder("course")
      .leftJoinAndSelect("course.countries", "countries")
      .leftJoinAndSelect("course.cluster", "cluster")
      .leftJoinAndSelect("course.session", "session")
      .leftJoin("session.topic", "topics")
      .loadRelationCountAndMap("course.totalTopic", "course.session.topic")

      .loadRelationCountAndMap("course.totalSessions", "course.session");

    const totalCount = await courses.getCount();
    const totalPages = Math.ceil(+totalCount / +pageSize);

    const coursesData = await courses
      .take(+pageSize)
      .skip((+page - 1) * +pageSize)
      .getMany();
    const data = {
      coursesData,
      totalCount,
      currentPage: page,
      totalPages,
    };

    return res.status(200).json({ data });
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

export const getSessionsByCourseId = catchAsync(
  async (req: Request, res: Response) => {
    try {
      const { page = 1, pageSize = 5 } = req.query;
      const courseId = +req.query.id;
      const queryBuilder = sessionRepo
        .createQueryBuilder("session")
        // .leftJoin("session.course", "course")
        .loadRelationCountAndMap("session.totaltopics", "session.topic")
        .where("session.course=:id", { id: courseId });

      const totalCount = await queryBuilder.getCount();
      const sessions = await queryBuilder
        .take(+pageSize)
        .skip((+page - 1) * +pageSize)
        .getMany();

      const totalPages = Math.ceil(+totalCount / +pageSize);
      const data = {
        sessions,
        totalCount,
        totalPages,
        currentPage: page,
      };

      return res.status(200).json({ data });
    } catch (err) {
      throw new AppErrorUtil(400, err.message);
    }
  }
);

export const getCoursesByCluster = catchAsync(
  async (req: Request, res: Response) => {
    try {
      const { page = 1, pageSize = 5 } = req.query;

      const clusterName = req.query.clusterName;
      const cluster = await clusterRepo.findOne({
        where: { cluster_name: clusterName as string },
      });
      if (!cluster) {
        return res.status(404).json({ message: "Unable to find cluster" });
      }
      const queryBuilder = courseRepo
        .createQueryBuilder("course")
        // .leftJoin("session.course", "course")
        // .loadRelationCountAndMap("session.totaltopics", "session.topic")
        .where("course.cluster=:id", { id: cluster.id });

      const totalCount = await queryBuilder.getCount();
      const totalPages = Math.ceil(+totalCount / +pageSize);

      const courses = await queryBuilder
        .take(+pageSize)
        .skip((+page - 1) * +pageSize)
        .getMany();
      const data = {
        courses,
        totalCount,
        totalPages,
        currentPage: page,
      };

      return res.status(200).json({ data });
    } catch (err) {
      throw new AppErrorUtil(400, err.message);
    }
  }
);

// export const createPopularCourse = catchAsync(
//   async (req: Request, res: Response) => {
//     try {
//       console.log(req.body.countryNames);
//       const existingCourse = await courseRepo.findOneBy({
//         code: req.body?.code,
//       });
//       if (existingCourse)
//         throw new AppErrorUtil(400, "Course with the given code already exist");
//       const cluster = await clusterRepo.findOne({
//         where: { cluster_name: req.body.clusterName },
//       });
//       console.log(cluster);
//       const countries = req.body.countryNames;
//       console.log(countries);
//       let existingCountries: Country[] = [];
//       if (req.body.countryNames && req.body.countryNames.length > 0) {
//         console.log("inside here");
//         const CountryNames = Array.isArray(req.body.countryNames)
//           ? req.body.countryNames
//           : [req.body.countryNames];
//         // Find multiple countries based on the array of country names
//         existingCountries = await countryRepo.find({
//           where: { country_name: In(CountryNames) },
//         });

//         console.log("testt", existingCountries);
//       }

//       const courseFile = `${req.secure ? "https" : "http"}://${req.get(
//         "host"
//       )}/medias/${req.file?.filename}`;
//       const newCourse = new Course();
//       newCourse.nameNepali = req.body.nameNepali;
//       newCourse.nameEnglish = req.body.nameEnglish;
//       newCourse.code = req.body.code;
//       newCourse.isPopular = true;
//       newCourse.duration = req.body.duration;
//       newCourse.descriptionEnglish = req.body.descriptionEnglish;
//       newCourse.descriptionNepali = req.body.descriptionNepali;
//       if (req.file) {
//         newCourse.courseFile = courseFile;
//       }
//       if (existingCountries) newCourse.countries = existingCountries;
//       newCourse.cluster = cluster;

//       const result = await courseRepo.save(newCourse);
//       if (!result)
//         return res
//           .status(500)
//           .json({ message: "Unable to create cluster,Please try again" });
//       return res
//         .status(200)
//         .json({ message: "Course created successfully", result });
//     } catch (err: any) {
//       throw new AppErrorUtil(400, err.message);
//     }
//   }
// );

export const getPopularCourse = async (req: Request, res: Response) => {
  try {
    const { page = 1, pageSize = 5 } = req.query;
    const courses = await courseRepo.find({ where: { isPopular: true } });

    if (courses.length === 0 || !courses) {
      // throw new AppErrorUtil(404, "No any popular courses found");
      return res.status(404).json({ message: "No popular courses found" });
    }

    const [popularCourses, count] = await courseRepo
      .createQueryBuilder("course")
      .leftJoinAndSelect("course.countries", "countries")
      .leftJoinAndSelect("course.cluster", "cluster")
      .leftJoinAndSelect("course.session", "session")
      .leftJoin("session.topic", "topics")
      .loadRelationCountAndMap("course.totalTopic", "course.session.topic")

      .loadRelationCountAndMap("course.totalSessions", "course.session")
      .where("course.isPopular=:flag", { flag: true })
      .take(+pageSize)
      .skip((+page - 1) * +pageSize)
      .getManyAndCount();

    return res.status(200).json({ popularCourses });
  } catch (err) {
    // throw new AppErrorUtil(400, err.message);
    return res.status(400).json(err.message);
  }
};
