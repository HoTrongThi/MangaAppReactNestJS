import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Manga } from '../../manga/entities/manga.entity';

@Entity('ratings')
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.ratings)
  user: User;

  @ManyToOne(() => Manga, manga => manga.ratings)
  manga: Manga;

  @Column({ type: 'int', nullable: false })
  score: number;

  @Column({ type: 'text', nullable: true, default: null })
  comment: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 