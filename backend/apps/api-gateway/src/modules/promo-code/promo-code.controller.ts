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
import { ApiTags } from '@nestjs/swagger';

import { PromoCodeService } from './promo-code.service';
import { CreatePromoCodeDto } from './dto/createPromoCode.dto';
import { UpdatePromoCodeDto } from './dto/updatePromoCode.dto';
import { ValidatePromoCodeDto } from './dto/validatePromoCode.dto';

@ApiTags('Promo Codes')
@Controller('promo-codes')
export class PromoCodeController {
  constructor(private readonly promoCodeService: PromoCodeService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getAllPromoCodes() {
    return await this.promoCodeService.getAllPromoCodes();
  }

  @Get('/active')
  @HttpCode(HttpStatus.OK)
  async getActivePromoCodes() {
    return await this.promoCodeService.getActivePromoCodes();
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getPromoCode(@Param('id', ParseIntPipe) id: number) {
    return await this.promoCodeService.getPromoCodeById(id);
  }

  @Get('/code/:code')
  @HttpCode(HttpStatus.OK)
  async getPromoCodeByCode(@Param('code') code: string) {
    return await this.promoCodeService.getPromoCodeByCode(code);
  }

  @Post('/validate')
  @HttpCode(HttpStatus.OK)
  async validatePromoCode(@Body() body: ValidatePromoCodeDto) {
    return await this.promoCodeService.validatePromoCode(body);
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async createPromoCode(@Body() body: CreatePromoCodeDto) {
    return await this.promoCodeService.createPromoCode(body);
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async updatePromoCode(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePromoCodeDto,
  ) {
    return await this.promoCodeService.updatePromoCode(id, body);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePromoCode(@Param('id', ParseIntPipe) id: number) {
    await this.promoCodeService.deletePromoCode(id);
  }
}
