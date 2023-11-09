import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm"

@Entity("exam_setting")
export class ExamSetting {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: "number", type: "int" })
  number: number

  @Column({ name: "exam_fee", type: "varchar" })
  exam_fee: string

  @Column({ name: "exam_frequency", type: "int" })
  exam_frequency: number

  @Column({ name: "exam_duration", type: "varchar" })
  exam_duration: string
}
