import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, OneToMany, ManyToOne } from 'typeorm';
import { Genre } from '../../genres/entities/genre.entity';
import { Chapter } from '../../chapters/entities/chapter.entity';
import { Bookmark } from '../../bookmarks/entities/bookmark.entity';
import { History } from '../../history/entities/history.entity';
import { Rating } from '../../ratings/entities/rating.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { User } from '../../users/entities/user.entity';
// Import other related entities like Chapter, Genre, etc. later

@Entity('manga')
export class Manga {
  @PrimaryGeneratedColumn()
  id: number; // Internal ID

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  mangaDexId: string; // MangaDex ID (UUID)

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 255 })
  author: string;

  @Column({ type: 'varchar', length: 50 })
  status: string;

  @Column({ type: 'varchar', length: 255 })
  coverFileName: string;

  @Column({ type: 'varchar', length: 50, default: 'internal' })
  source: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Define relationships
  @ManyToMany(() => Genre)
  @JoinTable({
    name: 'manga_genres',
    joinColumn: { name: 'manga_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'genre_id', referencedColumnName: 'id' },
  })
  genres: Genre[];

  @OneToMany(() => Chapter, (chapter: Chapter) => chapter.manga)
  chapters: Chapter[];

  @OneToMany(() => Bookmark, bookmark => bookmark.manga)
  bookmarks: Bookmark[];

  @OneToMany(() => History, history => history.manga)
  histories: History[];

  @OneToMany(() => Rating, rating => rating.manga)
  ratings: Rating[];

  @OneToMany(() => Comment, comment => comment.manga)
  comments: Comment[];

  @ManyToOne(() => User)
  user: User;

  @Column()
  userId: number;

  // Add relationships to Chapter, Genre, etc. later
} 