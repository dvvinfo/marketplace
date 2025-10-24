import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { RABBITMQ_PATTERNS } from '@app/shared';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { UpdateCategoryDto } from './dto/updateCategory.dto';

@Injectable()
export class CategoryService {
  constructor(
    @Inject('PRODUCT_SERVICE')
    private readonly productClient: ClientProxy,
  ) {}

  public async getAllCategories() {
    const response = await firstValueFrom(
      this.productClient.send(RABBITMQ_PATTERNS.GET_ALL_CATEGORIES, {}),
    );
    return response.data;
  }

  public async getRootCategories() {
    const response = await firstValueFrom(
      this.productClient.send(RABBITMQ_PATTERNS.GET_ROOT_CATEGORIES, {}),
    );
    return response.data;
  }

  public async getCategoryTree() {
    const response = await firstValueFrom(
      this.productClient.send(RABBITMQ_PATTERNS.GET_CATEGORY_TREE, {}),
    );
    return response.data;
  }

  public async getCategoryById(id: number) {
    const response = await firstValueFrom(
      this.productClient.send(RABBITMQ_PATTERNS.GET_CATEGORY, id),
    );
    return response.data;
  }

  public async getCategoryBySlug(slug: string) {
    const response = await firstValueFrom(
      this.productClient.send(RABBITMQ_PATTERNS.GET_CATEGORY_BY_SLUG, slug),
    );
    return response.data;
  }

  public async getChildCategories(parentId: number) {
    const response = await firstValueFrom(
      this.productClient.send(RABBITMQ_PATTERNS.GET_CHILD_CATEGORIES, parentId),
    );
    return response.data;
  }

  public async createCategory(categoryData: CreateCategoryDto) {
    const response = await firstValueFrom(
      this.productClient.send(RABBITMQ_PATTERNS.CREATE_CATEGORY, categoryData),
    );
    return response.data;
  }

  public async updateCategory(id: number, categoryData: UpdateCategoryDto) {
    const response = await firstValueFrom(
      this.productClient.send(RABBITMQ_PATTERNS.UPDATE_CATEGORY, {
        id,
        data: categoryData,
      }),
    );
    return response.data;
  }

  public async deleteCategory(id: number): Promise<void> {
    await firstValueFrom(
      this.productClient.send(RABBITMQ_PATTERNS.DELETE_CATEGORY, id),
    );
  }
}
