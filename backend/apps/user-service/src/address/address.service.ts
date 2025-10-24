import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './address.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  async getAllAddresses(): Promise<Address[]> {
    return await this.addressRepository.find();
  }

  async getAddressById(id: number): Promise<Address> {
    const address = await this.addressRepository.findOne({ where: { id } });
    if (!address) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }
    return address;
  }

  async getAddressesByUserId(userId: number): Promise<Address[]> {
    return await this.addressRepository.find({
      where: { userId },
      order: { isDefault: 'DESC', createdAt: 'DESC' },
    });
  }

  async getDefaultAddress(userId: number): Promise<Address | null> {
    return await this.addressRepository.findOne({
      where: { userId, isDefault: true },
    });
  }

  async createAddress(addressData: CreateAddressDto): Promise<Address> {
    if (addressData.isDefault) {
      await this.addressRepository.update(
        { userId: addressData.userId },
        { isDefault: false },
      );
    }

    const address = this.addressRepository.create(addressData);
    return await this.addressRepository.save(address);
  }

  async updateAddress(
    id: number,
    userId: number,
    addressData: UpdateAddressDto,
  ): Promise<Address> {
    const address = await this.getAddressById(id);

    if (address.userId !== userId) {
      throw new ForbiddenException('You can only update your own addresses');
    }

    if (addressData.isDefault) {
      await this.addressRepository.update({ userId }, { isDefault: false });
    }

    Object.assign(address, addressData);
    return await this.addressRepository.save(address);
  }

  async setDefaultAddress(id: number, userId: number): Promise<Address> {
    const address = await this.getAddressById(id);

    if (address.userId !== userId) {
      throw new ForbiddenException('You can only modify your own addresses');
    }

    await this.addressRepository.update({ userId }, { isDefault: false });

    address.isDefault = true;
    return await this.addressRepository.save(address);
  }

  async deleteAddress(id: number, userId: number): Promise<void> {
    const address = await this.getAddressById(id);

    if (address.userId !== userId) {
      throw new ForbiddenException('You can only delete your own addresses');
    }

    await this.addressRepository.remove(address);
  }
}
