<<<<<<< HEAD
import { DataSource } from "typeorm";
import { User } from "../api/entity/user.entity";
import { OtpAuth } from "../api/entity/otp.entity";
import { Country } from "../api/entity/country.entity";
import { Notification } from "../api/entity/notification.entity";
import { UserCountry } from "../api/entity/userCountry.entity";
import { ExamQuestion } from "../api/entity/question.entity";
import { ExamAnswer } from "../api/entity/answer.entity";
import { ExamQuestionCountry } from "../api/entity/questionCountry.entity";

import dotenv from "dotenv";
import { Cluster } from "../api/entity/admin/Master-Data/cluster.entity";
import { Course } from "../api/entity/admin/Master-Data/course.entity";
import { Session } from "../api/entity/admin/Master-Data/session.entity";
import { Topic } from "../api/entity/admin/Master-Data/topic.entity";
import { TopicFiles } from "../api/entity/admin/Master-Data/topicFiles.entity";
dotenv.config();
=======
import { DataSource } from "typeorm"
import { User } from "../api/entity/user.entity"
import { OtpAuth } from "../api/entity/otp.entity"
import { Country } from "../api/entity/country.entity"
import { Notification } from "../api/entity/notification.entity"
import { UserCountry } from "../api/entity/userCountry.entity"
import { ExamQuestion } from "../api/entity/question.entity"
import { Cluster } from "../api/entity/admin/Master-Data/cluster.entity"
import { ExamAnswer } from "../api/entity/answer.entity"
import { ExamQuestionCountry } from "../api/entity/questionCountry.entity"
import { Transaction } from "../api/entity/transaction.entity"
import dotenv from "dotenv"
import {
  AboutUs,
  BannerImage,
} from "../api/entity/admin/Master-Data/banner-aboutus.entity"
dotenv.config()
>>>>>>> 5e5f5737989bfa062d725bf6368c0abad3eb1b17

const ormConfig = new DataSource({
  type: "postgres",
  host: process.env.HOST,
  port: Number(process.env.DB_PORT),
  username: "pdot",
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  synchronize: true,
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
<<<<<<< HEAD
    Course,
    Session,
    Topic,
    TopicFiles,
=======
    BannerImage,
    AboutUs,
    Transaction,
>>>>>>> 5e5f5737989bfa062d725bf6368c0abad3eb1b17
  ],
  // logging: true,
});

export default ormConfig;
