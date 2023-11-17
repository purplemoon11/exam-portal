import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm"
import { Cluster } from "./admin/Master-Data/cluster.entity"
import { ExamAnswer } from "./answer.entity"
import { ExamQuestionCountry } from "./questionCountry.entity"

@Entity("exam_question")
export class ExamQuestion {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: "cluster_id", type: "int" })
  cluster_id: number

  @Column({ name: "question_text", type: "varchar" })
  question_text: string

  @Column({ name: "media_file", type: "varchar" })
  media_file: string

  @Column({ name: "file_type", type: "varchar", default: "Others" })
  fileType: string

  @ManyToOne(() => Cluster, cluster => cluster.examQuestions)
  @JoinColumn({ name: "cluster_id" })
  cluster: Cluster

  @OneToMany(() => ExamAnswer, examAns => examAns.question)
  answers: ExamAnswer[]

  @OneToMany(
    () => ExamQuestionCountry,
    examQueCountry => examQueCountry.question
  )
  countries: ExamQuestionCountry
}
