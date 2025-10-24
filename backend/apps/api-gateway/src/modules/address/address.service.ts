import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Address } from './address.entity';
import { User } from '@modules/user/user.entity';
import { CreateAddressDto } from './dto/createAddress.dto';
import { UpdateAddressDto } from './dto/updateAddress.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async getAllAddresses(): Promise<Address[]> {
    return await this.addressRepository.find({
      relations: ['user'],
      order: { isDefault: 'DESC', createdAt: 'DESC' },
    });
  }

  public async getAddressById(id: number): Promise<Address> {
    const address = await this.addressRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!address) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }

    return address;
  }

  public async getAddressesByUserId(userId: number): Promise<Address[]> {
    return await this.addressRepository.find({
      where: { userId },
      order: { isDefault: 'DESC', createdAt: 'DESC' },
    });
  }

  public async getDefaultAddress(userId: number): Promise<Address | null> {
    return await this.addressRepository.findOne({
      where: { userId, isDefault: true },
    });
  }

  public async createAddress(addressData: CreateAddressDto): Promise<Address> {
    const user = await this.userRepository.findOne({
      where: { id: addressData.userId },
    });

    if (!user) {
      throw new NotFoundException(
        `User with ID ${addressData.userId} not found`,
      );
    }

    if (addressData.isDefault) {
      await this.addressRepository.update(
        { userId: addressData.userId, isDefault: true },
        { isDefault: false },
      );
    }

    const address = this.addressRepository.create(addressData);
    return await this.addressRepository.save(address);
  }

  public async updateAddress(
    id: number,
    userId: number,
    addressData: UpdateAddressDto,
  ): Promise<Address> {
    const address = await this.getAddressById(id);

    if (address.userId !== userId) {
      throw new ForbiddenException('You can only update your own addresses');
    }

    if (addressData.isDefault) {
      await this.addressRepository.update(
        { userId: address.userId, isDefault: true },
        { isDefault: false },
      );
    }

    Object.assign(address, addressData);
    return await this.addressRepository.save(address);
  }

  public async setDefaultAddress(id: number, userId: number): Promise<Address> {
    const address = await this.getAddressById(id);

    if (address.userId !== userId) {
      throw new ForbiddenException('You can only modify your own addresses');
    }

    await this.addressRepository.update(
      { userId, isDefault: true },
      { isDefault: false },
    );

    address.isDefault = true;
    return await this.addressRepository.save(address);
  }

  public async deleteAddress(id: number, userId: number): Promise<void> {
    const address = await this.getAddressById(id);

    if (address.userId !== userId) {
      throw new ForbiddenException('You can only delete your own addresses');
    }

    await this.addressRepository.remove(address);
  }
}
