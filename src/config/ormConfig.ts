import { DataSource } from "typeorm"
import { User } from "../api/entity/user.entity"
import { OtpAuth } from "../api/entity/otp.entity"
import { Country } from "../api/entity/country.entity"
import { Notification } from "../api/entity/notification.entity"
import { UserCountry } from "../api/entity/userCountry.entity"
import { ExamQuestion } from "../api/entity/question.entity"
import { ExamAnswer } from "../api/entity/answer.entity"
import { ExamQuestionCountry } from "../api/entity/questionCountry.entity"

<<<<<<< HEAD
import dotenv from "dotenv";
import { Cluster } from "../api/entity/admin/Master-Data/cluster.entity";
import { Course } from "../api/entity/admin/Master-Data/course.entity";
import { Session } from "../api/entity/admin/Master-Data/session.entity";
import { Topic } from "../api/entity/admin/Master-Data/topic.entity";
dotenv.config();
import { Transaction } from "../api/entity/transaction.entity";
=======
import dotenv from "dotenv"
import { Cluster } from "../api/entity/admin/Master-Data/cluster.entity"
import { Course } from "../api/entity/admin/Master-Data/course.entity"
import { Session } from "../api/entity/admin/Master-Data/session.entity"
import { Topic } from "../api/entity/admin/Master-Data/topic.entity"
import { TopicFiles } from "../api/entity/admin/Master-Data/topicFiles.entity"
dotenv.config()
import { Transaction } from "../api/entity/transaction.entity"
>>>>>>> c00441a4935746e0984eac9d10923b7c0ba602f1
import {
  AboutUs,
  BannerImage,
} from "../api/entity/admin/Master-Data/banner-aboutus.entity";
import { Videos } from "../api/entity/admin/Master-Data/videos.entity";
import { Pdf } from "../api/entity/admin/Master-Data/pdf.entity";
import { Slide } from "../api/entity/admin/Master-Data/slide.entity";
dotenv.config();

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
    Course,
    Session,
    Topic,
    Videos,
    Pdf,
    Slide,
    BannerImage,
    AboutUs,
    Transaction,
  ],
  logging: true,
<<<<<<< HEAD
});
=======
})
>>>>>>> c00441a4935746e0984eac9d10923b7c0ba602f1

export default ormConfig
