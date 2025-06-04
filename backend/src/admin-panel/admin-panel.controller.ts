import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AdminPanelService } from './admin-panel.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from './guards/admin.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminPanelController {
  constructor(private readonly adminPanelService: AdminPanelService) {}

  // Quản lý người dùng
  @Get('users')
  getAllUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminPanelService.getAllUsers(
      page ? +page : undefined,
      limit ? +limit : undefined,
    );
  }

  @Put('users/:id')
  updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.adminPanelService.updateUser(+id, updateUserDto);
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.adminPanelService.deleteUser(+id);
  }

  // Quản lý bình luận
  @Get('comments')
  getAllComments(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminPanelService.getAllComments(
      page ? +page : undefined,
      limit ? +limit : undefined,
    );
  }

  @Post('comments/:id/approve')
  approveComment(@Param('id') id: string) {
    return this.adminPanelService.approveComment(+id);
  }

  @Delete('comments/:id')
  deleteComment(@Param('id') id: string) {
    return this.adminPanelService.deleteComment(+id);
  }

  // Quản lý truyện và chương
  @Get('manga')
  getAllUserManga(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminPanelService.getAllUserManga(
      page ? +page : undefined,
      limit ? +limit : undefined,
    );
  }

  @Delete('manga/:id')
  deleteManga(@Param('id') id: string) {
    return this.adminPanelService.deleteManga(+id);
  }

  @Delete('chapters/:id')
  deleteChapter(@Param('id') id: string) {
    return this.adminPanelService.deleteChapter(+id);
  }
} 