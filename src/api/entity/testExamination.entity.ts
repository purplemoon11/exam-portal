import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm"
import { User } from "./user.entity"

@Entity("test_examination")
export class TestExamination {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: "cand_id" })
  cand_id: number

  @Column({ name: "test_name", type: "varchar" })
  test_name: string

  @Column({ name: "exam_date", type: "timestamptz", default: new Date() })
  exam_date: Date

  @Column({ name: "time_taken", type: "varchar" })
  time_taken: string

  @Column({ name: "test_status", type: "varchar" })
  test_status: string

  @Column({ name: "total_attempts", type: "int", default: 0 })
  total_attempts: number

  @ManyToOne(() => User)
  @JoinColumn({ name: "cand_id" })
  candidate: User
}
