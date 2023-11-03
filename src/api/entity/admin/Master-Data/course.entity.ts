import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  AfterLoad,
  OneToMany,
} from "typeorm";
import { Country } from "../../country.entity";
import { Session } from "./session.entity";
import { Cluster } from "./cluster.entity";

@Entity("course")
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "name_english", type: "varchar" })
  nameEnglish: string;

  @Column({ name: "name_nepali", type: "varchar", nullable: true })
  nameNepali: string;

  @Column({ type: "varchar" })
  code: string;

  @Column({ type: "interval" })
  duration: string;

  @Column({ type: "text", name: "description_english" })
  descriptionEnglish: string;

  @Column({ name: "description_nepali", type: "text", nullable: true })
  descriptionNepali: string;

  @Column({ name: "course_file" })
  courseFile: string;

  @ManyToOne(() => Cluster)
  @JoinColumn({ name: "cluster_id" })
  cluster: Cluster;

  @ManyToOne(() => Country, { nullable: true })
  @JoinColumn({ name: "country_id" })
  country: Country;

  @OneToMany(() => Session, (session) => session.course, {
    cascade: true,
  })
  session: Session;

  // private static imageDir = process.env.IMAGEPATH;

  // @AfterLoad()
  // pupulateImageUrl() {
  //   this.courseFile = Course.imageDir + this.courseFile;
  // }
}
