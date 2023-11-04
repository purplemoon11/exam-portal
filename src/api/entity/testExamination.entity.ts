import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm"
import { User } from "./user.entity"
import { CandidateExamAttempt } from "./candidateExam.entity"

@Entity("test_examination")
export class TestExamination {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: "cand_id" })
  cand_id: number

  @Column({ name: "test_name", type: "varchar" })
  test_name: string

  @Column({ name: "test_date", type: "timestamptz", default: new Date() })
  test_date: Date

  @Column({ name: "time_taken", type: "varchar" })
  time_taken: string

  @Column({ name: "test_status", type: "varchar", default: "Ongoing" })
  test_status: string

  @Column({ name: "total_attempts", type: "int", default: 0 })
  total_attempts: number

  @ManyToOne(() => User)
  @JoinColumn({ name: "cand_id" })
  candidate: User

  @OneToMany(() => CandidateExamAttempt, candExam => candExam.test)
  examCand: CandidateExamAttempt
}
