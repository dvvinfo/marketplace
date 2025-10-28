import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Serve static files from uploads folder
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Marketplace API')
    .setDescription(
      'Complete e-commerce marketplace API with 14 modules: Auth, Users, Products, Cart, Orders, Favorites, Reviews, Categories, Search & Filters, Address Book, Promo Codes, Product Views, Admin Panel, and Analytics',
    )
    .setVersion('1.0')
    .addTag('Auth', 'Authentication endpoints (register, login, JWT)')
    .addTag('Users', 'User management')
    .addTag('Products', 'Product catalog with images')
    .addTag('Cart', 'Shopping cart operations')
    .addTag('Orders', 'Order management')
    .addTag('Favorites', 'User favorites/wishlist')
    .addTag('Reviews', 'Product reviews and ratings')
    .addTag('Categories', 'Product categories (nested)')
    .addTag('Addresses', 'Delivery addresses')
    .addTag('Promo Codes', 'Discount codes and coupons')
    .addTag('Product Views', 'Product view tracking and analytics')
    .addTag('Admin', 'Admin panel (role-protected)')
    .addTag('Analytics', 'Sales and revenue analytics')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    customSiteTitle: 'Marketplace API Documentation',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
    },
  });

  const port = process.env.PORT ?? 3001;
  console.log(`\n🚀 Server started on http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api-docs\n`);

  await app.listen(port);
}
bootstrap();
