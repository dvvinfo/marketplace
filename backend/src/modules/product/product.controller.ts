import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { multerConfig } from '../../config/multer.config';

import { ProductService } from './product.service';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { ProductFilterDto } from './dto/filterProduct.dto';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all products' })
  async getAllProducts() {
    return await this.productService.getAllProducts();
  }

  @Get('/search')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Search products with filters' })
  async searchProducts(@Query() filters: ProductFilterDto) {
    return await this.productService.searchProducts(filters);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getProduct(@Param('id', ParseIntPipe) id: number) {
    return await this.productService.getProductById(id);
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async createProduct(
    @Body() body: CreateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const productData: CreateProductDto = {
      ...body,
      ...(file && { image: file.filename }),
    };
    return await this.productService.createProduct(productData);
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const productData: UpdateProductDto = {
      ...body,
      ...(file && { image: file.filename }),
    };
    await this.productService.updateProduct(id, productData);
    return { message: 'Product updated successfully' };
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    await this.productService.deleteProduct(id);
  }
}
