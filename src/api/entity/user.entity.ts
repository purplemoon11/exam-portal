import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { OtpAuth } from "./otp.entity";

@Entity("candidate_auth")
export class User {
  @PrimaryGeneratedColumn({ name: "id" })
  id?: number;

  @Column({ name: "full_name", type: "varchar", nullable: false })
  fullname?: string;

  @Column({ name: "phone_number", type: "varchar" })
  phNumber?: string;

  @Column({ name: "email_address", type: "varchar" })
  email?: string;

  @Column({ name: "passport_no", nullable: false })
  passportNum?: string;

  @Column({ name: "password", nullable: true })
  password: string;

  @Column({ name: "status", default: false })
  status?: boolean;

  @OneToMany(() => OtpAuth, (otpAuth) => otpAuth.candAuth)
  public otps?: OtpAuth[];
}
