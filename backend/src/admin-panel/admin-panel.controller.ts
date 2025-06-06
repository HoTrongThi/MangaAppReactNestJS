import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request, Patch } from '@nestjs/common';
import { AdminPanelService } from './admin-panel.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/entities/user.entity';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminPanelController {
  constructor(private readonly adminPanelService: AdminPanelService) {}

  // Quản lý người dùng
  @Get('users')
  async getAllUsers() {
    return this.adminPanelService.getAllUsers();
  }

  @Patch('users/:id')
  async updateUserRole(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.adminPanelService.updateUserRole(+id, updateUserDto.role);
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    return this.adminPanelService.deleteUser(+id);
  }

  // Quản lý bình luận
  @Get('comments')
  async getAllComments(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminPanelService.getAllComments(
      page ? +page : undefined,
      limit ? +limit : undefined,
    );
  }

  @Patch('comments/:id/approve')
  async approveComment(@Param('id') id: string) {
    return this.adminPanelService.approveComment(+id);
  }

  @Delete('comments/:id')
  async deleteComment(@Param('id') id: string) {
    return this.adminPanelService.deleteComment(+id);
  }

  // Quản lý truyện và chương (chỉ nội bộ)
  @Get('manga/internal')
  async getAllInternalManga() {
    return this.adminPanelService.getAllInternalManga();
  }

  @Get('manga/internal/:id')
  async getInternalMangaById(@Param('id') id: string) {
    return this.adminPanelService.getInternalMangaById(+id);
  }

  @Put('manga/internal/:id')
  async updateInternalManga(@Param('id') id: string, @Body() updateData: any) {
    return this.adminPanelService.updateInternalManga(+id, updateData);
  }

  @Delete('manga/internal/:id')
  async deleteInternalManga(@Param('id') id: string) {
    return this.adminPanelService.deleteInternalManga(+id);
  }

  @Get('manga/internal/:mangaId/chapters')
  async getAllInternalChapters(@Param('mangaId') mangaId: string) {
    return this.adminPanelService.getAllInternalChapters(+mangaId);
  }

  @Delete('manga/internal/:mangaId/chapters/:chapterId')
  async deleteInternalChapter(@Param('chapterId') chapterId: string, @Request() req) {
    return this.adminPanelService.deleteInternalChapter(+chapterId, req.user.id);
  }
} 