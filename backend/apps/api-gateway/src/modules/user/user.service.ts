import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { RABBITMQ_PATTERNS } from '@app/shared';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_SERVICE')
    private readonly userClient: ClientProxy,
  ) {}

  async getAllUsers() {
    const response = await firstValueFrom(
      this.userClient.send(RABBITMQ_PATTERNS.GET_ALL_USERS, {}),
    );
    return response.data;
  }

  async getUserById(id: number) {
    const response = await firstValueFrom(
      this.userClient.send(RABBITMQ_PATTERNS.GET_USER, id),
    );
    return response.data;
  }

  async getUserByEmail(email: string) {
    const response = await firstValueFrom(
      this.userClient.send(RABBITMQ_PATTERNS.GET_USER_BY_EMAIL, email),
    );
    return response.data;
  }

  async createUser(userData: CreateUserDto) {
    const response = await firstValueFrom(
      this.userClient.send(RABBITMQ_PATTERNS.CREATE_USER, userData),
    );
    return response.data;
  }

  async updateUser(id: number, userData: UpdateUserDto) {
    const response = await firstValueFrom(
      this.userClient.send(RABBITMQ_PATTERNS.UPDATE_USER, {
        id,
        data: userData,
      }),
    );
    return response.data;
  }

  async deleteUser(id: number): Promise<void> {
    await firstValueFrom(
      this.userClient.send(RABBITMQ_PATTERNS.DELETE_USER, id),
    );
  }
}
