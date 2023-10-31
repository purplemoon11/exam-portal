import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm"
import { ExamQuestion } from "./question.entity"

@Entity("exam_question_country", { schema: "public" })
export class ExamQuestionCountry {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: "country_name", type: "varchar" })
  country_name: string

  @Column({ name: "question_id", type: "integer" })
  question_id: number

  @ManyToOne(() => ExamQuestion)
  @JoinColumn({ name: "question_id" })
  question: ExamQuestion
}
