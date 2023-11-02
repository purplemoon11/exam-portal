import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
<<<<<<< HEAD
} from "typeorm";
import { ExamAnswer } from "./answer.entity";
import { ExamQuestionCountry } from "./questionCountry.entity";
import { Cluster } from "./admin/Master-Data/cluster.entity";
=======
} from "typeorm"
import { Cluster } from "./admin/Master-Data/cluster.entity"
import { ExamAnswer } from "./answer.entity"
import { ExamQuestionCountry } from "./questionCountry.entity"
>>>>>>> 5e5f5737989bfa062d725bf6368c0abad3eb1b17

@Entity("exam_question")
export class ExamQuestion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "cluster_id", type: "int" })
  cluster_id: number;

  @Column({ name: "question_text", type: "varchar" })
  question_text: string;

  @Column({ name: "media_file", type: "varchar" })
  media_file: string;

  @ManyToOne(() => Cluster, cluster => cluster.examQuestions)
  @JoinColumn({ name: "cluster_id" })
  cluster: Cluster;

  @OneToMany(() => ExamAnswer, (examAns) => examAns.question)
  answers: ExamAnswer;

  @OneToMany(
    () => ExamQuestionCountry,
    (examQueCountry) => examQueCountry.question
  )
  countries: ExamQuestionCountry;
}
