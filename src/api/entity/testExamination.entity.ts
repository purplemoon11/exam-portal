import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  BaseEntity,
} from "typeorm";
import { User } from "./user.entity";
import { CandidateExamAttempt } from "./candidateExam.entity";
import { TestExamGroup } from "./testExamGroup.entity";
import { Transaction } from "./transaction.entity";

export enum ESubmitType {
  AUTO = "auto-submit ",
  MANUAL = "manual",
}
@Entity("test_examination")
export class TestExamination extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "cand_id" })
  cand_id: number;

  @Column({ name: "payment_id" })
  payment_id: number;

  @Column({ name: "test_group_id", type: "int" })
  test_group_id: number;

  @Column({ name: "time_taken", type: "varchar" })
  time_taken: string;

  @Column({ name: "test_status", type: "varchar", default: "Ongoing" })
  test_status: string;

  @Column({ name: "test_date", type: "timestamptz", default: new Date() })
  test_date: Date;

  @Column({
    name: "submit_type",
    type: "enum",
    enum: ESubmitType,
    nullable: true,
  })
  submitType: string;

  @Column({ type: Boolean, default: false })
  isSubmitted: Boolean;

  @Column({ name: "test_exam_details", type: "jsonb", nullable: true })
  testExamDetails: any;

  @OneToMany(() => CandidateExamAttempt, (candExam) => candExam.test)
  examCand: CandidateExamAttempt[];

  @ManyToOne(() => TestExamGroup, (testGroup) => testGroup.testExam, {
    eager: true,
  })
  @JoinColumn({ name: "test_group_id" })
  testGroup: TestExamGroup;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: "cand_id" })
  candidate: User;

  @ManyToOne(() => Transaction, (trans) => trans.testExams)
  @JoinColumn({ name: "payment_id" })
  paymentId: Transaction;
}
