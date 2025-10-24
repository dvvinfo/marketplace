import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

import { AdminService } from './admin.service';
import { AdminGuard } from './guards/admin.guard';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from '../user/types';

@ApiTags('Admin')
@ApiBearerAuth('JWT-auth')
@Controller('admin')
@UseGuards(AdminGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('/dashboard')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get admin dashboard statistics (Admin only)' })
  async getDashboard() {
    return await this.adminService.getDashboardStats();
  }

  @Get('/users')
  @HttpCode(HttpStatus.OK)
  async getAllUsers() {
    return await this.adminService.getAllUsers();
  }

  @Put('/users/:userId/role')
  @HttpCode(HttpStatus.OK)
  async updateUserRole(
    @Param('userId', ParseIntPipe) userId: number,
    @Body('role') role: UserRole,
  ) {
    return await this.adminService.updateUserRole(userId, role);
  }

  @Get('/orders/recent')
  @HttpCode(HttpStatus.OK)
  async getRecentOrders(@Query('limit', ParseIntPipe) limit: number = 10) {
    return await this.adminService.getRecentOrders(limit);
  }

  @Get('/promo-codes/active')
  @HttpCode(HttpStatus.OK)
  async getActivePromoCodes() {
    return await this.adminService.getActivePromoCodes();
  }

  @Get('/products/low-stock')
  @HttpCode(HttpStatus.OK)
  async getLowStockProducts(
    @Query('threshold', ParseIntPipe) threshold: number = 10,
  ) {
    return await this.adminService.getLowStockProducts(threshold);
  }
}
