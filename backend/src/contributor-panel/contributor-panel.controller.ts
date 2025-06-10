import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ContributorPanelService } from './contributor-panel.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ContributorGuard } from './guards/contributor.guard';
import { Manga } from '../manga/entities/manga.entity';
import { Chapter } from '../chapters/entities/chapter.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

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

  @Post('manga/:mangaId/chapters/:chapterId/images')
  @UseInterceptors(
    FilesInterceptor('images', 50, {
      storage: diskStorage({
        destination: './uploads/chapters',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  async uploadChapterImages(
    @Param('mangaId') mangaId: string,
    @Param('chapterId') chapterId: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Request() req,
  ) {
    return this.contributorPanelService.uploadChapterImages(+mangaId, +chapterId, files, req.user.id);
  }

  // Comment Management
  @Get('comments')
  getAllComments(@Request() req) {
    return this.contributorPanelService.getAllComments(req.user.id);
  }

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