import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Res,
  ParseIntPipe,
} from '@nestjs/common';
import { Response } from 'express';

import { ProductService } from './product.service';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/')
  async getAllProducts(@Res() res: Response) {
    const products = await this.productService.getAllProducts();

    return res.send({
      status: 'ok',
      data: products,
    });
  }

  @Get('/:id')
  async getProduct(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const product = await this.productService.getProductById(id);

    return res.send({
      status: 'ok',
      data: product,
    });
  }

  @Post('/')
  async createProduct(@Body() body: CreateProductDto, @Res() res: Response) {
    const product = await this.productService.createProduct(body);

    return res.send({
      status: 'ok',
      data: product,
    });
  }

  @Put('/:id')
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProductDto,
    @Res() res: Response,
  ) {
    await this.productService.updateProduct(id, body);

    return res.send({ status: 'ok' });
  }

  @Delete('/:id')
  async deleteProduct(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    await this.productService.deleteProduct(id);

    return res.send({ status: 'ok' });
  }
}
