import { Request, Response, NextFunction } from "express";
import {
  examQuestionCreate,
  examQuestionGet,
  examQuestionGetById,
  examQuestionUpdate,
  examQuestionDelete,
  IExamQuestion,
} from "../services/question.service";
import { Cluster } from "../entity/admin/Master-Data/cluster.entity";
import { ExamQuestion } from "../entity/question.entity";
import ormConfig from "../../config/ormConfig";
import logger from "../../config/logger";
import { ExamAnswer } from "../entity/answer.entity";
import { Country } from "../entity/country.entity";
import {
  examAnswerCreate,
  examAnswerDelete,
  examAnswerDeleteByQueId,
  examAnswerGetById,
  examAnswerGetByQueId,
  examAnswerUpdate,
} from "../services/answer.service";
import { ExamQuestionCountry } from "../entity/questionCountry.entity";
import {
  examQuestionCountryCreate,
  examQuestionCountryDelete,
  examQuestionCountryDeleteByQueId,
  examQuestionCountryGetById,
  examQuestionCountryGetByQueId,
  examQuestionCountryUpdate,
} from "../services/questionCountry.service";
import { userCountryGetByUserId } from "../services/userCountry.service";
import { TestExamination } from "../entity/testExamination.entity";

const examQuestionRepo = ormConfig.getRepository(ExamQuestion);
const clusterRepo = ormConfig.getRepository(Cluster);
const countryRepo = ormConfig.getRepository(Country);
const testExamRepo = ormConfig.getRepository(TestExamination);

interface QuestionRequest extends Request {
  user: {
    id: string;
  };
}

export const createExamQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { question_text, answers, countries, cluster_id } = req.body;

    let isCorrectAnsExists = false;
    for (let answer of answers) {
      if (answer.isCorrect) {
        isCorrectAnsExists = true;
        break;
      }
    }

    if (!isCorrectAnsExists) {
      return res
        .status(400)
        .json({ message: "Please choose one correct answer" });
    }

    const isExistsCluster = await clusterRepo.findOne({
      where: { id: cluster_id },
    });

    if (!isExistsCluster) {
      return res.status(404).json({ message: "Cluster not found" });
    }

    const questionData = new ExamQuestion();

    let fileType = "Others";
    if (req.files && req.files["media_file"]) {
      const media = req.files["media_file"][0].filename;
      const mime_type = req.files["media_file"][0].mimetype;

      let media_file = `${req.secure ? "https" : "http"}://${req.get(
        "host"
      )}/medias/${media}`;

      if (mime_type.startsWith("image")) {
        fileType = "Image";
      } else if (mime_type.startsWith("video")) {
        fileType = "Video";
      } else if (mime_type.startsWith("application")) {
        fileType = "Application";
      } else {
        fileType = "Others";
      }

      questionData.media_file = media_file;
    } else {
      questionData.media_file = "";
    }

    questionData.question_text = question_text;
    questionData.cluster = isExistsCluster;
    questionData.fileType = fileType;

    const question = await examQuestionCreate(questionData);

    for (let answer of answers) {
      const { answer_text, isCorrect } = answer;
      const answerData = new ExamAnswer();
      answerData.answer_text = answer_text;
      answerData.isCorrect = isCorrect;
      answerData.question = question;

      await examAnswerCreate(answerData);
    }

    if (countries && countries.length > 0) {
      for (let country of countries) {
        const { country_name } = country;
        const countryData = new ExamQuestionCountry();

        countryData.country_name = country_name;
        countryData.question = question;

        await examQuestionCountryCreate(countryData);
      }
    }

    logger.info("Question created successfully");

    res.status(201).json({
      question,
      message: "Question created successfully",
      file: fileType,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send(err);
  }
};

export const getExamQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;
    const questions = await examQuestionGet({
      page: Number(page),
      pageSize: Number(pageSize),
    });

    res.json({ data: questions });
  } catch (err) {
    logger.error(err);
    res.status(500).send(err);
  }
};

export const getExamQuestionForUser = async (
  req: QuestionRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = parseInt(req.user.id);

    const country = await userCountryGetByUserId(userId);

    if (!country) {
      return res.status(400).json({ message: "Please select country" });
    }
    const userTestExam = await testExamRepo.findOne({
      where: {
        candidate: { id: userId },
        test_status: "Ongoing",
      },
      order: {
        test_date: "DESC",
      },
    });
    console.log("userTest", userTestExam.testExamDetails);
    if (userTestExam.testExamDetails != null) {
      console.log("inside not null");
      const data = JSON.parse(userTestExam.testExamDetails);
      return res.status(200).json({ data });
    }

    const country_id = country?.country?.id;

    const countries = await countryRepo
      .createQueryBuilder("country")
      .leftJoinAndSelect("country.examSection", "examSection")
      .leftJoinAndSelect("examSection.clusterId", "cluster")
      .leftJoinAndSelect("cluster.examQuestions", "examQuestion")
      .leftJoinAndSelect("examQuestion.answers", "answers")
      .where("country.id = :id", { id: country_id })
      .andWhere("answers.answer_text IS NOT NULL")
      .andWhere("answers IS NOT NULL")
      .select([
        "country",
        "examSection",
        "cluster",
        "examQuestion",
        "answers.id",
        "answers.answer_text",
      ])
      .getOne();

    const result: any[] = [];

    countries?.examSection.forEach((section) => {
      const numberOfQuestions = section.noOfQuestions;

      const selectedQuestions: any[] = [];

      const examQuestions = section.clusterId["examQuestions"];

      if (examQuestions.length < 1) {
        return res.status(400).json({ message: "No questions available" });
      }

      examQuestions.forEach((examQue: any) => {
        const availableQuestions = examQuestions.length;

        if (availableQuestions <= numberOfQuestions) {
          selectedQuestions.push(examQue);
        } else {
          while (selectedQuestions.length < numberOfQuestions) {
            const randomIndex = Math.floor(Math.random() * availableQuestions);

            const selectedQuestion = examQuestions[randomIndex];

            if (!selectedQuestions.includes(selectedQuestion)) {
              selectedQuestions.push(selectedQuestion);
            }
          }
        }
      });

      result.push(...selectedQuestions);
    });

    userTestExam.testExamDetails = JSON.stringify(result);
    const savedData = await testExamRepo.save(userTestExam);
    if (!savedData && !savedData.testExamDetails) {
      return res.status(500).json({ message: "Unable to save exam data" });
    }
    return res.json({ data: result });
  } catch (err) {
    logger.error(err);
    res.status(500).send(err);
  }
};

export const getExamQuestionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    const examQuestion = await examQuestionGetById(id);

    if (!examQuestion) {
      return res.status(404).json({ message: "Exam question not found" });
    }

    res.json({ examQuestion });
  } catch (err) {
    logger.error(err);
    res.status(500).send(err);
  }
};

export const updateQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { question_text, answers, countries, cluster_id } = req.body;
    const id = parseInt(req.params.id);

    const question = await examQuestionRepo.findOne({
      where: { id },
    });

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const isExistsCluster = await clusterRepo.findOne({
      where: { id: cluster_id },
    });

    if (!isExistsCluster) {
      return res.status(404).json({ message: "Cluster not found" });
    }

    let questionData: Object;
    let media_file: string;
    let fileType = "Others";
    if (req.files && req.files["media_file"]) {
      const media = req.files["media_file"][0].filename;
      const mime_type = req.files["media_file"][0].mimetype;

      media_file = `${req.secure ? "https" : "http"}://${req.get(
        "host"
      )}/medias/${media}`;

      if (mime_type.startsWith("image")) {
        fileType = "Image";
      } else if (mime_type.startsWith("video")) {
        fileType = "Video";
      } else if (mime_type.startsWith("application")) {
        fileType = "Application";
      } else {
        fileType = "Others";
      }
    } else {
      media_file = "";
    }
    // if (req.files && req.files["media_file"]) {
    //   let media_file = req.files["media_file"][0].filename;
    //   media_file = `${req.secure ? "https" : "http"}://${req.get(
    //     "host"
    //   )}/images/${media_file}`;

    questionData = {
      question_text,
      cluster: isExistsCluster,
      media_file,
      fileType,
    };

    const questionUpdate = await examQuestionUpdate(questionData, question);

    console.log(req.body);

    for (const answer of answers) {
      const answerId = answer.id;
      const existingAnswer = await examAnswerGetById(answerId);
      console.log("EXISting", existingAnswer);

      if (existingAnswer) {
        const { answer_text, isCorrect } = answer;

        await examAnswerUpdate(
          {
            answer_text: answer_text,
            isCorrect: isCorrect,
          },
          existingAnswer
        );
      } else {
        const newAnswer = new ExamAnswer();
        newAnswer.answer_text = answer.answer_text;
        newAnswer.question = question;
        newAnswer.isCorrect = answer.isCorrect;

        await examAnswerCreate(newAnswer);
      }
    }

    if (countries && countries.length > 0) {
      for (const country of countries) {
        const countryId = country.id;
        const existingCountry = await examQuestionCountryGetById(countryId);

        if (existingCountry) {
          const { country_name } = country;

          await examQuestionCountryUpdate(
            {
              country_name: country_name,
            },
            existingCountry
          );
        } else {
          const newCountry = new ExamQuestionCountry();
          newCountry.country_name = country.country_name;
          newCountry.question_id = question.id;

          await examQuestionCountryCreate(newCountry);
        }
      }
    }

    logger.info("Question updated");
    return res.json({ data: questionUpdate });
  } catch (err) {
    logger.error(err);
    res.status(500).send(err);
  }
};

export const deleteQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    const examQuestion = await examQuestionRepo.findOne({ where: { id } });

    if (!examQuestion) {
      return res.status(404).json({ message: "Exam question not found" });
    }

    const examAnswer = await examAnswerGetByQueId(id);
    const examQueCountry = await examQuestionCountryGetByQueId(id);

    if (examAnswer.length > 0) {
      await examAnswerDeleteByQueId(id);
    }

    if (examQueCountry.length > 0) {
      await examQuestionCountryDeleteByQueId(id);
    }

    await examQuestionDelete(id);

    res.json({ message: "Exam question deleted" });
  } catch (err) {
    logger.error(err);
    res.status(500).send(err);
  }
};

export const deleteExamAnswer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.answerId);

    const examAns = await examAnswerGetById(id);

    if (!examAns) {
      return res.status(404).json({ message: "Exam answer not found" });
    }

    await examAnswerDelete(id);

    return res.json({ message: "Exam answer deleted" });
  } catch (err) {
    logger.error(err);
    res.status(500).send(err);
  }
};

export const deleteExamQueCountry = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.examQueCountryId);

    const examQueCountry = await examQuestionCountryGetById(id);

    if (!examQueCountry) {
      return res
        .status(404)
        .json({ message: "Exam question country not found" });
    }

    await examQuestionCountryDelete(id);

    return res.json({ message: "Exam question country deleted" });
  } catch (err) {
    logger.error(err);
    res.status(500).send(err);
  }
};
