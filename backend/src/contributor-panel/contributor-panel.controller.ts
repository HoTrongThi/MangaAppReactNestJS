import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ContributorPanelService } from './contributor-panel.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ContributorGuard } from './guards/contributor.guard';
import { Manga } from '../manga/entities/manga.entity';
import { Chapter } from '../chapters/entities/chapter.entity';

@Controller('contributor')
@UseGuards(JwtAuthGuard, ContributorGuard)
export class ContributorPanelController {
  constructor(private readonly contributorPanelService: ContributorPanelService) {}

  // Manga Management
  @Get('manga')
  getMyManga(@Request() req) {
    return this.contributorPanelService.getMyManga(req.user.id);
  }

  @Get('manga/:id')
  getMyMangaById(@Param('id') id: string, @Request() req) {
    return this.contributorPanelService.getMyMangaById(+id, req.user.id);
  }

  @Put('manga/:id')
  updateMyManga(
    @Param('id') id: string,
    @Body() updateData: Partial<Manga>,
    @Request() req,
  ) {
    return this.contributorPanelService.updateMyManga(+id, updateData, req.user.id);
  }

  @Delete('manga/:id')
  deleteMyManga(@Param('id') id: string, @Request() req) {
    return this.contributorPanelService.deleteMyManga(+id, req.user.id);
  }

  // Add a new manga
  @Post('manga')
  createMyManga(@Body() createMangaDto: Partial<Manga>, @Request() req) {
    return this.contributorPanelService.createMyManga(createMangaDto, req.user.id);
  }

  // Chapter Management
  @Get('manga/:mangaId/chapters')
  getMyMangaChapters(@Param('mangaId') mangaId: string, @Request() req) {
    return this.contributorPanelService.getMyMangaChapters(+mangaId, req.user.id);
  }

  @Post('manga/:mangaId/chapters')
  addChapter(
    @Param('mangaId') mangaId: string,
    @Body() chapterData: Partial<Chapter>,
    @Request() req,
  ) {
    return this.contributorPanelService.addChapter(+mangaId, chapterData, req.user.id);
  }

  @Put('manga/:mangaId/chapters/:chapterId')
  updateChapter(
    @Param('mangaId') mangaId: string,
    @Param('chapterId') chapterId: string,
    @Body() updateData: Partial<Chapter>,
    @Request() req,
  ) {
    return this.contributorPanelService.updateChapter(+mangaId, +chapterId, updateData, req.user.id);
  }

  @Delete('manga/:mangaId/chapters/:chapterId')
  deleteChapter(
    @Param('mangaId') mangaId: string,
    @Param('chapterId') chapterId: string,
    @Request() req,
  ) {
    return this.contributorPanelService.deleteChapter(+mangaId, +chapterId, req.user.id);
  }

  // Comment Management
  @Get('manga/:mangaId/comments')
  getMangaComments(@Param('mangaId') mangaId: string, @Request() req) {
    return this.contributorPanelService.getMangaComments(+mangaId, req.user.id);
  }

  @Delete('manga/:mangaId/comments/:commentId')
  deleteComment(
    @Param('mangaId') mangaId: string,
    @Param('commentId') commentId: string,
    @Request() req,
  ) {
    return this.contributorPanelService.deleteComment(+mangaId, +commentId, req.user.id);
  }
} 