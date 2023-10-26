import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity("candidate_auth")
export class User {
  @PrimaryGeneratedColumn({ name: "id" })
  id?: number

  @Column({ name: "full_name", type: "varchar", nullable: false })
  fullname?: string

  @Column({ name: "phone_number", type: "varchar" })
  phNumber?: string

  @Column({ name: "email_address", type: "varchar" })
  email?: string

  @Column({ name: "passport_no", nullable: false })
  passportNum?: string

  @Column({ name: "status", default: false })
  status?: boolean
}
