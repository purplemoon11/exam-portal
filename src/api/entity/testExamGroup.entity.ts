import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm"
import { User } from "./user.entity"
import { TestExamination } from "./testExamination.entity"

@Entity("test_group")
export class TestExamGroup {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: "cand_id" })
  cand_id: number

  @Column({ name: "test_name", type: "varchar" })
  test_name: string

  @Column({ name: "exam_group_date", type: "date" })
  exam_group_date: Date

  @Column({ name: "total_attempts", type: "int", default: 0 })
  total_attempts: number

  @ManyToOne(() => User)
  @JoinColumn({ name: "cand_id" })
  candidate: User[]

  @OneToMany(() => TestExamination, testExam => testExam.testGroup)
  testExam: TestExamination
}
