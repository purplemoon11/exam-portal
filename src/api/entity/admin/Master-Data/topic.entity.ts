import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  AfterLoad,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Session } from "./session.entity";
import { Videos } from "./videos.entity";
import { Pdf } from "./pdf.entity";
import { Slide } from "./slide.entity";
import { Base } from "../../base.entity";

@Entity()
export class Topic extends Base {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", unique: true })
  name: string;

  @Column({ type: "text" })
  description: string;

  @Column({ name: "file_path", nullable: true })
  filePath: string;

  @OneToMany(() => Videos, (video) => video.topic, {
    cascade: true,
  })
  videosContent: Videos;

  @OneToMany(() => Pdf, (pdf) => pdf.topic, {
    cascade: true,
  })
  pdfContent: Pdf;

  @OneToMany(() => Slide, (slide) => slide.topic, {
    cascade: true,
  })
  slidesContent: Slide;

  @ManyToOne(() => Session, (session) => session.topic, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "session_id" })
  session: Session;
}
