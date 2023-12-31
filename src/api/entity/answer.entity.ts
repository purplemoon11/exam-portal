import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm"
import { ExamQuestion } from "./question.entity"

@Entity("exam_answer", { schema: "public" }) // Specify the schema if needed
export class ExamAnswer {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: "question_id", type: "int" })
  question_id: number

  @Column({ name: "answertext", type: "varchar" })
  answer_text: string

  @Column({ name: "iscorrect", type: "boolean", default: false })
  isCorrect: boolean

  @ManyToOne(() => ExamQuestion, examQue => examQue.answers)
  @JoinColumn({ name: "question_id" })
  question: ExamQuestion
}
