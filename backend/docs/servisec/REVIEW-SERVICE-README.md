# ⭐ Review Service - Документация

## 📋 Описание

Review Service - это микросервис для управления отзывами и рейтингами продуктов в маркетплейсе. Сервис работает через RabbitMQ и обеспечивает полный функционал для создания, чтения, обновления и удаления отзывов.

## 🏗️ Архитектура

```
┌─────────────────┐
│   API Gateway   │
│   (Port 3000)   │
└────────┬────────┘
         │ HTTP
         │
         ▼
┌─────────────────┐
│  Review Proxy   │
│   Controller    │
└────────┬────────┘
         │ RabbitMQ
         │
         ▼
┌─────────────────┐
│ Review Service  │
│  (review_queue) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   PostgreSQL    │
│   (Port 5433)   │
└─────────────────┘
```

## 🚀 Запуск сервиса

### Предварительные требования

1. PostgreSQL (порт 5433)
2. RabbitMQ (порт 5672)
3. Node.js 18+

### Запуск инфраструктуры

```bash
cd backend
docker-compose up -d
```

### Запуск Review Service

```bash
# Development mode
npm run start:review:dev

# Production mode
npm run start:review:prod
```

### Запуск API Gateway

```bash
npm run start:dev
```

## 📊 База данных

### Таблица: reviews

| Поле       | Тип      | Описание                    |
| ---------- | -------- | --------------------------- |
| id         | int      | Primary Key                 |
| user_id    | int      | ID пользователя             |
| product_id | int      | ID продукта                 |
| rating     | int      | Рейтинг (1-5)               |
| comment    | text     | Текст отзыва (опционально)  |
| created_at | datetime | Дата создания               |
| updated_at | datetime | Дата обновления             |

### Индексы

- `user_id` - для быстрого поиска отзывов пользователя
- `product_id` - для быстрого поиска отзывов продукта

## 🔌 API Endpoints

### 1. Получить все отзывы

```http
GET /reviews
```

**Response:**

```json
[
  {
    "id": 1,
    "userId": 1,
    "productId": 1,
    "rating": 5,
    "comment": "Excellent product!",
    "createdAt": "2025-10-24T10:00:00Z",
    "updatedAt": "2025-10-24T10:00:00Z"
  }
]
```

### 2. Получить отзыв по ID

```http
GET /reviews/:id
```

**Response:**

```json
{
  "id": 1,
  "userId": 1,
  "productId": 1,
  "rating": 5,
  "comment": "Excellent product!",
  "createdAt": "2025-10-24T10:00:00Z",
  "updatedAt": "2025-10-24T10:00:00Z"
}
```

### 3. Получить отзывы по продукту

```http
GET /reviews/product/:productId
```

**Response:**

```json
[
  {
    "id": 1,
    "userId": 1,
    "productId": 1,
    "rating": 5,
    "comment": "Excellent product!",
    "createdAt": "2025-10-24T10:00:00Z",
    "updatedAt": "2025-10-24T10:00:00Z"
  }
]
```

### 4. Получить рейтинг продукта

```http
GET /reviews/product/:productId/rating
```

**Response:**

```json
{
  "averageRating": 4.5,
  "totalReviews": 10
}
```

### 5. Получить отзывы пользователя

```http
GET /reviews/user/:userId
```

**Response:**

```json
[
  {
    "id": 1,
    "userId": 1,
    "productId": 1,
    "rating": 5,
    "comment": "Excellent product!",
    "createdAt": "2025-10-24T10:00:00Z",
    "updatedAt": "2025-10-24T10:00:00Z"
  }
]
```

### 6. Создать отзыв

```http
POST /reviews
Content-Type: application/json

{
  "userId": 1,
  "productId": 1,
  "rating": 5,
  "comment": "Excellent product!"
}
```

**Response:**

```json
{
  "id": 1,
  "userId": 1,
  "productId": 1,
  "rating": 5,
  "comment": "Excellent product!",
  "createdAt": "2025-10-24T10:00:00Z",
  "updatedAt": "2025-10-24T10:00:00Z"
}
```

**Errors:**

- `409 Conflict` - Пользователь уже оставил отзыв на этот продукт

### 7. Обновить отзыв

```http
PUT /reviews/:id/user/:userId
Content-Type: application/json

{
  "rating": 4,
  "comment": "Good product"
}
```

**Response:**

```json
{
  "id": 1,
  "userId": 1,
  "productId": 1,
  "rating": 4,
  "comment": "Good product",
  "createdAt": "2025-10-24T10:00:00Z",
  "updatedAt": "2025-10-24T10:30:00Z"
}
```

**Errors:**

- `403 Forbidden` - Пользователь может обновлять только свои отзывы
- `404 Not Found` - Отзыв не найден

### 8. Удалить отзыв

```http
DELETE /reviews/:id/user/:userId
```

**Response:** `204 No Content`

**Errors:**

- `403 Forbidden` - Пользователь может удалять только свои отзывы
- `404 Not Found` - Отзыв не найден

## 🔄 RabbitMQ Messages

### Patterns

| Pattern                  | Описание                    |
| ------------------------ | --------------------------- |
| `get_all_reviews`        | Получить все отзывы         |
| `get_review_by_id`       | Получить отзыв по ID        |
| `get_reviews_by_product` | Получить отзывы продукта    |
| `get_product_rating`     | Получить рейтинг продукта   |
| `get_reviews_by_user`    | Получить отзывы пользователя|
| `create_review`          | Создать отзыв               |
| `update_review`          | Обновить отзыв              |
| `delete_review`          | Удалить отзыв               |

### Очередь

- **Имя:** `review_queue`
- **Durable:** true
- **Prefetch:** 1

## 🧪 Тестирование

### Автоматическое тестирование

```bash
.\test-review-service.ps1
```

### Ручное тестирование

```powershell
# Создать отзыв
$body = @{
    userId = 1
    productId = 1
    rating = 5
    comment = "Excellent product!"
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:3000/reviews -Method Post -Body $body -ContentType "application/json"

# Получить все отзывы
Invoke-RestMethod -Uri http://localhost:3000/reviews -Method Get

# Получить рейтинг продукта
Invoke-RestMethod -Uri http://localhost:3000/reviews/product/1/rating -Method Get
```

## 📝 Бизнес-логика

### Правила создания отзывов

1. Пользователь может оставить только один отзыв на продукт
2. Рейтинг должен быть от 1 до 5
3. Комментарий опционален

### Правила обновления отзывов

1. Пользователь может обновлять только свои отзывы
2. Можно обновить рейтинг и/или комментарий

### Правила удаления отзывов

1. Пользователь может удалять только свои отзывы

### Расчет рейтинга

- Средний рейтинг округляется до 1 знака после запятой
- Если отзывов нет, рейтинг = 0

## 🔒 Безопасность

### Валидация

- `userId` - обязательное поле, число
- `productId` - обязательное поле, число
- `rating` - обязательное поле, число от 1 до 5
- `comment` - опциональное поле, строка

### Авторизация

- Обновление отзыва: только автор
- Удаление отзыва: только автор

## 📈 Производительность

### Оптимизации

1. **Индексы на базе данных:**
   - `user_id` - для быстрого поиска отзывов пользователя
   - `product_id` - для быстрого поиска отзывов продукта

2. **Кэширование:**
   - Рейтинг продукта можно кэшировать (в будущем)

3. **Пагинация:**
   - Можно добавить пагинацию для больших списков (в будущем)

## 🐛 Обработка ошибок

| Код | Описание                                      |
| --- | --------------------------------------------- |
| 200 | Успешный запрос                               |
| 201 | Отзыв создан                                  |
| 204 | Отзыв удален                                  |
| 404 | Отзыв не найден                               |
| 409 | Отзыв уже существует                          |
| 403 | Нет прав на изменение/удаление                |
| 500 | Внутренняя ошибка сервера                     |

## 📦 Зависимости

```json
{
  "@nestjs/common": "^11.0.1",
  "@nestjs/microservices": "^11.1.7",
  "@nestjs/typeorm": "^11.0.0",
  "typeorm": "^0.3.27",
  "pg": "^8.16.3",
  "amqplib": "^0.10.9",
  "class-validator": "^0.14.2",
  "class-transformer": "^0.5.1"
}
```

## 🔧 Конфигурация

### Переменные окружения (.env)

```env
# Database
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=marketplace
DB_PASSWORD=marketplace
DB_DATABASE=marketplace

# RabbitMQ
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_USER=marketplace
RABBITMQ_PASSWORD=marketplace
RABBITMQ_VHOST=marketplace_vhost
```

## 📊 Мониторинг

### Логи

```bash
# Review Service запущен
⭐ Review Service is listening on RabbitMQ
```

### RabbitMQ Management UI

- URL: http://localhost:15672
- Login: marketplace / marketplace
- Очередь: `review_queue`

### PostgreSQL

- Порт: 5433
- База: marketplace
- Таблица: reviews

## 🚀 Развертывание

### Docker (в будущем)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/apps/review-service ./
CMD ["node", "main.js"]
```

## 📚 Дополнительные материалы

- [NestJS Microservices](https://docs.nestjs.com/microservices/basics)
- [RabbitMQ Documentation](https://www.rabbitmq.com/documentation.html)
- [TypeORM Documentation](https://typeorm.io/)

## 🤝 Интеграция с другими сервисами

### Product Service

- Получение информации о продукте (в будущем)
- Обновление рейтинга продукта (в будущем)

### User Service

- Проверка существования пользователя (в будущем)
- Получение информации о пользователе (в будущем)

### Order Service

- Проверка, что пользователь купил продукт (в будущем)
- Разрешение оставлять отзывы только после покупки (в будущем)

## 📝 TODO

- [ ] Добавить пагинацию
- [ ] Добавить сортировку отзывов
- [ ] Добавить фильтрацию по рейтингу
- [ ] Добавить модерацию отзывов
- [ ] Добавить возможность отвечать на отзывы
- [ ] Добавить лайки/дизлайки отзывов
- [ ] Добавить загрузку изображений к отзывам
- [ ] Добавить проверку покупки перед созданием отзыва
- [ ] Добавить кэширование рейтингов
- [ ] Добавить уведомления о новых отзывах

---

**Версия:** 1.0.0  
**Дата:** 24 октября 2025  
**Статус:** ✅ Готов к использованию
