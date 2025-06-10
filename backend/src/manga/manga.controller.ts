import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query, Logger, BadRequestException } from '@nestjs/common';
import { MangaService } from './manga.service';
import { CreateMangaDto } from './dto/create-manga.dto';
import { UpdateMangaDto } from './dto/update-manga.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/entities/user.entity';

@Controller('manga')
export class MangaController {
  private readonly logger = new Logger(MangaController.name);

  constructor(private readonly mangaService: MangaService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.CONTRIBUTOR)
  async create(@Body() createMangaDto: CreateMangaDto, @Request() req) {
    this.logger.debug('=== Create Manga Request ===');
    this.logger.debug(`Request headers: ${JSON.stringify(req.headers)}`);
    this.logger.debug(`User from request: ${JSON.stringify(req.user)}`);
    this.logger.debug(`User role: ${req.user?.role}`);
    this.logger.debug(`Manga data: ${JSON.stringify(createMangaDto)}`);
    
    try {
      const result = await this.mangaService.create({
        ...createMangaDto,
        userId: req.user.id
      });
      this.logger.debug(`Created manga: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      this.logger.error(`Error creating manga: ${error.message}`);
      throw error;
    }
  }

  @Get()
  findAll(@Query('userId') userId?: string) {
    if (userId) {
      return this.mangaService.findByUserId(+userId);
    }
    return this.mangaService.findAll();
  }

  @Get('search')
  async searchManga(@Query('query') query: string) {
    return this.mangaService.searchManga(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const numId = Number(id);
    if (isNaN(numId)) {
      throw new BadRequestException('Invalid id');
    }
    return this.mangaService.findOne(numId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.CONTRIBUTOR)
  update(@Param('id') id: string, @Body() updateMangaDto: UpdateMangaDto) {
    const numId = Number(id);
    if (isNaN(numId)) {
      throw new BadRequestException('Invalid id');
    }
    return this.mangaService.update(numId, updateMangaDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    const numId = Number(id);
    if (isNaN(numId)) {
      throw new BadRequestException('Invalid id');
    }
    return this.mangaService.remove(numId);
  }
} 