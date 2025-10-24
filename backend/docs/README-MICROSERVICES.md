# Микросервисная архитектура Marketplace

## ✅ Статус проекта

**Статус:** ВСЕ 5 МИКРОСЕРВИСОВ ГОТОВЫ И РАБОТАЮТ!

---

## 🚀 Готовые микросервисы

### 1. 🎫 PromoCode Service

**Статус:** ✅ Готов и протестирован

**Функционал:**

- Создание промокодов (процентные и фиксированные скидки)
- Валидация промокодов с проверкой всех ограничений
- Управление лимитами использования
- Контроль периода действия
- Автоматический расчет скидок

**Документация:**

- [services/PROMO-SERVICE-README.md](./services/PROMO-SERVICE-README.md) - Полная документация
- [../test-promo-service.ps1](../test-promo-service.ps1) / [.sh](../test-promo-service.sh) - Тестовые скрипты

**Очередь RabbitMQ:** `promo_code_queue`

---

### 2. 🛍️ Product Service

**Статус:** ✅ Готов и протестирован

**Модули:**

- **Product Module** - управление товарами
- **Category Module** - иерархия категорий
- **ProductView Module** - трекинг просмотров

**Функционал:**

- CRUD операции с товарами
- Поиск и фильтрация товаров
- Управление остатками
- Иерархическая структура категорий
- Дерево категорий
- Аналитика просмотров

**Документация:**

- [services/PRODUCT-SERVICE-README.md](./services/PRODUCT-SERVICE-README.md) - Полная документация
- [../test-product-service.ps1](../test-product-service.ps1) / [.sh](../test-product-service.sh) - Тестовые скрипты

**Очередь RabbitMQ:** `product_queue`

---

### 3. 🛒 Order Service

**Статус:** ✅ Готов и протестирован

**Модули:**

- **Order Module** - управление заказами
- **Cart Module** - корзина покупок

**Функционал:**

- Создание и управление заказами
- Управление статусами заказов
- История заказов пользователя
- Добавление товаров в корзину
- Обновление количества в корзине
- Автоматический пересчет суммы
- Интеграция с Product Service (проверка остатков, обновление stock)

**Документация:**

- [services/ORDER-SERVICE-README.md](./services/ORDER-SERVICE-README.md) - Полная документация
- [../test-order-service.ps1](../test-order-service.ps1) / [.sh](../test-order-service.sh) - Тестовые скрипты

**Очередь RabbitMQ:** `order_queue`

---

### 4. 👤 User Service

**Статус:** ✅ Готов и протестирован

**Модули:**

- **User Module** - управление пользователями
- **Auth Module** - аутентификация и авторизация
- **Address Module** - адреса доставки

**Функционал:**

- Регистрация и вход пользователей
- JWT аутентификация
- Управление профилем пользователя
- Управление адресами доставки
- Роли и права доступа

**Документация:**

- [services/USER-SERVICE-README.md](./services/USER-SERVICE-README.md) - Полная документация
- [../test-user-service.ps1](../test-user-service.ps1) / [.sh](../test-user-service.sh) - Тестовые скрипты

**Очередь RabbitMQ:** `user_queue`

---

### 5. ⭐ Review Service

**Статус:** ✅ Готов и протестирован

**Модули:**

- **Review Module** - управление отзывами
- **Rating Module** - рейтинги продуктов

**Функционал:**

- Создание и управление отзывами
- Рейтинги продуктов (1-5 звезд)
- Получение отзывов по продукту
- Получение отзывов по пользователю
- Расчет среднего рейтинга
- Защита от дублирования отзывов

**Документация:**

- [services/REVIEW-SERVICE-README.md](./services/REVIEW-SERVICE-README.md) - Полная документация
- [../test-review-service.ps1](../test-review-service.ps1) / [.sh](../test-review-service.sh) - Тестовые скрипты

**Очередь RabbitMQ:** `review_queue`

---

## 🏗️ Архитектура системы

```
┌──────────────────────────────────────────────────────────────┐
│                    Client (Browser/Mobile)                    │
└───────────────────────────┬──────────────────────────────────┘
                            │ HTTP/REST
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                   API Gateway :3000                           │
│  • HTTP Endpoints (Swagger: /api-docs)                       │
│  • RabbitMQ Client                                            │
│  • Request Validation                                         │
│  • Authentication & Authorization                             │
└───────────────────────────┬──────────────────────────────────┘
                            │ RabbitMQ (AMQP)
                            ▼
┌──────────────────────────────────────────────────────────────┐
│              RabbitMQ Message Broker :5672                    │
│              Management UI: http://localhost:15672            │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐        │
│  │product│ │order │ │user  │ │promo │ │review│        │
│  │_queue│ │_queue│ │_queue│ │_queue│ │_queue│        │
│  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘        │
└────┬─────────┬─────────┬─────────┬─────────┬────────────┘
     │         │         │         │         │
 ┌───▼──┐  ┌───▼──┐  ┌───▼──┐  ┌───▼──┐  ┌───▼──┐
 │Product│ │Order │ │User  │ │Promo │ │Review│
 │Service│ │Service│ │Service│ │Service│ │Service│
 │  🛍️  │ │  🛒  │ │  👤  │ │  🎫  │ │  ⭐  │
 └───┬──┘  └───┬──┘  └───┬──┘  └──────┘  └───┬──┘
     │         │         │                    │
     └─────────┴─────────┴────────────────────┘
                      │ TypeORM
                      ▼
     ┌────────────────────────────────────┐
     │      PostgreSQL :5433              │
     │  • products                        │
     │  • categories                      │
     │  • product_views                   │
     │  • promo_codes                     │
     └────────────────────────────────────┘
```

---

## 🚀 Быстрый старт

### 1. Запустить инфраструктуру

```bash
cd backend
docker-compose up -d
```

Запустятся:

- PostgreSQL (порт 5433)
- RabbitMQ (порт 5672, UI: 15672)
- pgAdmin (порт 5050)

### 2. Запустить микросервисы

**Автоматически (Windows):**

```bash
START-ALL.bat
```

**Автоматически (Linux/Mac):**

```bash
chmod +x START-ALL.sh
./START-ALL.sh
```

**Или вручную:**

```bash
npm run start:product:dev   # Product Service
npm run start:order:dev     # Order Service
npm run start:user:dev      # User Service
npm run start:promo:dev     # PromoCode Service
npm run start:review:dev    # Review Service
npm run start:dev           # API Gateway
```

### 3. Проверить работу

**Swagger UI:** http://localhost:3000/api-docs

**Или через тестовые скрипты:**

Windows:

```bash
.\test-product-service.ps1
.\test-order-service.ps1
.\test-user-service.ps1
.\test-promo-service.ps1
.\test-review-service.ps1
```

Linux/Mac:

```bash
./test-product-service.sh
./test-order-service.sh
./test-user-service.sh
./test-promo-service.sh
./test-review-service.sh
```

---

## 📡 API Endpoints

### Products & Categories

```
GET    /products              - Все товары
GET    /products/search       - Поиск товаров
GET    /products/:id          - Товар по ID
POST   /products              - Создать товар
PUT    /products/:id          - Обновить товар
DELETE /products/:id          - Удалить товар

GET    /categories            - Все категории
GET    /categories/tree       - Дерево категорий
GET    /categories/:id        - Категория по ID
POST   /categories            - Создать категорию
PUT    /categories/:id        - Обновить категорию
DELETE /categories/:id        - Удалить категорию
```

### Promo Codes

```
GET    /promo-codes           - Все промокоды
GET    /promo-codes/active    - Активные промокоды
GET    /promo-codes/:id       - Промокод по ID
POST   /promo-codes/validate  - Валидировать промокод
POST   /promo-codes           - Создать промокод
PUT    /promo-codes/:id       - Обновить промокод
DELETE /promo-codes/:id       - Удалить промокод
```

---

## 🧪 Примеры использования

### Создать категорию

```powershell
Invoke-RestMethod -Uri http://localhost:3000/categories -Method POST `
  -ContentType "application/json" -Body '{
    "name": "Electronics",
    "slug": "electronics",
    "description": "Electronic devices"
  }'
```

### Создать товар

```powershell
Invoke-RestMethod -Uri http://localhost:3000/products -Method POST `
  -ContentType "application/json" -Body '{
    "title": "iPhone 15 Pro",
    "description": "Latest Apple smartphone",
    "price": 999.99,
    "stock": 50,
    "categoryId": 1
  }'
```

### Создать промокод

```powershell
Invoke-RestMethod -Uri http://localhost:3000/promo-codes -Method POST `
  -ContentType "application/json" -Body '{
    "code": "WINTER2025",
    "discountType": "percentage",
    "discountValue": 15,
    "validFrom": "2025-01-01",
    "validUntil": "2025-12-31",
    "isActive": true
  }'
```

### Валидировать промокод

```powershell
Invoke-RestMethod -Uri http://localhost:3000/promo-codes/validate -Method POST `
  -ContentType "application/json" -Body '{
    "code": "WINTER2025",
    "orderAmount": 100
  }'
```

---

## 📊 Результаты тестирования

### ✅ Product Service

| Тест                  | Статус      |
| --------------------- | ----------- |
| Создание категорий    | ✅ Работает |
| Дерево категорий      | ✅ Работает |
| Создание товаров      | ✅ Работает |
| Поиск товаров         | ✅ Работает |
| Обновление товаров    | ✅ Работает |
| Связь товар-категория | ✅ Работает |

### ✅ PromoCode Service

| Тест                     | Статус      |
| ------------------------ | ----------- |
| Создание промокодов      | ✅ Работает |
| Валидация промокодов     | ✅ Работает |
| Процентная скидка        | ✅ Работает |
| Фиксированная скидка     | ✅ Работает |
| Минимальная сумма заказа | ✅ Работает |
| Максимальная скидка      | ✅ Работает |
| Лимит использования      | ✅ Работает |

---

## 🎯 Преимущества микросервисной архитектуры

### ✅ Изоляция

- Каждый сервис работает независимо
- Падение одного сервиса не роняет систему
- Легче локализовать и исправлять ошибки

### ✅ Масштабируемость

- Можно запустить несколько экземпляров каждого сервиса
- Горизонтальное масштабирование
- Балансировка нагрузки через RabbitMQ

### ✅ Разработка

- Разные команды работают параллельно
- Меньше конфликтов в Git
- Независимое развертывание

### ✅ Тестирование

- Легче тестировать изолированно
- Unit/Integration тесты для каждого сервиса
- Независимые CI/CD пайплайны

### ✅ Технологическая гибкость

- Разные БД для разных сервисов (в будущем)
- Разные языки программирования (в будущем)
- Независимый выбор технологий

---

## 📝 Следующие шаги

### Готово ✅

1. ✅ **PromoCode Service** - Управление промокодами
2. ✅ **Product Service** - Товары, категории, просмотры
3. ✅ **Order Service** - Заказы и корзина

4. ✅ **User Service** - Готов и протестирован
   - User Module (пользователи)
   - Auth Module (авторизация)
   - Address Module (адреса доставки)

5. ✅ **Review Service** - Готов и протестирован
   - Review Module (отзывы)
   - Rating Module (рейтинги)
   - Модерация отзывов

### 🎉 Все основные микросервисы готовы!

---

## 🔧 Конфигурация

### NPM Scripts

```json
{
  "start:dev": "nest start api-gateway --watch",
  "start:promo:dev": "nest start promo-service --watch",
  "start:product:dev": "nest start product-service --watch",

  "build": "nest build",
  "build:gateway": "nest build api-gateway",
  "build:promo": "nest build promo-service",
  "build:product": "nest build product-service"
}
```

### Environment Variables (.env)

```env
# PostgreSQL
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5433
POSTGRES_USERNAME=marketplace
POSTGRES_PASSWORD=marketplace
POSTGRES_DATABASE=marketplace

# JWT
JWT_SECRET=your-super-secret-jwt-key

# RabbitMQ
RABBITMQ_HOST=127.0.0.1
RABBITMQ_PORT=5672
RABBITMQ_USER=marketplace
RABBITMQ_PASSWORD=marketplace
RABBITMQ_VHOST=marketplace_vhost
```

---

## 🔗 Полезные ссылки

### Приложение

- **API Gateway:** http://localhost:3000
- **Swagger UI:** http://localhost:3000/api-docs

### Инфраструктура

- **RabbitMQ Management:** http://localhost:15672
  - Login: `marketplace` / `marketplace`
- **pgAdmin:** http://localhost:5050
  - Login: `marketplace@admin.com` / `marketplace`

### Документация

- [MICROSERVICES.md](./MICROSERVICES.md) - Общая документация
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Архитектура
- [MICROSERVICES-STATUS.md](./MICROSERVICES-STATUS.md) - Текущий статус

---

## 🐛 Troubleshooting

### Сервис не запускается

1. Проверьте Docker контейнеры:

```bash
docker ps
```

2. Проверьте логи RabbitMQ:

```bash
docker logs marketplace_rabbitmq
```

3. Проверьте логи PostgreSQL:

```bash
docker logs marketplace_postgres
```

### Сообщения не доставляются

1. Откройте RabbitMQ Management UI: http://localhost:15672
2. Проверьте наличие всех очередей:
   - `product_queue`
   - `order_queue`
   - `user_queue`
   - `promo_code_queue`
   - `review_queue`
3. Убедитесь, что все микросервисы подключены (вкладка Connections)

### База данных недоступна

```bash
# Перезапустить PostgreSQL
docker-compose restart marketplace_postgres

# Проверить подключение
docker exec -it marketplace_postgres psql -U marketplace -d marketplace
```

---

## 📚 Полная документация

### PromoCode Service 🎫

- [services/PROMO-SERVICE-README.md](./services/PROMO-SERVICE-README.md) - Полная документация
- [../test-promo-service.ps1](../test-promo-service.ps1) / [.sh](../test-promo-service.sh) - Тестовые скрипты

### Product Service 🛍️

- [services/PRODUCT-SERVICE-README.md](./services/PRODUCT-SERVICE-README.md) - Полная документация
- [../test-product-service.ps1](../test-product-service.ps1) / [.sh](../test-product-service.sh) - Тестовые скрипты

### Order Service 🛒

- [services/ORDER-SERVICE-README.md](./services/ORDER-SERVICE-README.md) - Полная документация
- [../test-order-service.ps1](../test-order-service.ps1) / [.sh](../test-order-service.sh) - Тестовые скрипты

### User Service 👤

- [services/USER-SERVICE-README.md](./services/USER-SERVICE-README.md) - Полная документация
- [../test-user-service.ps1](../test-user-service.ps1) / [.sh](../test-user-service.sh) - Тестовые скрипты

### Review Service ⭐

- [services/REVIEW-SERVICE-README.md](./services/REVIEW-SERVICE-README.md) - Полная документация
- [../test-review-service.ps1](../test-review-service.ps1) / [.sh](../test-review-service.sh) - Тестовые скрипты

### Общая документация

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Архитектурные диаграммы
- [../QUICK-START.md](../QUICK-START.md) - Быстрый старт

---

**Статус:** ✅ Система работает стабильно  
**Последнее обновление:** 24 октября 2025  
**Готовые сервисы:** 5 из 5 (100% завершено) 🎉
