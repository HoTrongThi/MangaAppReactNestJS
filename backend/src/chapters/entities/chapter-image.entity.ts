import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Chapter } from './chapter.entity';

@Entity('chapter_images')
export class ChapterImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  imageUrl: string;

  @Column()
  order: number;

  @ManyToOne(() => Chapter, chapter => chapter.images)
  @JoinColumn({ name: 'chapterId' })
  chapter: Chapter;

  @Column()
  chapterId: number;
} 