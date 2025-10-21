# Микросервисная архитектура Marketplace

## 📁 Структура проекта

```
backend/
├── apps/
│   ├── api-gateway/          # HTTP API Gateway (порт 3000)
│   └── promo-service/        # PromoCode Microservice (RabbitMQ)
├── libs/
│   └── shared/              # Общие библиотеки (типы, константы, конфиги)
├── docker-compose.yml        # PostgreSQL, RabbitMQ, pgAdmin
└── package.json
```

## 🚀 Запуск системы

### 1. Запустить инфраструктуру (Docker)

```bash
docker-compose up -d
```

Запустятся:
- **PostgreSQL** - 127.0.0.1:5433
- **RabbitMQ** - 127.0.0.1:5672
- **RabbitMQ Management UI** - http://localhost:15672 (marketplace/marketplace)
- **pgAdmin** - http://localhost:5050 (marketplace@admin.com/marketplace)

### 2. Запустить PromoCode Microservice

```bash
npm run start:promo:dev
```

Микросервис подключится к RabbitMQ и будет слушать очередь `promo_code_queue`.

### 3. Запустить API Gateway

```bash
npm run start:dev
```

API Gateway запустится на http://localhost:3000 и будет проксировать запросы в микросервисы.

---

## 📡 Коммуникация между сервисами

### RabbitMQ Message Patterns

#### PromoCode Service:
- `get_all_promo_codes` - получить все промокоды
- `get_active_promo_codes` - получить активные промокоды
- `get_promo_code` - получить по ID
- `get_promo_code_by_code` - получить по коду
- `validate_promo_code` - валидация промокода
- `create_promo_code` - создать промокод
- `update_promo_code` - обновить промокод
- `delete_promo_code` - удалить промокод

### Формат ответа от микросервиса:

```typescript
{
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}
```

---

## 🧪 Тестирование

### Через Swagger UI

Откройте http://localhost:3000/api-docs

Все запросы к `/promo-codes/*` будут автоматически проксироваться в PromoCode Service через RabbitMQ.

### Через cURL

```bash
# Получить все промокоды
curl http://localhost:3000/promo-codes

# Создать промокод
curl -X POST http://localhost:3000/promo-codes \
  -H "Content-Type: application/json" \
  -d '{
    "code": "SUMMER2024",
    "discountType": "percentage",
    "discountValue": 20,
    "validFrom": "2024-01-01",
    "validUntil": "2024-12-31",
    "isActive": true
  }'

# Валидировать промокод
curl -X POST http://localhost:3000/promo-codes/validate \
  -H "Content-Type: application/json" \
  -d '{
    "code": "SUMMER2024",
    "orderAmount": 100
  }'
```

---

## 🛠️ Команды NPM

### Сборка
```bash
npm run build              # Собрать все
npm run build:gateway      # Собрать API Gateway
npm run build:promo        # Собрать PromoCode Service
```

### Разработка
```bash
npm run start:dev          # API Gateway в режиме разработки
npm run start:promo:dev    # PromoCode Service в режиме разработки
```

### Production
```bash
npm run start:prod         # API Gateway
npm run start:promo:prod   # PromoCode Service
```

---

## 📊 Мониторинг

### RabbitMQ Management UI
http://localhost:15672
- **Login:** marketplace
- **Password:** marketplace

Здесь можно:
- Просматривать очереди и сообщения
- Мониторить нагрузку
- Проверять статус подключений

### PostgreSQL (через pgAdmin)
http://localhost:5050
- **Login:** marketplace@admin.com
- **Password:** marketplace

---

## 🔧 Конфигурация

### .env файл

```env
# PostgreSQL
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5433
POSTGRES_USERNAME=marketplace
POSTGRES_PASSWORD=marketplace
POSTGRES_DATABASE=marketplace

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# RabbitMQ
RABBITMQ_HOST=127.0.0.1
RABBITMQ_PORT=5672
RABBITMQ_USER=marketplace
RABBITMQ_PASSWORD=marketplace
RABBITMQ_VHOST=marketplace_vhost
```

---

## 🏗️ Добавление нового микросервиса

### 1. Создать структуру

```bash
mkdir apps/new-service
mkdir apps/new-service/src
```

### 2. Создать main.ts

```typescript
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { NewServiceModule } from './new-service.module';
import { getRabbitMQConfig } from '@app/shared';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    NewServiceModule,
    getRabbitMQConfig('new_service_queue'),
  );
  await app.listen();
}
bootstrap();
```

### 3. Добавить в nest-cli.json

```json
"new-service": {
  "type": "application",
  "root": "apps/new-service",
  "entryFile": "main",
  "sourceRoot": "apps/new-service/src",
  "compilerOptions": {
    "tsConfigPath": "apps/new-service/tsconfig.app.json"
  }
}
```

### 4. Добавить скрипты в package.json

```json
"start:new": "nest start new-service",
"start:new:dev": "nest start new-service --watch",
"build:new": "nest build new-service"
```

---

## 📝 Следующие шаги

1. ✅ PromoCode Service - **выделен**
2. ⏳ Product Service - каталог товаров
3. ⏳ Order Service - управление заказами
4. ⏳ User Service - пользователи и авторизация
5. ⏳ Review Service - отзывы и рейтинги
6. ⏳ Analytics Service - аналитика

---

## 🐛 Troubleshooting

### Микросервис не запускается

1. Проверьте, что RabbitMQ запущен:
```bash
docker ps | findstr rabbitmq
```

2. Проверьте логи RabbitMQ:
```bash
docker logs marketplace_rabbitmq
```

### Сообщения не доставляются

1. Откройте RabbitMQ Management UI
2. Проверьте наличие очереди `promo_code_queue`
3. Убедитесь, что микросервис подключен (Connections)

### База данных недоступна

```bash
docker-compose restart marketplace_postgres
```

---

## 📚 Полезные ссылки

- [NestJS Microservices](https://docs.nestjs.com/microservices/basics)
- [RabbitMQ Documentation](https://www.rabbitmq.com/documentation.html)
- [TypeORM Documentation](https://typeorm.io/)
