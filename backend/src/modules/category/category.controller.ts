import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { UpdateCategoryDto } from './dto/updateCategory.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getAllCategories() {
    return await this.categoryService.getAllCategories();
  }

  @Get('/root')
  @HttpCode(HttpStatus.OK)
  async getRootCategories() {
    return await this.categoryService.getRootCategories();
  }

  @Get('/tree')
  @HttpCode(HttpStatus.OK)
  async getCategoryTree() {
    return await this.categoryService.getCategoryTree();
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getCategory(@Param('id', ParseIntPipe) id: number) {
    return await this.categoryService.getCategoryById(id);
  }

  @Get('/slug/:slug')
  @HttpCode(HttpStatus.OK)
  async getCategoryBySlug(@Param('slug') slug: string) {
    return await this.categoryService.getCategoryBySlug(slug);
  }

  @Get('/:id/children')
  @HttpCode(HttpStatus.OK)
  async getChildCategories(@Param('id', ParseIntPipe) id: number) {
    return await this.categoryService.getChildCategories(id);
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async createCategory(@Body() body: CreateCategoryDto) {
    return await this.categoryService.createCategory(body);
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateCategoryDto,
  ) {
    return await this.categoryService.updateCategory(id, body);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCategory(@Param('id', ParseIntPipe) id: number) {
    await this.categoryService.deleteCategory(id);
  }
}
