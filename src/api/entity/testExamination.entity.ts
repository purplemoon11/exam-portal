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
import { TestExamGroup } from "./testExamGroup.entity"

@Entity("test_examination")
export class TestExamination {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: "cand_id" })
  cand_id: number

  @Column({ name: "test_group_id", type: "int" })
  test_group_id: number

  @Column({ name: "time_taken", type: "varchar" })
  time_taken: string

  @Column({ name: "test_status", type: "varchar", default: "Ongoing" })
  test_status: string

  @Column({ name: "test_date", type: "timestamptz", default: new Date() })
  test_date: Date

  @Column({ name: "total_attempts", type: "int", default: 0 })
  total_attempts: number

  @OneToMany(() => CandidateExamAttempt, candExam => candExam.test)
  examCand: CandidateExamAttempt

  @ManyToOne(() => TestExamGroup, testGroup => testGroup.testExam)
  @JoinColumn({ name: "test_group_id" })
  testGroup: TestExamGroup[]

  @ManyToOne(() => User)
  @JoinColumn({ name: "cand_id" })
  candidate: User[]
}
