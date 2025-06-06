import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bookmark } from './entities/bookmark.entity';
import { User } from '../users/entities/user.entity';
import { Manga } from '../manga/entities/manga.entity';
import { MangaService } from '../manga/manga.service';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectRepository(Bookmark)
    private bookmarksRepository: Repository<Bookmark>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Manga)
    private mangaRepository: Repository<Manga>,
    private mangaService: MangaService,
  ) {}

  async create(userId: number, mangaDexId: string): Promise<Bookmark> {
    // Tìm truyện bằng MangaDex ID
    let manga = await this.mangaRepository.findOne({ where: { mangaDexId: mangaDexId } });

    // Nếu truyện chưa tồn tại, tạo một entry mới
    if (!manga) {
      // **Lưu ý:** Để tạo truyện đầy đủ, bạn cần fetch thêm thông tin từ MangaDex API.
      // Đoạn code dưới đây chỉ tạo một entry cơ bản với MangaDex ID.
      // Bạn cần mở rộng phần này để fetch và lưu các thông tin khác như title, cover, v.v.
      manga = this.mangaRepository.create({
        mangaDexId: mangaDexId,
        // Thêm các trường bắt buộc khác nếu entity Manga yêu cầu (ví dụ: title, author, status, coverFileName, source, userId tạm thời)
        // Dưới đây là ví dụ với các trường bắt buộc dựa trên schema.sql và entity Manga:
         title: 'Unknown Title', // Cần fetch data thật
         author: 'Unknown Author', // Cần fetch data thật
         status: 'unknown', // Cần fetch data thật
         coverFileName: 'unknown.jpg', // Cần fetch data thật
         source: 'mangadex', // Hoặc nguồn gốc khác nếu cần
         userId: userId // Gán tạm user tạo bookmark làm user sở hữu manga, cần xem lại logic này
      });
      await this.mangaRepository.save(manga);
    }

    // Kiểm tra xem bookmark đã tồn tại chưa bằng cách sử dụng ID nội bộ của truyện
    const existingBookmark = await this.bookmarksRepository.findOne({
      where: { user: { id: userId }, manga: { id: manga.id } },
    });

    if (existingBookmark) {
      throw new ConflictException('Bookmark already exists');
    }

    // Tạo bookmark sử dụng ID nội bộ của truyện
    const newBookmark = this.bookmarksRepository.create({
      user: { id: userId }, // Liên kết bằng ID người dùng
      manga: { id: manga.id }, // Liên kết bằng ID nội bộ của truyện
    });

    return this.bookmarksRepository.save(newBookmark);
  }

  // Modify findAllForUser to return an array of mangaDexIds
  async findAllForUser(userId: number): Promise<string[]> {
    const bookmarks = await this.bookmarksRepository.find({
      where: { user: { id: userId } },
      relations: ['manga'], // Load related manga data to access mangaDexId
    });

    // Extract and return the mangaDexId from each bookmarked manga
    return bookmarks.map(bookmark => bookmark.manga.mangaDexId);
  }

  async remove(userId: number, mangaDexId: string): Promise<void> {
    // Tìm truyện bằng MangaDex ID
    const manga = await this.mangaRepository.findOne({ where: { mangaDexId: mangaDexId } });

    // Nếu không tìm thấy truyện, bookmark không thể tồn tại với MangaDex ID này
    if (!manga) {
       // Ném lỗi hoặc chỉ log nếu việc xóa bookmark không tồn tại là chấp nhận được
       throw new NotFoundException('Manga not found in database, cannot remove bookmark');
    }

    // Xóa bookmark sử dụng ID nội bộ của truyện
    const result = await this.bookmarksRepository.delete({
      user: { id: userId },
      manga: { id: manga.id },
    });

    if (result.affected === 0) {
      throw new NotFoundException('Bookmark not found for this user and manga');
    }
  }
}
