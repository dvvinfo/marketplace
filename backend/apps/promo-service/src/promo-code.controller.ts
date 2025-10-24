import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RABBITMQ_PATTERNS } from '@app/shared';
import { PromoCodeService } from './promo-code.service';
import { CreatePromoCodeDto } from './dto/createPromoCode.dto';
import { UpdatePromoCodeDto } from './dto/updatePromoCode.dto';
import { ValidatePromoCodeDto } from './dto/validatePromoCode.dto';

@Controller()
export class PromoCodeController {
  constructor(private readonly promoCodeService: PromoCodeService) {}

  @MessagePattern('get_all_promo_codes')
  async getAllPromoCodes() {
    try {
      const promoCodes = await this.promoCodeService.getAllPromoCodes();
      return { success: true, data: promoCodes };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @MessagePattern('get_active_promo_codes')
  async getActivePromoCodes() {
    try {
      const promoCodes = await this.promoCodeService.getActivePromoCodes();
      return { success: true, data: promoCodes };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @MessagePattern(RABBITMQ_PATTERNS.GET_PROMO_CODE)
  async getPromoCode(@Payload() id: number) {
    try {
      const promoCode = await this.promoCodeService.getPromoCodeById(id);
      return { success: true, data: promoCode };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @MessagePattern('get_promo_code_by_code')
  async getPromoCodeByCode(@Payload() code: string) {
    try {
      const promoCode = await this.promoCodeService.getPromoCodeByCode(code);
      return { success: true, data: promoCode };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @MessagePattern(RABBITMQ_PATTERNS.VALIDATE_PROMO_CODE)
  async validatePromoCode(@Payload() payload: ValidatePromoCodeDto) {
    try {
      const result = await this.promoCodeService.validatePromoCode(payload);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @MessagePattern(RABBITMQ_PATTERNS.CREATE_PROMO_CODE)
  async createPromoCode(@Payload() payload: CreatePromoCodeDto) {
    try {
      const promoCode = await this.promoCodeService.createPromoCode(payload);
      return { success: true, data: promoCode };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @MessagePattern('update_promo_code')
  async updatePromoCode(
    @Payload() payload: { id: number; data: UpdatePromoCodeDto },
  ) {
    try {
      const promoCode = await this.promoCodeService.updatePromoCode(
        payload.id,
        payload.data,
      );
      return { success: true, data: promoCode };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @MessagePattern('delete_promo_code')
  async deletePromoCode(@Payload() id: number) {
    try {
      await this.promoCodeService.deletePromoCode(id);
      return { success: true, message: 'Promo code deleted' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
