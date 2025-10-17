import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Favorite } from './favorite.entity';
import { User } from '@modules/user/user.entity';
import { Product } from '@modules/product/product.entity';
import { CreateFavoriteDto } from './dto/createFavorite.dto';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  public async getAllFavorites(): Promise<Favorite[]> {
    return await this.favoriteRepository.find({
      relations: ['user', 'product'],
    });
  }

  public async getFavoritesByUserId(userId: number): Promise<Favorite[]> {
    return await this.favoriteRepository.find({
      where: { userId },
      relations: ['product'],
      order: { createdAt: 'DESC' },
    });
  }

  public async getFavoriteById(id: number): Promise<Favorite> {
    const favorite = await this.favoriteRepository.findOne({
      where: { id },
      relations: ['user', 'product'],
    });

    if (!favorite) {
      throw new NotFoundException(`Favorite with ID ${id} not found`);
    }

    return favorite;
  }

  public async createFavorite(
    favoriteData: CreateFavoriteDto,
  ): Promise<Favorite> {
    const user = await this.userRepository.findOne({
      where: { id: favoriteData.userId },
    });

    if (!user) {
      throw new NotFoundException(
        `User with ID ${favoriteData.userId} not found`,
      );
    }

    const product = await this.productRepository.findOne({
      where: { id: favoriteData.productId },
    });

    if (!product) {
      throw new NotFoundException(
        `Product with ID ${favoriteData.productId} not found`,
      );
    }

    const existingFavorite = await this.favoriteRepository.findOne({
      where: {
        userId: favoriteData.userId,
        productId: favoriteData.productId,
      },
    });

    if (existingFavorite) {
      throw new ConflictException('Product already in favorites');
    }

    const favorite = this.favoriteRepository.create(favoriteData);
    return await this.favoriteRepository.save(favorite);
  }

  public async deleteFavorite(id: number): Promise<void> {
    const favorite = await this.getFavoriteById(id);
    await this.favoriteRepository.remove(favorite);
  }

  public async deleteFavoriteByProductId(
    userId: number,
    productId: number,
  ): Promise<void> {
    const favorite = await this.favoriteRepository.findOne({
      where: { userId, productId },
    });

    if (!favorite) {
      throw new NotFoundException(
        `Favorite not found for user ${userId} and product ${productId}`,
      );
    }

    await this.favoriteRepository.remove(favorite);
  }
}
