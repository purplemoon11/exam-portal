import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm"
import { User } from "./user.entity"

@Entity("transaction_log")
export class Transaction {
  @PrimaryGeneratedColumn()
  id?: number

  @Column({ type: "integer", nullable: true })
  cand_id?: number

  @Column({ name: "transaction_code", type: "varchar" })
  transaction_code?: string

  @Column({ name: "total_amount", type: "varchar" })
  total_amount?: string

  @Column({ name: "transaction_uuid", type: "varchar" })
  transaction_uuid?: string

  @Column({ name: "product_code", type: "varchar" })
  product_code?: string

  @Column({ name: "status", type: "varchar", default: "Pending" })
  status?: string

  @Column({ name: "created_date", type: "timestamp", default: Date.now() })
  created_date?: string

  @ManyToOne(() => User, userAuth => userAuth.otps)
  @JoinColumn({ name: "cand_id" })
  candAuth?: User
}
