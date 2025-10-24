import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { RABBITMQ_PATTERNS } from '@app/shared';
import { CreateAddressDto } from './dto/createAddress.dto';
import { UpdateAddressDto } from './dto/updateAddress.dto';

@Injectable()
export class AddressService {
  constructor(
    @Inject('USER_SERVICE')
    private readonly userClient: ClientProxy,
  ) {}

  async getAllAddresses() {
    const response = await firstValueFrom(
      this.userClient.send(RABBITMQ_PATTERNS.GET_ALL_ADDRESSES, {}),
    );
    return response.data;
  }

  async getAddressById(id: number) {
    const response = await firstValueFrom(
      this.userClient.send(RABBITMQ_PATTERNS.GET_ADDRESS, id),
    );
    return response.data;
  }

  async getAddressesByUserId(userId: number) {
    const response = await firstValueFrom(
      this.userClient.send(RABBITMQ_PATTERNS.GET_USER_ADDRESSES, userId),
    );
    return response.data;
  }

  async getDefaultAddress(userId: number) {
    const response = await firstValueFrom(
      this.userClient.send(RABBITMQ_PATTERNS.GET_DEFAULT_ADDRESS, userId),
    );
    return response.data;
  }

  async createAddress(addressData: CreateAddressDto) {
    try {
      const response = await firstValueFrom(
        this.userClient.send(RABBITMQ_PATTERNS.CREATE_ADDRESS, addressData),
      );
      if (!response.success) {
        throw new Error(response.error || 'Failed to create address');
      }
      return response.data;
    } catch (error) {
      console.error('Error creating address:', error);
      throw error;
    }
  }

  async updateAddress(
    id: number,
    userId: number,
    addressData: UpdateAddressDto,
  ) {
    const response = await firstValueFrom(
      this.userClient.send(RABBITMQ_PATTERNS.UPDATE_ADDRESS, {
        id,
        userId,
        data: addressData,
      }),
    );
    return response.data;
  }

  async setDefaultAddress(id: number, userId: number) {
    const response = await firstValueFrom(
      this.userClient.send(RABBITMQ_PATTERNS.SET_DEFAULT_ADDRESS, {
        id,
        userId,
      }),
    );
    return response.data;
  }

  async deleteAddress(id: number, userId: number): Promise<void> {
    await firstValueFrom(
      this.userClient.send(RABBITMQ_PATTERNS.DELETE_ADDRESS, { id, userId }),
    );
  }
}
