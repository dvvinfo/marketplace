import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PromoCode, DiscountType } from './promo-code.entity';
import { CreatePromoCodeDto } from './dto/createPromoCode.dto';
import { UpdatePromoCodeDto } from './dto/updatePromoCode.dto';
import { ValidatePromoCodeDto } from './dto/validatePromoCode.dto';

@Injectable()
export class PromoCodeService {
  constructor(
    @InjectRepository(PromoCode)
    private readonly promoCodeRepository: Repository<PromoCode>,
  ) {}

  public async getAllPromoCodes(): Promise<PromoCode[]> {
    return await this.promoCodeRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  public async getActivePromoCodes(): Promise<PromoCode[]> {
    const now = new Date();
    return await this.promoCodeRepository
      .createQueryBuilder('promo')
      .where('promo.isActive = :isActive', { isActive: true })
      .andWhere('promo.validFrom <= :now', { now })
      .andWhere('promo.validUntil >= :now', { now })
      .andWhere(
        '(promo.usageLimit IS NULL OR promo.usageCount < promo.usageLimit)',
      )
      .orderBy('promo.createdAt', 'DESC')
      .getMany();
  }

  public async getPromoCodeById(id: number): Promise<PromoCode> {
    const promoCode = await this.promoCodeRepository.findOne({
      where: { id },
    });

    if (!promoCode) {
      throw new NotFoundException(`Promo code with ID ${id} not found`);
    }

    return promoCode;
  }

  public async getPromoCodeByCode(code: string): Promise<PromoCode> {
    const promoCode = await this.promoCodeRepository.findOne({
      where: { code: code.toUpperCase() },
    });

    if (!promoCode) {
      throw new NotFoundException(`Promo code "${code}" not found`);
    }

    return promoCode;
  }

  public async validatePromoCode(validateDto: ValidatePromoCodeDto): Promise<{
    valid: boolean;
    promoCode?: PromoCode;
    discountAmount?: number;
    finalAmount?: number;
    message?: string;
  }> {
    try {
      const promoCode = await this.getPromoCodeByCode(validateDto.code);
      const now = new Date();

      if (!promoCode.isActive) {
        return { valid: false, message: 'Promo code is inactive' };
      }

      if (now < promoCode.validFrom) {
        return { valid: false, message: 'Promo code is not yet valid' };
      }

      if (now > promoCode.validUntil) {
        return { valid: false, message: 'Promo code has expired' };
      }

      if (
        promoCode.usageLimit &&
        promoCode.usageCount >= promoCode.usageLimit
      ) {
        return { valid: false, message: 'Promo code usage limit reached' };
      }

      if (
        promoCode.minPurchaseAmount &&
        validateDto.orderAmount < promoCode.minPurchaseAmount
      ) {
        return {
          valid: false,
          message: `Minimum purchase amount is ${promoCode.minPurchaseAmount}`,
        };
      }

      let discountAmount = 0;

      if (promoCode.discountType === DiscountType.PERCENTAGE) {
        discountAmount =
          (validateDto.orderAmount * promoCode.discountValue) / 100;

        if (
          promoCode.maxDiscountAmount &&
          discountAmount > promoCode.maxDiscountAmount
        ) {
          discountAmount = promoCode.maxDiscountAmount;
        }
      } else if (promoCode.discountType === DiscountType.FIXED) {
        discountAmount = promoCode.discountValue;
      }

      discountAmount = Math.min(discountAmount, validateDto.orderAmount);
      const finalAmount = validateDto.orderAmount - discountAmount;

      return {
        valid: true,
        promoCode,
        discountAmount: Math.round(discountAmount * 100) / 100,
        finalAmount: Math.round(finalAmount * 100) / 100,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return { valid: false, message: 'Invalid promo code' };
      }
      throw error;
    }
  }

  public async createPromoCode(
    promoCodeData: CreatePromoCodeDto,
  ): Promise<PromoCode> {
    const existingCode = await this.promoCodeRepository.findOne({
      where: { code: promoCodeData.code.toUpperCase() },
    });

    if (existingCode) {
      throw new ConflictException(
        `Promo code "${promoCodeData.code}" already exists`,
      );
    }

    const promoCode = this.promoCodeRepository.create({
      ...promoCodeData,
      code: promoCodeData.code.toUpperCase(),
    });

    return await this.promoCodeRepository.save(promoCode);
  }

  public async updatePromoCode(
    id: number,
    promoCodeData: UpdatePromoCodeDto,
  ): Promise<PromoCode> {
    const promoCode = await this.getPromoCodeById(id);

    if (promoCodeData.code && promoCodeData.code !== promoCode.code) {
      const existingCode = await this.promoCodeRepository.findOne({
        where: { code: promoCodeData.code.toUpperCase() },
      });

      if (existingCode) {
        throw new ConflictException(
          `Promo code "${promoCodeData.code}" already exists`,
        );
      }

      promoCodeData.code = promoCodeData.code.toUpperCase();
    }

    Object.assign(promoCode, promoCodeData);
    return await this.promoCodeRepository.save(promoCode);
  }

  public async incrementUsageCount(id: number): Promise<void> {
    await this.promoCodeRepository.increment({ id }, 'usageCount', 1);
  }

  public async deletePromoCode(id: number): Promise<void> {
    const promoCode = await this.getPromoCodeById(id);
    await this.promoCodeRepository.remove(promoCode);
  }
}
