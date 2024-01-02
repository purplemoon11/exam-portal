import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user.entity";
import { Base } from "./base.entity";

@Entity("notification")
export class Notification extends Base {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "integer" })
  cand_id?: number;

  @Column({ name: "title", type: "varchar" })
  title?: string;

  @Column({ name: "description", type: "varchar" })
  description?: string;

  @ManyToOne(() => User, (user) => user.notifications)
  @JoinColumn({ name: "cand_id" })
  candNotification?: User;
}
