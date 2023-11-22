import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  AfterLoad,
  OneToMany,
  ManyToMany,
  JoinTable,
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

  @Column({ type: "varchar", unique: true })
  code: string;

  @Column({ type: "interval" })
  duration: string;

  @Column({ type: "text", name: "description_english" })
  descriptionEnglish: string;

  @Column({ name: "description_nepali", type: "text", nullable: true })
  descriptionNepali: string;

  @Column({ name: "course_file", nullable: true })
  courseFile: string;

  @Column({ name: "is_popular", type: "boolean", default: false })
  isPopular: Boolean;

  @ManyToOne(() => Cluster)
  @JoinColumn({ name: "cluster_id" })
  cluster: Cluster;

  // @ManyToOne(() => Country, { nullable: true })
  // @JoinColumn({ name: "country_id" })
  // country: Country;

  @ManyToMany(() => Country, { onDelete: "CASCADE", eager: true })
  @JoinTable({
    name: "course-country",
    joinColumn: { name: "course", referencedColumnName: "id" },
    inverseJoinColumn: { name: "country", referencedColumnName: "id" },
  })
  countries: Country[];

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
