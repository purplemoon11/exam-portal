import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm"
import { User } from "./user.entity"

@Entity("otp_auth")
export class OtpAuth {
  @PrimaryGeneratedColumn()
  id?: number

  @Column({ type: "integer", nullable: true })
  cand_id?: number

  @Column({ type: "varchar", length: 10, collation: "default" })
  otp?: string

  @CreateDateColumn({ type: "timestamptz" })
  created_date?: Date

  @Column({ type: "timestamptz" })
  valid_upto?: Date

  @ManyToOne(() => User, userAuth => userAuth.otps)
  @JoinColumn({ name: "cand_id" })
  candAuth?: User
}
