import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user.entity";

export abstract class Base extends BaseEntity {
  // @PrimaryGeneratedColumn("increment", { type: "bigint" })
  // id: number;

  @CreateDateColumn({ name: "created_at", select: true })
  createdAt: Date;

  @UpdateDateColumn({
    name: "updated_at",
    select: true,
    nullable: true,
  })
  updatedAt: Date;

  @Column({ default: true })
  status: boolean;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "created_by" })
  createdBy: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "updated_by" })
  updatedBy: User;

  @DeleteDateColumn({ name: "deleted_at", select: false, nullable: true })
  deletedAt: Date;
}
