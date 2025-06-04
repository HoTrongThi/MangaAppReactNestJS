import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/entities/user.entity';

@Controller('chapters')
export class ChaptersController {
  constructor(private readonly chaptersService: ChaptersService) {}

  @Post(':mangaId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CONTRIBUTOR, Role.ADMIN)
  create(
    @Param('mangaId') mangaId: string,
    @Body() createChapterDto: CreateChapterDto,
  ) {
    return this.chaptersService.create(+mangaId, createChapterDto);
  }

  @Get('manga/:mangaId')
  findAllByManga(@Param('mangaId') mangaId: string) {
    return this.chaptersService.findAllByManga(+mangaId);
  }

  @Get('id/:id')
  findOne(@Param('id') id: string) {
    return this.chaptersService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CONTRIBUTOR, Role.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateChapterDto: UpdateChapterDto,
  ) {
    return this.chaptersService.update(+id, updateChapterDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CONTRIBUTOR, Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.chaptersService.remove(+id);
  }
} 