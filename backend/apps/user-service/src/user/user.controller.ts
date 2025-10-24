import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RABBITMQ_PATTERNS } from '@app/shared';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(RABBITMQ_PATTERNS.GET_ALL_USERS)
  async getAllUsers() {
    try {
      const users = await this.userService.getAllUsers();
      return { success: true, data: users };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: message };
    }
  }

  @MessagePattern(RABBITMQ_PATTERNS.GET_USER)
  async getUser(@Payload() id: number) {
    try {
      const user = await this.userService.getUserById(id);
      return { success: true, data: user };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: message };
    }
  }

  @MessagePattern(RABBITMQ_PATTERNS.GET_USER_BY_EMAIL)
  async getUserByEmail(@Payload() email: string) {
    try {
      const user = await this.userService.getUserByEmail(email);
      return { success: true, data: user };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: message };
    }
  }

  @MessagePattern(RABBITMQ_PATTERNS.CREATE_USER)
  async createUser(@Payload() userData: CreateUserDto) {
    try {
      const user = await this.userService.createUser(userData);
      return { success: true, data: user };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: message };
    }
  }

  @MessagePattern(RABBITMQ_PATTERNS.UPDATE_USER)
  async updateUser(@Payload() payload: { id: number; data: UpdateUserDto }) {
    try {
      const user = await this.userService.updateUser(payload.id, payload.data);
      return { success: true, data: user };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: message };
    }
  }

  @MessagePattern(RABBITMQ_PATTERNS.DELETE_USER)
  async deleteUser(@Payload() id: number) {
    try {
      await this.userService.deleteUser(id);
      return { success: true, message: 'User deleted successfully' };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: message };
    }
  }
}
