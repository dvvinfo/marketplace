import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RABBITMQ_PATTERNS } from '@app/shared';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { UpdateCategoryDto } from './dto/updateCategory.dto';

@Controller()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @MessagePattern(RABBITMQ_PATTERNS.GET_ALL_CATEGORIES)
  async getAllCategories() {
    try {
      const categories = await this.categoryService.getAllCategories();
      return { success: true, data: categories };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @MessagePattern(RABBITMQ_PATTERNS.GET_ROOT_CATEGORIES)
  async getRootCategories() {
    try {
      const categories = await this.categoryService.getRootCategories();
      return { success: true, data: categories };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @MessagePattern(RABBITMQ_PATTERNS.GET_CATEGORY_TREE)
  async getCategoryTree() {
    try {
      const tree = await this.categoryService.getCategoryTree();
      return { success: true, data: tree };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @MessagePattern(RABBITMQ_PATTERNS.GET_CATEGORY)
  async getCategory(@Payload() id: number) {
    try {
      const category = await this.categoryService.getCategoryById(id);
      if (!category) {
        return { success: false, error: 'Category not found' };
      }
      return { success: true, data: category };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @MessagePattern(RABBITMQ_PATTERNS.GET_CATEGORY_BY_SLUG)
  async getCategoryBySlug(@Payload() slug: string) {
    try {
      const category = await this.categoryService.getCategoryBySlug(slug);
      if (!category) {
        return { success: false, error: 'Category not found' };
      }
      return { success: true, data: category };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @MessagePattern(RABBITMQ_PATTERNS.GET_CHILD_CATEGORIES)
  async getChildCategories(@Payload() id: number) {
    try {
      const children = await this.categoryService.getChildCategories(id);
      return { success: true, data: children };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @MessagePattern(RABBITMQ_PATTERNS.CREATE_CATEGORY)
  async createCategory(@Payload() categoryData: CreateCategoryDto) {
    try {
      const category = await this.categoryService.createCategory(categoryData);
      return { success: true, data: category };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @MessagePattern(RABBITMQ_PATTERNS.UPDATE_CATEGORY)
  async updateCategory(@Payload() payload: { id: number; data: UpdateCategoryDto }) {
    try {
      const category = await this.categoryService.updateCategory(payload.id, payload.data);
      return { success: true, data: category };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @MessagePattern(RABBITMQ_PATTERNS.DELETE_CATEGORY)
  async deleteCategory(@Payload() id: number) {
    try {
      await this.categoryService.deleteCategory(id);
      return { success: true, message: 'Category deleted successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
