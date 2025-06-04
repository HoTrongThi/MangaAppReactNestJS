import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Manga } from '../../manga/entities/manga.entity';

@Entity()
export class History {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.histories)
  user: User;

  @ManyToOne(() => Manga, manga => manga.histories)
  manga: Manga;

  @Column()
  chapterNumber: number;

  @Column()
  pageNumber: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 