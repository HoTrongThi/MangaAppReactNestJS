import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Manga } from '../../manga/entities/manga.entity'; // Assuming Manga entity path

@Entity('bookmarks')
@Index(['user', 'manga'], { unique: true }) // Ensure a user can only bookmark a manga once
export class Bookmark {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.bookmarks)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Manga, manga => manga.bookmarks)
  @JoinColumn({ name: 'manga_id' })
  manga: Manga;

  // TypeORM will automatically create user_id and manga_id columns
} 