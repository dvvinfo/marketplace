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
    if (!response.success) {
      throw new Error(response.error || 'Failed to get addresses');
    }
    return response.data;
  }

  async getAddressById(id: number) {
    const response = await firstValueFrom(
      this.userClient.send(RABBITMQ_PATTERNS.GET_ADDRESS, id),
    );
    if (!response.success) {
      throw new Error(response.error || 'Failed to get address');
    }
    return response.data;
  }

  async getAddressesByUserId(userId: number) {
    const response = await firstValueFrom(
      this.userClient.send(RABBITMQ_PATTERNS.GET_USER_ADDRESSES, userId),
    );
    if (!response.success) {
      throw new Error(response.error || 'Failed to get user addresses');
    }
    return response.data;
  }

  async getDefaultAddress(userId: number) {
    const response = await firstValueFrom(
      this.userClient.send(RABBITMQ_PATTERNS.GET_DEFAULT_ADDRESS, userId),
    );
    if (!response.success) {
      throw new Error(response.error || 'Failed to get default address');
    }
    return response.data;
  }

  async createAddress(addressData: CreateAddressDto) {
    const response = await firstValueFrom(
      this.userClient.send(RABBITMQ_PATTERNS.CREATE_ADDRESS, addressData),
    );
    if (!response.success) {
      throw new Error(response.error || 'Failed to create address');
    }
    return response.data;
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
    if (!response.success) {
      throw new Error(response.error || 'Failed to update address');
    }
    return response.data;
  }

  async setDefaultAddress(id: number, userId: number) {
    const response = await firstValueFrom(
      this.userClient.send(RABBITMQ_PATTERNS.SET_DEFAULT_ADDRESS, {
        id,
        userId,
      }),
    );
    if (!response.success) {
      throw new Error(response.error || 'Failed to set default address');
    }
    return response.data;
  }

  async deleteAddress(id: number, userId: number): Promise<void> {
    const response = await firstValueFrom(
      this.userClient.send(RABBITMQ_PATTERNS.DELETE_ADDRESS, { id, userId }),
    );
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete address');
    }
  }
}
