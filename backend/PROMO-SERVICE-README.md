# PromoCode Service - Микросервис для управления промокодами

## ✅ Статус

PromoCode Service успешно выделен в отдельный микросервис и протестирован!

## 🏗️ Архитектура

```
API Gateway (HTTP :3000)
    ↓ RabbitMQ
PromoCode Service (Microservice)
    └── PromoCode Module
        ├── Создание промокодов
        ├── Валидация промокодов
        ├── Управление скидками
        └── Контроль использования
```

## 🚀 Запуск

### 1. Запустить инфраструктуру (Docker)

```bash
docker-compose up -d
```

### 2. Запустить PromoCode Service

```bash
npm run start:promo:dev
```

### 3. Запустить API Gateway

```bash
npm run start:dev
```

## 📡 API Endpoints

### Promo Codes

- `GET /promo-codes` - Получить все промокоды
- `GET /promo-codes/active` - Получить активные промокоды
- `GET /promo-codes/:id` - Получить промокод по ID
- `GET /promo-codes/code/:code` - Получить промокод по коду
- `POST /promo-codes/validate` - Валидировать промокод
- `POST /promo-codes` - Создать промокод
- `PUT /promo-codes/:id` - Обновить промокод
- `DELETE /promo-codes/:id` - Удалить промокод

## 🧪 Тестирование

### Примеры запросов

#### Создать промокод (процентная скидка)

```powershell
Invoke-RestMethod -Uri http://localhost:3000/promo-codes -Method POST -ContentType "application/json" -Body '{
  "code": "WINTER2025",
  "description": "Winter sale 2025",
  "discountType": "percentage",
  "discountValue": 15,
  "validFrom": "2025-01-01",
  "validUntil": "2025-12-31",
  "isActive": true
}'
```

#### Создать промокод (фиксированная скидка)

```powershell
Invoke-RestMethod -Uri http://localhost:3000/promo-codes -Method POST -ContentType "application/json" -Body '{
  "code": "SAVE50",
  "description": "Save $50 on your order",
  "discountType": "fixed",
  "discountValue": 50,
  "minPurchaseAmount": 200,
  "validFrom": "2025-01-01",
  "validUntil": "2025-12-31",
  "isActive": true
}'
```

#### Создать промокод с ограничениями

```powershell
Invoke-RestMethod -Uri http://localhost:3000/promo-codes -Method POST -ContentType "application/json" -Body '{
  "code": "FIRST100",
  "description": "First 100 customers",
  "discountType": "percentage",
  "discountValue": 20,
  "maxDiscountAmount": 100,
  "usageLimit": 100,
  "validFrom": "2025-01-01",
  "validUntil": "2025-12-31",
  "isActive": true
}'
```

#### Валидировать промокод

```powershell
Invoke-RestMethod -Uri http://localhost:3000/promo-codes/validate -Method POST -ContentType "application/json" -Body '{
  "code": "WINTER2025",
  "orderAmount": 100
}'
```

**Ответ:**
```json
{
  "valid": true,
  "promoCode": {
    "id": 1,
    "code": "WINTER2025",
    "discountType": "percentage",
    "discountValue": 15
  },
  "discountAmount": 15,
  "finalAmount": 85
}
```

#### Получить все активные промокоды

```powershell
Invoke-RestMethod -Uri http://localhost:3000/promo-codes/active -Method GET
```

#### Обновить промокод

```powershell
Invoke-RestMethod -Uri http://localhost:3000/promo-codes/1 -Method PUT -ContentType "application/json" -Body '{
  "discountValue": 20,
  "isActive": true
}'
```

## 📊 RabbitMQ Message Patterns

### PromoCode Patterns

- `get_all_promo_codes` - Получить все промокоды
- `get_active_promo_codes` - Получить активные промокоды
- `get_promo_code` - Получить промокод по ID
- `get_promo_code_by_code` - Получить промокод по коду
- `validate_promo_code` - Валидировать промокод
- `create_promo_code` - Создать промокод
- `update_promo_code` - Обновить промокод
- `delete_promo_code` - Удалить промокод

## 💡 Типы скидок

### Процентная скидка (percentage)

```json
{
  "discountType": "percentage",
  "discountValue": 15
}
```

- Скидка в процентах от суммы заказа
- Можно ограничить максимальную сумму скидки через `maxDiscountAmount`

**Пример:**
- Заказ: $100
- Скидка: 15%
- Сумма скидки: $15
- Итого: $85

### Фиксированная скидка (fixed)

```json
{
  "discountType": "fixed",
  "discountValue": 50
}
```

- Фиксированная сумма скидки
- Не может превышать сумму заказа

**Пример:**
- Заказ: $200
- Скидка: $50
- Итого: $150

## 🔒 Ограничения и валидация

### Минимальная сумма заказа

```json
{
  "minPurchaseAmount": 100
}
```

Промокод применяется только если сумма заказа >= minPurchaseAmount

### Максимальная сумма скидки

```json
{
  "maxDiscountAmount": 50
}
```

Ограничивает максимальную сумму скидки (для процентных скидок)

### Лимит использования

```json
{
  "usageLimit": 100,
  "usageCount": 45
}
```

- `usageLimit` - максимальное количество использований
- `usageCount` - текущее количество использований
- Промокод недоступен когда `usageCount >= usageLimit`

### Период действия

```json
{
  "validFrom": "2025-01-01",
  "validUntil": "2025-12-31"
}
```

Промокод действителен только в указанный период

### Активность

```json
{
  "isActive": true
}
```

Неактивные промокоды не могут быть использованы

## ✅ Результаты валидации

### Успешная валидация

```json
{
  "valid": true,
  "promoCode": { ... },
  "discountAmount": 15,
  "finalAmount": 85
}
```

### Ошибки валидации

```json
{
  "valid": false,
  "message": "Promo code has expired"
}
```

**Возможные сообщения об ошибках:**
- `"Invalid promo code"` - промокод не найден
- `"Promo code is inactive"` - промокод неактивен
- `"Promo code is not yet valid"` - промокод еще не действителен
- `"Promo code has expired"` - промокод истек
- `"Promo code usage limit reached"` - достигнут лимит использования
- `"Minimum purchase amount is X"` - не достигнута минимальная сумма заказа

## 📝 DTO (Data Transfer Objects)

### CreatePromoCodeDto

```typescript
{
  code: string;                    // Код промокода (обязательно)
  description?: string;            // Описание
  discountType: 'percentage' | 'fixed';  // Тип скидки (обязательно)
  discountValue: number;           // Значение скидки (обязательно)
  minPurchaseAmount?: number;      // Минимальная сумма заказа
  maxDiscountAmount?: number;      // Максимальная сумма скидки
  usageLimit?: number;             // Лимит использования
  validFrom: Date;                 // Начало действия (обязательно)
  validUntil: Date;                // Конец действия (обязательно)
  isActive: boolean;               // Активность (обязательно)
}
```

### UpdatePromoCodeDto

Все поля опциональны (можно обновить только нужные)

### ValidatePromoCodeDto

```typescript
{
  code: string;        // Код промокода (обязательно)
  orderAmount: number; // Сумма заказа (обязательно)
}
```

## 🗄️ База данных

### Таблица: promo_codes

| Поле | Тип | Описание |
|------|-----|----------|
| id | integer | Первичный ключ |
| code | varchar | Код промокода (уникальный) |
| description | text | Описание |
| discount_type | enum | Тип скидки (percentage/fixed) |
| discount_value | decimal | Значение скидки |
| min_purchase_amount | decimal | Минимальная сумма заказа |
| max_discount_amount | decimal | Максимальная сумма скидки |
| usage_limit | integer | Лимит использования |
| usage_count | integer | Количество использований |
| valid_from | timestamp | Начало действия |
| valid_until | timestamp | Конец действия |
| is_active | boolean | Активность |
| created_at | timestamp | Дата создания |
| updated_at | timestamp | Дата обновления |

## 🔧 Конфигурация

### package.json scripts

```json
"start:promo": "nest start promo-service",
"start:promo:dev": "nest start promo-service --watch",
"start:promo:prod": "node dist/apps/promo-service/main",
"build:promo": "nest build promo-service"
```

### nest-cli.json

```json
"promo-service": {
  "type": "application",
  "root": "apps/promo-service",
  "entryFile": "main",
  "sourceRoot": "apps/promo-service/src",
  "compilerOptions": {
    "tsConfigPath": "apps/promo-service/tsconfig.app.json"
  }
}
```

## 🎯 Примеры использования

### Сценарий 1: Процентная скидка 20%

```bash
# Создать промокод
POST /promo-codes
{
  "code": "SALE20",
  "discountType": "percentage",
  "discountValue": 20,
  "validFrom": "2025-01-01",
  "validUntil": "2025-12-31",
  "isActive": true
}

# Валидировать для заказа $100
POST /promo-codes/validate
{
  "code": "SALE20",
  "orderAmount": 100
}

# Результат:
# discountAmount: $20
# finalAmount: $80
```

### Сценарий 2: Фиксированная скидка $50 при заказе от $200

```bash
# Создать промокод
POST /promo-codes
{
  "code": "SAVE50",
  "discountType": "fixed",
  "discountValue": 50,
  "minPurchaseAmount": 200,
  "validFrom": "2025-01-01",
  "validUntil": "2025-12-31",
  "isActive": true
}

# Валидировать для заказа $250
POST /promo-codes/validate
{
  "code": "SAVE50",
  "orderAmount": 250
}

# Результат:
# discountAmount: $50
# finalAmount: $200
```

### Сценарий 3: Скидка 30% (макс. $100) для первых 50 клиентов

```bash
# Создать промокод
POST /promo-codes
{
  "code": "FIRST50",
  "discountType": "percentage",
  "discountValue": 30,
  "maxDiscountAmount": 100,
  "usageLimit": 50,
  "validFrom": "2025-01-01",
  "validUntil": "2025-12-31",
  "isActive": true
}

# Валидировать для заказа $500
POST /promo-codes/validate
{
  "code": "FIRST50",
  "orderAmount": 500
}

# Результат:
# discountAmount: $100 (ограничено maxDiscountAmount)
# finalAmount: $400
```

## 📈 Мониторинг

### Проверка активных промокодов

```bash
GET /promo-codes/active
```

Возвращает только промокоды, которые:
- Активны (`isActive = true`)
- В пределах срока действия
- Не достигли лимита использования

### Статистика использования

```bash
GET /promo-codes/:id
```

Возвращает информацию о промокоде включая:
- `usageCount` - количество использований
- `usageLimit` - лимит использования

## 🔐 Безопасность

### Автоматическое преобразование кода

Все коды промокодов автоматически преобразуются в верхний регистр:
- Ввод: `"winter2025"`
- Сохранено: `"WINTER2025"`

### Уникальность кодов

Система не позволяет создать два промокода с одинаковым кодом.

### Валидация данных

Все входящие данные валидируются с помощью `class-validator`:
- Обязательные поля
- Типы данных
- Диапазоны значений

## 📚 Документация

- [MICROSERVICES.md](./MICROSERVICES.md) - Общая документация по микросервисам
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Архитектура системы
- [MICROSERVICES-STATUS.md](./MICROSERVICES-STATUS.md) - Статус всех сервисов

## 🐛 Troubleshooting

### Промокод не валидируется

1. Проверьте, что промокод активен (`isActive = true`)
2. Проверьте период действия (`validFrom` и `validUntil`)
3. Проверьте лимит использования (`usageCount < usageLimit`)
4. Проверьте минимальную сумму заказа (`orderAmount >= minPurchaseAmount`)

### Ошибка "Promo code already exists"

Код промокода должен быть уникальным. Используйте другой код или обновите существующий.

### Сервис не запускается

1. Проверьте, что RabbitMQ запущен: `docker ps | findstr rabbitmq`
2. Проверьте, что PostgreSQL запущен: `docker ps | findstr postgres`
3. Проверьте логи: `npm run start:promo:dev`

---

**Дата создания:** 24 октября 2025  
**Статус:** ✅ Готово и протестировано
