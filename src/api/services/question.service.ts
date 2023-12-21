import { ExamQuestion } from "../entity/question.entity";
import ormConfig from "../../config/ormConfig";

const examQuestionRepo = ormConfig.getRepository(ExamQuestion);
export interface IExamQuestion {
  page: number;
  pageSize: number;
}
export const examQuestionCreate = async (examQueData: object) => {
  const examQuestion = await examQuestionRepo.save(examQueData);

  return examQuestion;
};

export const examQuestionGet = async (data: IExamQuestion) => {
  const examQuestion = examQuestionRepo
    .createQueryBuilder("examQuestion")
    .leftJoinAndSelect("examQuestion.countries", "country")
    .leftJoinAndSelect("examQuestion.answers", "answer")
    .leftJoinAndSelect("examQuestion.cluster", "cluster")
    .leftJoin("cluster.countries", "clusterCountry")
    .addSelect(["clusterCountry.country_name"]);

  const totalCount = await examQuestion.getCount();
  const totalPages = Math.ceil(+totalCount / data.pageSize);

  const question = await examQuestion
    .take(data.pageSize)
    .skip((data.page - 1) * data.pageSize)
    .getMany();
  const examData = {
    question,
    totalCount,
    totalPages,
    currentPage: data.page,
  };

  return examData;
};

export const examQuestionGetById = async (examQueId: number) => {
  const examQuestion = await examQuestionRepo
    .createQueryBuilder("examQuestion")
    .leftJoinAndSelect("examQuestion.countries", "country")
    .leftJoinAndSelect("examQuestion.answers", "answer")
    .leftJoinAndSelect("examQuestion.cluster", "cluster")
    .leftJoin("cluster.countries", "clusterCountry")
    .addSelect(["clusterCountry.country_name"])
    .where("examQuestion.id = :examQueId", { examQueId })
    .getOne();

  return examQuestion;
};

export const examQuestionUpdate = async (
  updateData: object,
  examQueData: ExamQuestion
) => {
  const examQuestion = examQuestionRepo.merge(examQueData, updateData);

  await examQuestionRepo.save(examQuestion);
  return examQuestion;
};

export const examQuestionDelete = async (examQueId: number) => {
  const examQuestion = await examQuestionRepo.findOne({
    where: { id: examQueId },
  });

  return await examQuestionRepo.remove(examQuestion);
};
