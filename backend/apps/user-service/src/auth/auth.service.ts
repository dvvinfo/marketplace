import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const user = await this.userService.createUser(registerDto);
    const token = this.generateToken(user.id, user.email);

    return {
      user,
      accessToken: token,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user.id, user.email);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken: token,
    };
  }

  async validateToken(token: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const payload = this.jwtService.verify(token);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const user = await this.userService.getUserById(payload.sub);
      return user;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.validateUser(email, password);

    if (!user) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  private generateToken(userId: number, email: string): string {
    const payload = { sub: userId, email };
    return this.jwtService.sign(payload);
  }
}
