import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { TestExamination } from "./testExamination.entity";
import { ExamQuestion } from "./question.entity";
import { User } from "./user.entity";

@Entity("candidate_exam_attempt")
export class CandidateExamAttempt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "cand_id", type: "int" })
  candId: number;

  @Column({ name: "question_id", type: "int" })
  questionId: number;

  @Column({ name: "answer_id", type: "int", nullable: true })
  answerId: number;

  @Column({ name: "test_id", type: "int" })
  testId: number;

  @Column({ name: "time_taken", type: "varchar" })
  time_taken: string;

  @Column({ name: "is_attempted", type: "boolean", default: false })
  is_attempted: Boolean;

  @Column({ name: "exam_date", type: "timestamp" })
  examDate: Date;

  @Column({ name: "is_correct", default: false })
  isCorrect: boolean;

  @ManyToOne(() => User, (user) => user.candidateExam)
  @JoinColumn({ name: "cand_id" })
  candidate: User;

  @ManyToOne(() => ExamQuestion)
  @JoinColumn({ name: "question_id" })
  question: ExamQuestion;

  @ManyToOne(() => TestExamination, (testExam) => testExam.examCand)
  @JoinColumn({ name: "test_id" })
  test: TestExamination;
}
