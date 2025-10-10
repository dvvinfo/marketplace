import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from './product.entity';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  public async getAllProducts(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  public async getProductById(id: number): Promise<Product | null> {
    return await this.productRepository.findOne({ where: { id } });
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
