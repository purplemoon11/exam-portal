import corn from "node-cron";
import logger from "../../config/logger";
import { ExamSetting } from "../entity/examSetting.entity";
import { ESubmitType, TestExamination } from "../entity/testExamination.entity";
import ormConfig from "../../config/ormConfig";
import { CandidateExamAttempt } from "../entity/candidateExam.entity";
import { testExamUpdate } from "./testExamination.service";

export const setupAutoSubmitJOb = () => {
  corn.schedule("*/1 * * * *", async () => {
    try {
      await autoSubmitJob();
    } catch (err) {
      logger.error(`Error running auto-submit job:${err.message}`);
    }
  });
};

// function intervalToMinutes(interval: any): number {
//   // Access the 'minutes' property directly
//   return interval.minutes || 0;
// }
export function intervalToMinutes(interval: any): number {
  const minutes = interval.minutes || 0;
  const hours = interval.hours || 0;
  const days = interval.days || 0;

  const totalMinutes = minutes + hours * 60 + days * 24 * 60;

  return totalMinutes;
}

export const autoSubmitJob = async () => {
  const examsToAutoSubmit = await findExamsToAutoSubmit();

  for (const exam of examsToAutoSubmit) {
    await autoSubmitExam(exam);
  }
};

export const findExamsToAutoSubmit = async () => {
  try {
    const duration = await ExamSetting.find();
    const test = duration[0].exam_duration;
    const examDurationInMinutes = intervalToMinutes(duration[0].exam_duration);
    console.log(examDurationInMinutes);
    const testDate = new Date();
    testDate.setMinutes(testDate.getMinutes() - examDurationInMinutes);

    const examDetails = await TestExamination.createQueryBuilder("exam")
      .where("exam.test_date <:allowedDate", {
        allowedDate: testDate,
      })
      .andWhere("exam.test_status=:status", { status: "Ongoing" })
      .getMany();
    return examDetails;
  } catch (err) {
    logger.error(`Error finding unsubmitted ongoing exam :${err.message}`);
  }
};

export const autoSubmitExam = async (exam: TestExamination) => {
  const testExamData = await TestExamination.findOne({
    where: { id: exam.id },
  });

  if (!testExamData) {
    logger.error("Test exam not found");
  }

  const resultTest = await TestExamination.createQueryBuilder("testExam")
    .leftJoinAndSelect("testExam.examCand", "examCand")
    .where("testExam.id = :id", { id: exam.id })
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

  const examStatus = correctAnswers >= requiredCorrectAnswers ? "Pass" : "Fail";
  const setting = await ExamSetting.find();
  const time = setting[0].exam_duration;

  const testExam = await testExamUpdate(
    {
      test_status: examStatus,
      time_taken: time || "20:00",
      submitType: ESubmitType.AUTO,
      isSubmitted: true,
    },
    testExamData
  );
  return testExam;
};
