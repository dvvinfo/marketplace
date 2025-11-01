import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { AddFavoriteDto } from './dto/add-favorite.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('favorites')
@Controller('favorites')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  @ApiOperation({ summary: 'Добавить товар в избранное' })
  @ApiResponse({ status: 201, description: 'Товар добавлен в избранное' })
  @ApiResponse({ status: 409, description: 'Товар уже в избранном' })
  async addToFavorites(@Request() req, @Body() dto: AddFavoriteDto) {
    const userId = req.user.userId;
    return this.favoritesService.addToFavorites(userId, dto.productId);
  }

  @Delete(':productId')
  @ApiOperation({ summary: 'Удалить товар из избранного' })
  @ApiResponse({ status: 200, description: 'Товар удален из избранного' })
  @ApiResponse({ status: 404, description: 'Товар не найден в избранном' })
  async removeFromFavorites(
    @Request() req,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    const userId = req.user.userId;
    await this.favoritesService.removeFromFavorites(userId, productId);
    return { message: 'Товар удален из избранного' };
  }

  @Get()
  @ApiOperation({ summary: 'Получить список ID избранных товаров' })
  @ApiResponse({
    status: 200,
    description: 'Список ID товаров',
    type: [Number],
  })
  async getUserFavorites(@Request() req) {
    const userId = req.user.userId;
    return this.favoritesService.getUserFavorites(userId);
  }

  @Get('check/:productId')
  @ApiOperation({ summary: 'Проверить, находится ли товар в избранном' })
  @ApiResponse({
    status: 200,
    description: 'Результат проверки',
    schema: { type: 'object', properties: { isFavorite: { type: 'boolean' } } },
  })
  async checkFavorite(
    @Request() req,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    const userId = req.user.userId;
    const isFavorite = await this.favoritesService.isFavorite(
      userId,
      productId,
    );
    return { isFavorite };
  }

  @Get('count')
  @ApiOperation({ summary: 'Получить количество товаров в избранном' })
  @ApiResponse({
    status: 200,
    description: 'Количество товаров',
    schema: { type: 'object', properties: { count: { type: 'number' } } },
  })
  async getFavoritesCount(@Request() req) {
    const userId = req.user.userId;
    const count = await this.favoritesService.getFavoritesCount(userId);
    return { count };
  }
}
