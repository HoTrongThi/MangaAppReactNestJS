import { Controller, Post, Body, Get, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ViewsService } from './views.service';
import { CreateViewDto } from './dto/create-view.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('views')
export class ViewsController {
  constructor(private readonly viewsService: ViewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createViewDto: CreateViewDto, @Request() req) {
    return this.viewsService.create(createViewDto, req.user.id);
  }

  @Get('chapter/:chapterId')
  getChapterViews(@Param('chapterId') chapterId: string) {
    return this.viewsService.getChapterViews(+chapterId);
  }

  @Get('manga/:mangaId')
  getMangaViews(@Param('mangaId') mangaId: string) {
    return this.viewsService.getMangaViews(+mangaId);
  }

  @Get('top/chapters/:mangaId')
  getTopViewedChapters(
    @Param('mangaId') mangaId: string,
    @Query('limit') limit?: string,
  ) {
    return this.viewsService.getTopViewedChapters(+mangaId, limit ? +limit : undefined);
  }

  @Get('top/manga')
  getTopViewedManga(@Query('limit') limit?: string) {
    return this.viewsService.getTopViewedManga(limit ? +limit : undefined);
  }
} 