import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/createAddress.dto';
import { UpdateAddressDto } from './dto/updateAddress.dto';

@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getAllAddresses() {
    return await this.addressService.getAllAddresses();
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getAddress(@Param('id', ParseIntPipe) id: number) {
    return await this.addressService.getAddressById(id);
  }

  @Get('/user/:userId')
  @HttpCode(HttpStatus.OK)
  async getAddressesByUser(@Param('userId', ParseIntPipe) userId: number) {
    return await this.addressService.getAddressesByUserId(userId);
  }

  @Get('/user/:userId/default')
  @HttpCode(HttpStatus.OK)
  async getDefaultAddress(@Param('userId', ParseIntPipe) userId: number) {
    return await this.addressService.getDefaultAddress(userId);
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async createAddress(@Body() body: CreateAddressDto) {
    return await this.addressService.createAddress(body);
  }

  @Put('/:id/user/:userId')
  @HttpCode(HttpStatus.OK)
  async updateAddress(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Body() body: UpdateAddressDto,
  ) {
    return await this.addressService.updateAddress(id, userId, body);
  }

  @Patch('/:id/user/:userId/default')
  @HttpCode(HttpStatus.OK)
  async setDefaultAddress(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return await this.addressService.setDefaultAddress(id, userId);
  }

  @Delete('/:id/user/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAddress(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    await this.addressService.deleteAddress(id, userId);
  }
}
