import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post(':mangaId')
  @UseGuards(JwtAuthGuard)
  create(
    @Request() req,
    @Param('mangaId') mangaId: string,
    @Body() createRatingDto: CreateRatingDto,
  ) {
    return this.ratingsService.create(req.user.id, +mangaId, createRatingDto);
  }

  @Get(':mangaId')
  findAll(@Param('mangaId') mangaId: string) {
    return this.ratingsService.findAll(+mangaId);
  }

  @Get(':mangaId/average')
  getAverageRating(@Param('mangaId') mangaId: string) {
    return this.ratingsService.getAverageRating(+mangaId);
  }

  @Get(':mangaId/user')
  @UseGuards(JwtAuthGuard)
  findOne(@Request() req, @Param('mangaId') mangaId: string) {
    return this.ratingsService.findOne(req.user.id, +mangaId);
  }

  @Delete(':mangaId')
  @UseGuards(JwtAuthGuard)
  remove(@Request() req, @Param('mangaId') mangaId: string) {
    return this.ratingsService.remove(req.user.id, +mangaId);
  }
} 