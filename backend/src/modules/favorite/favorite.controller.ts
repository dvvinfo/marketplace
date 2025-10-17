import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { FavoriteService } from './favorite.service';
import { CreateFavoriteDto } from './dto/createFavorite.dto';

@Controller('favorites')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getAllFavorites() {
    return await this.favoriteService.getAllFavorites();
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getFavorite(@Param('id', ParseIntPipe) id: number) {
    return await this.favoriteService.getFavoriteById(id);
  }

  @Get('/user/:userId')
  @HttpCode(HttpStatus.OK)
  async getFavoritesByUser(@Param('userId', ParseIntPipe) userId: number) {
    return await this.favoriteService.getFavoritesByUserId(userId);
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async createFavorite(@Body() body: CreateFavoriteDto) {
    return await this.favoriteService.createFavorite(body);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteFavorite(@Param('id', ParseIntPipe) id: number) {
    await this.favoriteService.deleteFavorite(id);
  }

  @Delete('/user/:userId/product/:productId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteFavoriteByProduct(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    await this.favoriteService.deleteFavoriteByProductId(userId, productId);
  }
}
