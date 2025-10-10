import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { genSalt, hash } from 'bcrypt';

import { User } from './user.entity';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  availableFields = ['nameFirst', 'nameLast', 'email', 'gender', 'birthDate'];

  // Filter body's fileds from available fields list
  private filterFields(body: UpdateUserDto): Partial<UpdateUserDto> {
    const filteredBody: Partial<Record<keyof UpdateUserDto, unknown>> = {};

    (Object.keys(body) as (keyof UpdateUserDto)[]).forEach((k) => {
      if (this.availableFields.includes(k as string)) {
        filteredBody[k] = body[k] as unknown;
      }
    });

    return filteredBody as Partial<UpdateUserDto>;
  }

  // Register new user
  public async createUser(userData: Partial<User> & { password: string }) {
    const salt = await genSalt(10);

    const hashedPassword = await hash(userData.password, salt);

    const newUser = this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    return await this.userRepository.save(newUser);
  }

  // Get all users
  public async getAllUsers() {
    return await this.userRepository.find({
      select: this.availableFields as (keyof User)[],
    });
  }

  // Get user data by id
  public async getUserData(id: number) {
    return await this.userRepository.findOne({
      where: { id },
      select: this.availableFields as (keyof User)[],
    });
  }

  // Update user data whole
  public async updateUserData(id: number, body: UpdateUserDto) {
    return await this.userRepository.update({ id }, this.filterFields(body));
  }

  // Delete user by id
  public async deleteUser(id: number) {
    return await this.userRepository.delete(id);
  }
}
