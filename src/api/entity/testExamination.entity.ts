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

  @Column({ name: "exam_date", type: "timestamptz" })
  exam_date: Date

  @Column({ name: "test_status", type: "varchar" })
  test_status: string

  @Column({ name: "total_attempts", type: "number" })
  total_attempts: number

  @ManyToOne(() => User)
  @JoinColumn({ name: "cand_id" })
  candidate: User
}
