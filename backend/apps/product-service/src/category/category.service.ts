import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';

import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { UpdateCategoryDto } from './dto/updateCategory.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  public async getAllCategories(): Promise<Category[]> {
    return await this.categoryRepository.find({
      relations: ['parent', 'children'],
      order: { name: 'ASC' },
    });
  }

  public async getRootCategories(): Promise<Category[]> {
    return await this.categoryRepository.find({
      where: { parentId: IsNull() },
      relations: ['children'],
      order: { name: 'ASC' },
    });
  }

  public async getCategoryTree(): Promise<Category[]> {
    const categories = await this.categoryRepository.find({
      relations: ['children', 'children.children'],
      where: { parentId: IsNull() },
      order: { name: 'ASC' },
    });

    return categories;
  }

  public async getCategoryById(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['parent', 'children'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  public async getCategoryBySlug(slug: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { slug },
      relations: ['parent', 'children'],
    });

    if (!category) {
      throw new NotFoundException(`Category with slug "${slug}" not found`);
    }

    return category;
  }

  public async getChildCategories(parentId: number): Promise<Category[]> {
    const parent = await this.getCategoryById(parentId);

    return await this.categoryRepository.find({
      where: { parentId: parent.id },
      relations: ['children'],
      order: { name: 'ASC' },
    });
  }

  public async createCategory(
    categoryData: CreateCategoryDto,
  ): Promise<Category> {
    const existingSlug = await this.categoryRepository.findOne({
      where: { slug: categoryData.slug },
    });

    if (existingSlug) {
      throw new ConflictException(
        `Category with slug "${categoryData.slug}" already exists`,
      );
    }

    if (categoryData.parentId) {
      const parent = await this.categoryRepository.findOne({
        where: { id: categoryData.parentId },
      });

      if (!parent) {
        throw new NotFoundException(
          `Parent category with ID ${categoryData.parentId} not found`,
        );
      }
    }

    const category = this.categoryRepository.create(categoryData);
    return await this.categoryRepository.save(category);
  }

  public async updateCategory(
    id: number,
    categoryData: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.getCategoryById(id);

    if (categoryData.slug && categoryData.slug !== category.slug) {
      const existingSlug = await this.categoryRepository.findOne({
        where: { slug: categoryData.slug },
      });

      if (existingSlug) {
        throw new ConflictException(
          `Category with slug "${categoryData.slug}" already exists`,
        );
      }
    }

    if (categoryData.parentId !== undefined) {
      if (categoryData.parentId === id) {
        throw new BadRequestException('Category cannot be its own parent');
      }

      if (categoryData.parentId !== null) {
        const parent = await this.categoryRepository.findOne({
          where: { id: categoryData.parentId },
        });

        if (!parent) {
          throw new NotFoundException(
            `Parent category with ID ${categoryData.parentId} not found`,
          );
        }
      }
    }

    Object.assign(category, categoryData);
    return await this.categoryRepository.save(category);
  }

  public async deleteCategory(id: number): Promise<void> {
    const category = await this.getCategoryById(id);

    const childCount = await this.categoryRepository.count({
      where: { parentId: id },
    });

    if (childCount > 0) {
      throw new BadRequestException(
        'Cannot delete category with child categories. Delete children first.',
      );
    }

    await this.categoryRepository.remove(category);
  }
}
