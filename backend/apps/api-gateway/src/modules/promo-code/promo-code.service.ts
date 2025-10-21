import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { RABBITMQ_PATTERNS } from '@app/shared';
import { CreatePromoCodeDto } from './dto/createPromoCode.dto';
import { UpdatePromoCodeDto } from './dto/updatePromoCode.dto';
import { ValidatePromoCodeDto } from './dto/validatePromoCode.dto';

@Injectable()
export class PromoCodeService {
  constructor(
    @Inject('PROMO_SERVICE')
    private readonly promoClient: ClientProxy,
  ) {}

  public async getAllPromoCodes() {
    const response = await firstValueFrom(
      this.promoClient.send('get_all_promo_codes', {}),
    );
    return response.data;
  }

  public async getActivePromoCodes() {
    const response = await firstValueFrom(
      this.promoClient.send('get_active_promo_codes', {}),
    );
    return response.data;
  }

  public async getPromoCodeById(id: number) {
    const response = await firstValueFrom(
      this.promoClient.send(RABBITMQ_PATTERNS.GET_PROMO_CODE, id),
    );
    return response.data;
  }

  public async getPromoCodeByCode(code: string) {
    const response = await firstValueFrom(
      this.promoClient.send('get_promo_code_by_code', code),
    );
    return response.data;
  }

  public async validatePromoCode(validateDto: ValidatePromoCodeDto) {
    const response = await firstValueFrom(
      this.promoClient.send(RABBITMQ_PATTERNS.VALIDATE_PROMO_CODE, validateDto),
    );
    return response.data;
  }

  public async createPromoCode(promoCodeData: CreatePromoCodeDto) {
    const response = await firstValueFrom(
      this.promoClient.send(RABBITMQ_PATTERNS.CREATE_PROMO_CODE, promoCodeData),
    );
    return response.data;
  }

  public async updatePromoCode(id: number, promoCodeData: UpdatePromoCodeDto) {
    const response = await firstValueFrom(
      this.promoClient.send('update_promo_code', { id, data: promoCodeData }),
    );
    return response.data;
  }

  public async deletePromoCode(id: number): Promise<void> {
    await firstValueFrom(
      this.promoClient.send('delete_promo_code', id),
    );
  }
}
