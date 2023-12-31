import { Request, Response, NextFunction } from "express";
import { TestExamGroup } from "../entity/testExamGroup.entity";
import ormConfig from "../../config/ormConfig";
import logger from "../../config/logger";
import { userCountryGetByUserId } from "../services/userCountry.service";
import {
  testGroupGetByNameUser,
  testGroupUpdate,
} from "../services/testExamGroup.service";
import { ExamSetting } from "../entity/examSetting.entity";
import { User } from "../entity/user.entity";
import { CandidateExamAttempt } from "../entity/candidateExam.entity";

const testExamGroupRepo = ormConfig.getRepository(TestExamGroup);
const examSettingRepo = ormConfig.getRepository(ExamSetting);
const userRepo = ormConfig.getRepository(User);

interface TestExamGroupRequest extends Request {
  user: {
    id: string;
  };
}

export const createTestExamGroup = async (
  req: TestExamGroupRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = parseInt(req.user.id);

    const country = await userCountryGetByUserId(userId);

    if (!country) {
      return res.status(400).json({ message: "Please select country" });
    }

    const country_name = country?.country?.country_name;

    const isTestGroupExists = await testGroupGetByNameUser(
      userId,
      country_name + " test"
    );

    const examSetting = await examSettingRepo.find();

    const attemptNo = examSetting[0]?.exam_frequency || 2;

    if (isTestGroupExists && isTestGroupExists.total_attempts < attemptNo) {
      const testGroup = await testGroupUpdate(
        {
          exam_group_date: new Date(),
          total_attempts: isTestGroupExists.total_attempts + 1,
        },
        isTestGroupExists
      );
      return res.json({ data: testGroup });
    }

    let testGroupData = new TestExamGroup();

    testGroupData.cand_id = userId;
    testGroupData.test_name = country_name + " test";
    testGroupData.exam_group_date = new Date();
    testGroupData.total_attempts = 1;

    let testGroup = await testExamGroupRepo.save(testGroupData);

    logger.info("Test grou p created");
    return res
      .status(201)
      .json({ data: testGroup, message: "Test group created" });
  } catch (err) {
    logger.error(err.message);
    res.status(500).send(err);
  }
};

export const getTestExamGroup = async (
  req: TestExamGroupRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = parseInt(req.user.id);
    const testExamGroup = await testExamGroupRepo
      .createQueryBuilder("testExamGroup")
      .leftJoinAndSelect("testExamGroup.testExam", "testExam")
      .leftJoinAndSelect("testExam.examCand", "examCand")
      .leftJoinAndSelect("examCand.question", "question")
      .leftJoinAndSelect("question.answers", "answers")
      .where("testExamGroup.cand_id = :userId", { userId })
      .getMany();

    res.json({ data: testExamGroup });
  } catch (err) {
    logger.error(err);
    res.status(500).send(err);
  }
};

// export const getTestExamDetails = async (
//   req: TestExamGroupRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const userId = +req.user.id;
//     const testExamGroup = await userRepo
//       .createQueryBuilder("user")
//       .leftJoinAndSelect("user.userCountry", "UC")
//       .leftJoinAndSelect("UC.country", "country")

//       .leftJoinAndSelect("user.candidateExam", "CE")
//       .leftJoinAndSelect("CE.test", "testExam")
//       .leftJoinAndSelect("testExam.testGroup", "testGroup")
//       .where("user.id = :userId", { userId })
//       .getMany();

//     const extractedData = testExamGroup.map((user) => {
//       // const candidateExams = user.candidateExam as Array<CandidateExamAttempt>;
//       const latestTest = user.candidateExam.reduce((latest: any, test: any) => {
//         return latest.test?.test_date > test.test?.test_date ? latest : test;
//       }, {});

//       return {
//         userId: user.id,
//         userFullName: user.fullname,
//         userCountryName: user.userCountry[0]?.country,
//         testGroupId: latestTest?.test?.testGroup,
//         testId: latestTest?.test?.id,
//         latestTestStatus: latestTest?.test?.test_status,
//       };
//     });

//     res.json({ data: extractedData });
//   } catch (err) {
//     logger.error(err);
//     res.status(500).send(err);
//   }
// };

export const getTestExamGroupById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    const testExamGroup = await testExamGroupRepo
      .createQueryBuilder("testExamGroup")
      .leftJoinAndSelect("testExamGroup.testExam", "testExam")
      .leftJoinAndSelect("testExam.examCand", "examCand")
      .leftJoinAndSelect("examCand.question", "question")
      .leftJoinAndSelect("question.answers", "answers")
      .where("testExamGroup.id = :id", { id })
      .getOne();

    res.json({ data: testExamGroup });
  } catch (err) {
    logger.error(err);
    res.status(500).send(err);
  }
};
