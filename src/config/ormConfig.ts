import { DataSource } from "typeorm";
import { User } from "../api/entity/user.entity";
import { OtpAuth } from "../api/entity/otp.entity";
import { Country } from "../api/entity/country.entity";
import { Notification } from "../api/entity/notification.entity";
import { UserCountry } from "../api/entity/userCountry.entity";
import { ExamQuestion } from "../api/entity/question.entity";
import { ExamAnswer } from "../api/entity/answer.entity";
import { ExamQuestionCountry } from "../api/entity/questionCountry.entity";
import { Cluster } from "../api/entity/admin/Master-Data/cluster.entity";
import { Course } from "../api/entity/admin/Master-Data/course.entity";
import { Session } from "../api/entity/admin/Master-Data/session.entity";
import { Topic } from "../api/entity/admin/Master-Data/topic.entity";
import { Transaction } from "../api/entity/transaction.entity";
import {
  AboutUs,
  BannerImage,
} from "../api/entity/admin/Master-Data/banner-aboutus.entity";
import { Videos } from "../api/entity/admin/Master-Data/videos.entity";
import { Pdf } from "../api/entity/admin/Master-Data/pdf.entity";
import { Slide } from "../api/entity/admin/Master-Data/slide.entity";
import { TestExamination } from "../api/entity/testExamination.entity";
import { CandidateExamAttempt } from "../api/entity/candidateExam.entity";
import { TestExamGroup } from "../api/entity/testExamGroup.entity";
import { ExamSection } from "../api/entity/examSection.entity";
import { ExamSetting } from "../api/entity/examSetting.entity";

import dotenv from "dotenv";
dotenv.config();

const ormConfig = new DataSource({
  type: "postgres",
  host: process.env.HOST,
  port: Number(process.env.DB_PORT),
  username: "pdot",
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  synchronize: false,
  entities: [
    User,
    OtpAuth,
    Country,
    Notification,
    UserCountry,
    ExamQuestion,
    Cluster,
    ExamAnswer,
    ExamQuestionCountry,
    Course,
    Session,
    Topic,
    Videos,
    Pdf,
    Slide,
    BannerImage,
    AboutUs,
    Transaction,
    TestExamination,
    CandidateExamAttempt,
    TestExamGroup,
    ExamSection,
    ExamSetting,
  ],
  logging: false,
});

export default ormConfig;
