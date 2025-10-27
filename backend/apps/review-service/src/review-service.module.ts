import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewModule } from './review/review.module';
import { Review } from './review/review.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5433', 10),
      username: process.env.DB_USERNAME || 'marketplace',
      password: process.env.DB_PASSWORD || 'marketplace',
      database: process.env.DB_DATABASE || 'marketplace',
      entities: [Review],
      synchronize: true,
    }),
    ReviewModule,
  ],
})
export class ReviewServiceModule {}
