import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Manga } from '../../manga/entities/manga.entity';
import { View } from '../../views/entities/view.entity';

@Entity('chapters')
export class Chapter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'float', nullable: false })
  chapterNumber: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  volumeNumber: string;

  @Column({ type: 'longtext', nullable: true })
  pages: any[];

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

  @ManyToOne(() => Manga, manga => manga.chapters)
  @JoinColumn({ name: 'manga_id' })
  manga: Manga;

  @Column()
  mangaId: number;

  @OneToMany(() => View, view => view.chapter)
  views: View[];
} 