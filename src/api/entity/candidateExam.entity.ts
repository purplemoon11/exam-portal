import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm"
import { TestExamination } from "./testExamination.entity"
import { ExamQuestion } from "./question.entity"
import { User } from "./user.entity"
import { ExamAnswer } from "./answer.entity"

@Entity("candidate_exam_attempt")
export class CandidateExamAttempt {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: "cand_id", type: "int" })
  candId: number

  @Column({ name: "question_id", type: "int" })
  questionId: number

  @Column({ name: "answer_id", type: "int" })
  answerId: number

  @Column({ name: "test_id", type: "int" })
  testId: number

  @Column({ name: "is_correct", default: false })
  isCorrect: boolean

  @ManyToOne(() => ExamAnswer)
  @JoinColumn({ name: "answer_id" })
  answer: ExamAnswer

  @ManyToOne(() => User)
  @JoinColumn({ name: "cand_id" })
  candidate: User

  @ManyToOne(() => ExamQuestion)
  @JoinColumn({ name: "question_id" })
  question: ExamQuestion

  @ManyToOne(() => TestExamination)
  @JoinColumn({ name: "test_id" })
  test: TestExamination
}
