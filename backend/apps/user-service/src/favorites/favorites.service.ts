import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './favorite.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private favoritesRepository: Repository<Favorite>,
  ) {}

  async addToFavorites(
    userId: number,
    productId: number,
  ): Promise<Favorite> {
    const existing = await this.favoritesRepository.findOne({
      where: { userId, productId },
    });

    if (existing) {
      throw new ConflictException('Товар уже в избранном');
    }

    const favorite = this.favoritesRepository.create({
      userId,
      productId,
    });

    return this.favoritesRepository.save(favorite);
  }

  async removeFromFavorites(
    userId: number,
    productId: number,
  ): Promise<void> {
    const result = await this.favoritesRepository.delete({
      userId,
      productId,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Товар не найден в избранном');
    }
  }

  async getUserFavorites(userId: number): Promise<number[]> {
    const favorites = await this.favoritesRepository.find({
      where: { userId },
      select: ['productId'],
    });

    return favorites.map((f) => f.productId);
  }

  async isFavorite(userId: number, productId: number): Promise<boolean> {
    const count = await this.favoritesRepository.count({
      where: { userId, productId },
    });

    return count > 0;
  }

  async getFavoritesCount(userId: number): Promise<number> {
    return this.favoritesRepository.count({
      where: { userId },
    });
  }
}
