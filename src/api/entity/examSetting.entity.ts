import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BaseEntity,
} from "typeorm";

@Entity("exam_setting")
export class ExamSetting extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "number", type: "int" })
  number: number;

  @Column({ name: "exam_fee", type: "varchar" })
  exam_fee: string;

  @Column({ name: "exam_frequency", type: "int" })
  exam_frequency: number;

  @Column({ name: "exam_duration", type: "interval" })
  exam_duration: string;
}
