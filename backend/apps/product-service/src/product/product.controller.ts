import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RABBITMQ_PATTERNS } from '@app/shared';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { ProductFilterDto } from './dto/filterProduct.dto';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @MessagePattern(RABBITMQ_PATTERNS.GET_ALL_PRODUCTS)
  async getAllProducts() {
    try {
      const products = await this.productService.getAllProducts();
      return { success: true, data: products };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @MessagePattern(RABBITMQ_PATTERNS.SEARCH_PRODUCTS)
  async searchProducts(@Payload() filters: ProductFilterDto) {
    try {
      const result = await this.productService.searchProducts(filters);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @MessagePattern(RABBITMQ_PATTERNS.GET_PRODUCT)
  async getProduct(@Payload() id: number) {
    try {
      const product = await this.productService.getProductById(id);
      if (!product) {
        return { success: false, error: 'Product not found' };
      }
      return { success: true, data: product };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @MessagePattern(RABBITMQ_PATTERNS.CREATE_PRODUCT)
  async createProduct(@Payload() productData: CreateProductDto) {
    try {
      const product = await this.productService.createProduct(productData);
      return { success: true, data: product };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @MessagePattern(RABBITMQ_PATTERNS.UPDATE_PRODUCT)
  async updateProduct(
    @Payload() payload: { id: number; data: UpdateProductDto },
  ) {
    try {
      await this.productService.updateProduct(payload.id, payload.data);
      const updated = await this.productService.getProductById(payload.id);
      return { success: true, data: updated };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @MessagePattern(RABBITMQ_PATTERNS.DELETE_PRODUCT)
  async deleteProduct(@Payload() id: number) {
    try {
      await this.productService.deleteProduct(id);
      return { success: true, message: 'Product deleted successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @MessagePattern(RABBITMQ_PATTERNS.UPDATE_STOCK)
  async updateStock(@Payload() payload: { id: number; quantity: number }) {
    try {
      await this.productService.updateStock(payload.id, payload.quantity);
      const updated = await this.productService.getProductById(payload.id);
      return { success: true, data: updated };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
