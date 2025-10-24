import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RABBITMQ_PATTERNS } from '@app/shared';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(RABBITMQ_PATTERNS.AUTH_REGISTER)
  async register(@Payload() registerDto: RegisterDto) {
    try {
      const result = await this.authService.register(registerDto);
      return { success: true, data: result };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: message };
    }
  }

  @MessagePattern(RABBITMQ_PATTERNS.AUTH_LOGIN)
  async login(@Payload() loginDto: LoginDto) {
    try {
      const result = await this.authService.login(loginDto);
      return { success: true, data: result };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: message };
    }
  }

  @MessagePattern(RABBITMQ_PATTERNS.AUTH_VALIDATE_TOKEN)
  async validateToken(@Payload() token: string) {
    try {
      const user = await this.authService.validateToken(token);
      return { success: true, data: user };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: message };
    }
  }
}
