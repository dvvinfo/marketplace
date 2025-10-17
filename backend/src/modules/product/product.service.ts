import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from './product.entity';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { ProductFilterDto, SortBy, SortOrder } from './dto/filterProduct.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  public async getAllProducts(): Promise<Product[]> {
    return await this.productRepository.find({ relations: ['category'] });
  }

  public async getProductById(id: number): Promise<Product | null> {
    return await this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });
  }

  public async searchProducts(filters: ProductFilterDto): Promise<{
    products: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category');

    if (filters.search) {
      queryBuilder.where(
        '(LOWER(product.title) LIKE LOWER(:search) OR LOWER(product.description) LIKE LOWER(:search))',
        { search: `%${filters.search}%` },
      );
    }

    if (filters.categoryId !== undefined) {
      queryBuilder.andWhere('product.categoryId = :categoryId', {
        categoryId: filters.categoryId,
      });
    }

    if (filters.minPrice !== undefined) {
      queryBuilder.andWhere('product.price >= :minPrice', {
        minPrice: filters.minPrice,
      });
    }

    if (filters.maxPrice !== undefined) {
      queryBuilder.andWhere('product.price <= :maxPrice', {
        maxPrice: filters.maxPrice,
      });
    }

    if (filters.inStock) {
      queryBuilder.andWhere('product.stock > 0');
    }

    if (filters.onSale) {
      queryBuilder.andWhere('product.discountPrice IS NOT NULL');
    }

    const sortBy = filters.sortBy || SortBy.CREATED_AT;
    const sortOrder = filters.sortOrder || SortOrder.DESC;

    switch (sortBy) {
      case SortBy.PRICE:
        queryBuilder.orderBy('product.price', sortOrder);
        break;
      case SortBy.TITLE:
        queryBuilder.orderBy('product.title', sortOrder);
        break;
      case SortBy.CREATED_AT:
        queryBuilder.orderBy('product.createdAt', sortOrder);
        break;
      default:
        queryBuilder.orderBy('product.createdAt', sortOrder);
    }

    const total = await queryBuilder.getCount();
    const products = await queryBuilder.skip(skip).take(limit).getMany();

    return {
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  public async createProduct(productData: CreateProductDto): Promise<Product> {
    const newProduct = this.productRepository.create(productData);
    return await this.productRepository.save(newProduct);
  }

  public async updateProduct(
    id: number,
    productData: UpdateProductDto,
  ): Promise<void> {
    await this.productRepository.update({ id }, productData);
  }

  public async deleteProduct(id: number): Promise<void> {
    await this.productRepository.delete(id);
  }
}
