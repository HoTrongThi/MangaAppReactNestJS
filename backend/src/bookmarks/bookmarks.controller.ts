import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard) // Protect all routes in this controller
@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post()
  // Endpoint để thêm bookmark. userId được lấy từ JWT payload.
  async create(@Request() req, @Body() createBookmarkDto: CreateBookmarkDto) {
    // Lấy userId từ sub trong JWT payload
    const userId = req.user.sub;
    console.log('Adding bookmark for user:', userId, 'manga:', createBookmarkDto.mangaId);
    return this.bookmarksService.create(userId, createBookmarkDto.mangaId);
  }

  @Get()
  // Endpoint để lấy tất cả bookmark của người dùng hiện tại. userId được lấy từ JWT payload.
  async findAllForUser(@Request() req) {
    // Lấy userId từ sub trong JWT payload
    const userId = req.user.sub;
    console.log('Getting bookmarks for user:', userId);
    return this.bookmarksService.findAllForUser(userId);
  }

  @Delete(':mangaId')
  @HttpCode(HttpStatus.NO_CONTENT) // Return 204 No Content on successful deletion
  // Endpoint để xóa bookmark. userId được lấy từ JWT payload, mangaId từ URL.
  async remove(@Request() req, @Param('mangaId', ParseIntPipe) mangaId: number) {
    // Lấy userId từ sub trong JWT payload
    const userId = req.user.sub;
    console.log('Removing bookmark for user:', userId, 'manga:', mangaId);
    await this.bookmarksService.remove(userId, mangaId);
  }
} 