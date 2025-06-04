import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Genre } from '../../genres/entities/genre.entity';
import { Chapter } from '../../chapters/entities/chapter.entity';
import { Bookmark } from '../../bookmarks/entities/bookmark.entity';
import { History } from '../../history/entities/history.entity';
import { Rating } from '../../ratings/entities/rating.entity';
import { Comment } from '../../comments/entities/comment.entity';
// Import other related entities like Chapter, Genre, etc. later

@Entity('manga')
export class Manga {
  @PrimaryGeneratedColumn()
  id: number; // Internal ID

  @Column({ type: 'varchar', length: 255, nullable: false })
  mangaDexId: string; // ID từ MangaDex API

  @Column({ type: 'longtext', nullable: true }) // Store title in multiple languages
  title: any; 

  @Column({ type: 'longtext', nullable: true }) // Store description in multiple languages
  description: any;

  @Column({ type: 'varchar', length: 255, nullable: true }) // Store cover file name
  coverFileName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  author: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  artist: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  status: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  type: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  source: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  source_id: string;

  @Column({ type: 'longtext', nullable: true })
  metadata: any;

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

  // Add relationships to Chapter, Genre, etc. later
} 