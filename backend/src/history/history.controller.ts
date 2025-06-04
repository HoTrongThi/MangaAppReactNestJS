import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { HistoryService } from './history.service';
import { CreateHistoryDto } from './dto/create-history.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('history')
@UseGuards(JwtAuthGuard)
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Post()
  create(@Request() req, @Body() createHistoryDto: CreateHistoryDto) {
    return this.historyService.create(req.user.id, createHistoryDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.historyService.findAll(req.user.id);
  }

  @Get(':mangaId')
  findOne(@Request() req, @Param('mangaId') mangaId: string) {
    return this.historyService.findOne(req.user.id, +mangaId);
  }

  @Delete(':mangaId')
  remove(@Request() req, @Param('mangaId') mangaId: string) {
    return this.historyService.remove(req.user.id, +mangaId);
  }
} 