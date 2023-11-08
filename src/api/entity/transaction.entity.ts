import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm"
import { User } from "./user.entity"
import { TestExamination } from "./testExamination.entity"

@Entity("transaction_log")
export class Transaction {
  @PrimaryGeneratedColumn()
  id?: number

  @Column({ type: "integer" })
  cand_id?: number

  @Column({ name: "transaction_code", type: "varchar" })
  transaction_code: string

  @Column({ name: "total_amount", type: "varchar" })
  total_amount?: string

  @Column({ name: "transaction_uuid", type: "varchar" })
  transaction_uuid?: string

  @Column({ name: "product_code", type: "varchar" })
  product_code?: string

  @Column({ name: "status", type: "varchar", default: "Pending" })
  status?: string

  @Column({ name: "created_date", type: "timestamp", default: new Date() })
  created_date?: Date

  @Column({ name: "exam_attempt_number", type: "int", default: 0 })
  exam_attempt_number: number

  @ManyToOne(() => User, userAuth => userAuth.otps)
  @JoinColumn({ name: "cand_id" })
  candAuth?: User

  @OneToMany(() => TestExamination, testExam => testExam.paymentId)
  testExams: TestExamination
}
