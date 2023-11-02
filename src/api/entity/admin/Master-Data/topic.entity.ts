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

@Entity()
export class Topic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "text" })
  description: string;

  @Column({ name: "file_path" })
  filePath: string;

  @OneToMany(() => Videos, (video) => video.topic, {
    cascade: true,
    onDelete: "CASCADE",
  })
  videosContent: Videos;

  @OneToMany(() => Pdf, (pdf) => pdf.topic, {
    cascade: true,
    onDelete: "CASCADE",
  })
  pdfContent: Pdf;

  @OneToMany(() => Slide, (slide) => slide.topic, {
    cascade: true,
    onDelete: "CASCADE",
  })
  slidesContent: Slide;

  @ManyToOne(() => Session, (session) => session.topic)
  @JoinColumn({ name: "session_id" })
  session: Session;
}
