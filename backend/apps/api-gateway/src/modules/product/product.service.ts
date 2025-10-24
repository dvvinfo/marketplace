import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { RABBITMQ_PATTERNS } from '@app/shared';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { ProductFilterDto } from './dto/filterProduct.dto';

@Injectable()
export class ProductService {
  constructor(
    @Inject('PRODUCT_SERVICE')
    private readonly productClient: ClientProxy,
  ) {}

  public async getAllProducts() {
    const response = await firstValueFrom(
      this.productClient.send(RABBITMQ_PATTERNS.GET_ALL_PRODUCTS, {}),
    );
    return response.data;
  }

  public async getProductById(id: number) {
    const response = await firstValueFrom(
      this.productClient.send(RABBITMQ_PATTERNS.GET_PRODUCT, id),
    );
    return response.data;
  }

  public async searchProducts(filters: ProductFilterDto) {
    const response = await firstValueFrom(
      this.productClient.send(RABBITMQ_PATTERNS.SEARCH_PRODUCTS, filters),
    );
    return response.data;
  }

  public async createProduct(productData: CreateProductDto) {
    const response = await firstValueFrom(
      this.productClient.send(RABBITMQ_PATTERNS.CREATE_PRODUCT, productData),
    );
    return response.data;
  }

  public async updateProduct(id: number, productData: UpdateProductDto) {
    const response = await firstValueFrom(
      this.productClient.send(RABBITMQ_PATTERNS.UPDATE_PRODUCT, {
        id,
        data: productData,
      }),
    );
    return response.data;
  }

  public async deleteProduct(id: number): Promise<void> {
    await firstValueFrom(
      this.productClient.send(RABBITMQ_PATTERNS.DELETE_PRODUCT, id),
    );
  }

  public async updateStock(id: number, quantity: number) {
    const response = await firstValueFrom(
      this.productClient.send(RABBITMQ_PATTERNS.UPDATE_STOCK, { id, quantity }),
    );
    return response.data;
  }
}
