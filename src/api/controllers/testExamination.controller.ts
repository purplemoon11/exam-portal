import { Request, Response, NextFunction } from "express";
import {
  testExamCreate,
  testExamGetByUser,
  testExamGetById,
  testExamUpdate,
  testExamDelete,
} from "../services/testExamination.service";
import { TestExamination } from "../entity/testExamination.entity";
import { Transaction } from "../entity/transaction.entity";
import logger from "../../config/logger";
import { userCountryGetByUserId } from "../services/userCountry.service";
import ormConfig from "../../config/ormConfig";
import { TestExamGroup } from "../entity/testExamGroup.entity";
import { CandidateExamAttempt } from "../entity/candidateExam.entity";
import { jobService } from "../services/index.service";
import { ExamSetting } from "../entity/examSetting.entity";
import { intervalToMinutes } from "../services/jobScheduler.service";
import { User } from "../entity/user.entity";

const testExamRepo = ormConfig.getRepository(TestExamination);
const testExamGroupRepo = ormConfig.getRepository(TestExamGroup);
const transactionRepo = ormConfig.getRepository(Transaction);

interface TestExamRequest extends Request {
  user: {
    id: string;
  };
}

export const createTestExam = async (
  req: TestExamRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { test_group_id } = req.body;
    const userId = parseInt(req.user.id);

    const isOngoingTestExist = await TestExamination.findOne({
      where: {
        candidate: { id: userId },
        test_status: "Ongoing",
      },
    });
    if (isOngoingTestExist) {
      return res
        .status(400)
        .json({ message: "Ongoing  exam exist for this user" });
    }

    const testGroup = await testExamGroupRepo.findOne({
      where: { id: test_group_id },
    });

    if (!testGroup) {
      return res.status(400).json({ message: "No test group found" });
    }

    const transactionData = await transactionRepo.findOne({
      where: { cand_id: userId },
      order: { created_date: "DESC" },
    });

    const testExamData = new TestExamination();

    testExamData.cand_id = userId;
    testExamData.test_date = new Date();
    testExamData.test_group_id = test_group_id;
    testExamData.time_taken = "";
    testExamData.payment_id = transactionData.id;
    testExamData.test_status = "Ongoing";

    const testExam = await testExamCreate(testExamData);

    logger.info("Test exam created");
    return res
      .status(201)
      .json({ data: testExam, message: "Test exam created" });
  } catch (err) {
    logger.error(err);
    res.status(500).send(err);
  }
};

export const getTestExamByUser = async (
  req: TestExamRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = parseInt(req.user.id);
    const testExam = await testExamGetByUser(userId);

    res.json({ data: testExam });
  } catch (err) {
    logger.error(err);
    res.status(500).send(err);
  }
};

export const getTestExamById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    const testExam = await testExamGetById(id);

    res.json({ data: testExam });
  } catch (err) {
    logger.error(err);
    res.status(500).send(err);
  }
};

export const updateTestStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    const { time_taken } = req.body;

    const testExamData = await testExamRepo.findOne({ where: { id } });

    if (!testExamData) {
      return res.status(400).json({ message: "Test exam data not found" });
    }

    const resultTest = await testExamRepo
      .createQueryBuilder("testExam")
      .leftJoinAndSelect("testExam.examCand", "examCand")
      .where("testExam.id = :id", { id })
      .getOne();

    let examAttempts: CandidateExamAttempt[];
    examAttempts = resultTest.examCand;

    const answer = JSON.parse(resultTest.testExamDetails);

    console.log("testExamData", answer);
    const requiredCorrectAnswers: number = Math.ceil(answer.length / 2);
    console.log("requiredCorrect", requiredCorrectAnswers);

    // const requiredCorrectAnswers: number = Math.ceil(examAttempts.length / 2);

    const correctAnswers = examAttempts.filter(
      (exam: CandidateExamAttempt) => exam.isCorrect
    ).length;

    const examStatus =
      correctAnswers >= requiredCorrectAnswers ? "Pass" : "Fail";

    const testExam = await testExamUpdate(
      {
        test_status: examStatus,
        time_taken,
      },
      testExamData
    );

    return res.json({ data: testExam, message: "Test exam updated" });
  } catch (err) {
    logger.error(err.message);
    res.status(500).send(err);
  }
};

export const deleteTestExam = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    const testExam = await testExamGetById(id);

    if (!testExam) {
      return res.status(404).json({ message: "Test exam not found" });
    }

    await testExamDelete(id);

    return res.json({ message: "Test exam deleted" });
  } catch (err) {
    logger.error(err);
    res.status(500).send(err);
  }
};

export const getTestExamDetails = async (
  req: TestExamRequest,
  res: Response
) => {
  try {
    const userId = +req.user.id;
    console.log(userId);

    const examDetails = await testExamRepo
      .createQueryBuilder("exam")
      .leftJoinAndSelect("exam.candidate", "candidate")
      .leftJoinAndSelect("candidate.userCountry", "UC")
      .leftJoinAndSelect("UC.country", "country")
      .leftJoinAndSelect("exam.testGroup", "testGroup")
      .where("candidate.id = :userId", { userId })
      .orderBy("exam.test_date", "DESC")
      .addOrderBy("UC.date", "DESC")
      .getMany();

    if (!examDetails || examDetails.length === 0) {
      return res
        .status(404)
        .json({ message: "No exam details found for the user" });
    }

    const data = {
      userId: examDetails[0].candidate.id,
      userFullName: examDetails[0].candidate.fullname,
      userCountry: examDetails[0].candidate?.userCountry[0],
      testGroup: examDetails[0]?.testGroup,
      testId: examDetails[0].id,
      latestTestStatus: examDetails[0]?.test_status,
    };

    return res.status(200).json({ data });
  } catch (err: any) {
    console.log("err", err);
    return res.json({ message: err.message });
  }
};

export const autoSubmitJob = async (req: Request, res: Response) => {
  try {
    console.log("testing");
    const result = await jobService.findExamsToAutoSubmit();
    return res.status(200).json({ message: `details:${result}` });
  } catch (err) {
    return res.status(500).json({ message: `Error:${err.message}` });
  }
};

export const checkExamExpiry = async (req: Request, res: Response) => {
  try {
    const testId = +req.params.id;
    const duration = await ExamSetting.find();
    const test = duration[0].exam_duration;
    const examDurationInMinutes = intervalToMinutes(duration[0].exam_duration);
    const allowedDate = new Date();
    allowedDate.setMinutes(allowedDate.getMinutes() - examDurationInMinutes);

    const testExam = await TestExamination.findOne({
      where: {
        id: testId,
      },
    });
    // let isExpired: Boolean = false;
    const testDate = testExam.test_date;
    const data = {
      isExpired: false,
      isSubmitted: testExam.isSubmitted,
      submitType: testExam.submitType,
    };
    if (testDate < allowedDate) {
      data.isExpired = true;
    }
    return res.status(200).json({ message: "Current exam status is:", data });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};
