import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RABBITMQ_PATTERNS } from '@app/shared';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AddressService } from './address.service';

@Controller()
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @MessagePattern(RABBITMQ_PATTERNS.GET_ALL_ADDRESSES)
  async getAllAddresses() {
    try {
      const addresses = await this.addressService.getAllAddresses();
      return { success: true, data: addresses };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: message };
    }
  }

  @MessagePattern(RABBITMQ_PATTERNS.GET_ADDRESS)
  async getAddress(@Payload() id: number) {
    try {
      const address = await this.addressService.getAddressById(id);
      return { success: true, data: address };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: message };
    }
  }

  @MessagePattern(RABBITMQ_PATTERNS.GET_USER_ADDRESSES)
  async getUserAddresses(@Payload() userId: number) {
    try {
      const addresses = await this.addressService.getAddressesByUserId(userId);
      return { success: true, data: addresses };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: message };
    }
  }

  @MessagePattern(RABBITMQ_PATTERNS.GET_DEFAULT_ADDRESS)
  async getDefaultAddress(@Payload() userId: number) {
    try {
      const address = await this.addressService.getDefaultAddress(userId);
      return { success: true, data: address };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: message };
    }
  }

  @MessagePattern(RABBITMQ_PATTERNS.CREATE_ADDRESS)
  async createAddress(@Payload() addressData: CreateAddressDto) {
    try {
      const address = await this.addressService.createAddress(addressData);
      return { success: true, data: address };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: message };
    }
  }

  @MessagePattern(RABBITMQ_PATTERNS.UPDATE_ADDRESS)
  async updateAddress(
    @Payload() payload: { id: number; userId: number; data: UpdateAddressDto },
  ) {
    try {
      const address = await this.addressService.updateAddress(
        payload.id,
        payload.userId,
        payload.data,
      );
      return { success: true, data: address };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: message };
    }
  }

  @MessagePattern(RABBITMQ_PATTERNS.SET_DEFAULT_ADDRESS)
  async setDefaultAddress(@Payload() payload: { id: number; userId: number }) {
    try {
      const address = await this.addressService.setDefaultAddress(
        payload.id,
        payload.userId,
      );
      return { success: true, data: address };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: message };
    }
  }

  @MessagePattern(RABBITMQ_PATTERNS.DELETE_ADDRESS)
  async deleteAddress(@Payload() payload: { id: number; userId: number }) {
    try {
      await this.addressService.deleteAddress(payload.id, payload.userId);
      return { success: true, message: 'Address deleted successfully' };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: message };
    }
  }
}
