import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { RABBITMQ_PATTERNS } from '@app/shared';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_SERVICE')
    private readonly userClient: ClientProxy,
  ) {}

  async register(registerDto: RegisterDto) {
    const response = await firstValueFrom(
      this.userClient.send(RABBITMQ_PATTERNS.AUTH_REGISTER, registerDto),
    );
    return response.data;
  }

  async login(loginDto: LoginDto) {
    const response = await firstValueFrom(
      this.userClient.send(RABBITMQ_PATTERNS.AUTH_LOGIN, loginDto),
    );
    return response.data;
  }

  async validateToken(token: string) {
    const response = await firstValueFrom(
      this.userClient.send(RABBITMQ_PATTERNS.AUTH_VALIDATE_TOKEN, token),
    );
    return response.data;
  }

  async validateUser(email: string, password: string) {
    const response = await firstValueFrom(
      this.userClient.send(RABBITMQ_PATTERNS.AUTH_VALIDATE_USER, {
        email,
        password,
      }),
    );
    return response.data;
  }
}
