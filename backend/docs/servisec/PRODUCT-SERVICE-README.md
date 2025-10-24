# Product Service - Микросервис для управления продуктами и категориями

## ✅ Статус

Product Service успешно выделен в отдельный микросервис и протестирован!

## 🏗️ Архитектура

```
API Gateway (HTTP :3000)
    ↓ RabbitMQ
Product Service (Microservice)
    ├── Product Module (товары)
    ├── Category Module (категории)
    └── ProductView Module (просмотры товаров)
```

## 🚀 Запуск

### 1. Запустить инфраструктуру (Docker)

```bash
docker-compose up -d
```

### 2. Запустить Product Service

```bash
npm run start:product:dev
```

### 3. Запустить API Gateway

```bash
npm run start:dev
```

## 📡 API Endpoints

### Products

- `GET /products` - Получить все продукты
- `GET /products/search?search=...` - Поиск продуктов
- `GET /products/:id` - Получить продукт по ID
- `POST /products` - Создать продукт
- `PUT /products/:id` - Обновить продукт
- `DELETE /products/:id` - Удалить продукт

### Categories

- `GET /categories` - Получить все категории
- `GET /categories/tree` - Получить дерево категорий
- `GET /categories/root` - Получить корневые категории
- `GET /categories/:id` - Получить категорию по ID
- `GET /categories/slug/:slug` - Получить категорию по slug
- `GET /categories/:id/children` - Получить дочерние категории
- `POST /categories` - Создать категорию
- `PUT /categories/:id` - Обновить категорию
- `DELETE /categories/:id` - Удалить категорию

### Product Views

- `POST /product-views` - Записать просмотр
- `GET /product-views/user/:userId/recent` - Недавно просмотренные пользователем
- `GET /product-views/product/:productId/count` - Количество просмотров продукта
- `GET /product-views/trending` - Трендовые продукты
- `GET /product-views/popular` - Популярные продукты

## 🧪 Тестирование

Запустите тестовый скрипт:

```bash
.\test-product-service.ps1
```

### Примеры запросов

#### Создать категорию

```powershell
Invoke-RestMethod -Uri http://localhost:3000/categories -Method POST -ContentType "application/json" -Body '{"name":"Electronics","slug":"electronics","description":"Electronic devices"}'
```

#### Создать продукт

```powershell
Invoke-RestMethod -Uri http://localhost:3000/products -Method POST -ContentType "application/json" -Body '{"title":"iPhone 15 Pro","description":"Latest Apple smartphone","price":999.99,"stock":50,"categoryId":1}'
```

#### Поиск продуктов

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/products/search?search=iphone" -Method GET
```

#### Обновить продукт

```powershell
Invoke-RestMethod -Uri http://localhost:3000/products/1 -Method PUT -ContentType "application/json" -Body '{"price":899.99,"stock":45}'
```

## 📊 RabbitMQ Message Patterns

### Product Patterns

- `get_all_products` - Получить все продукты
- `search_products` - Поиск продуктов
- `get_product` - Получить продукт по ID
- `create_product` - Создать продукт
- `update_product` - Обновить продукт
- `delete_product` - Удалить продукт
- `update_stock` - Обновить остаток

### Category Patterns

- `get_all_categories` - Получить все категории
- `get_root_categories` - Получить корневые категории
- `get_category_tree` - Получить дерево категорий
- `get_category` - Получить категорию по ID
- `get_category_by_slug` - Получить категорию по slug
- `get_child_categories` - Получить дочерние категории
- `create_category` - Создать категорию
- `update_category` - Обновить категорию
- `delete_category` - Удалить категорию

### ProductView Patterns

- `track_product_view` - Записать просмотр
- `get_recently_viewed` - Недавно просмотренные
- `get_product_view_count` - Количество просмотров
- `get_trending_products` - Трендовые продукты
- `get_popular_products` - Популярные продукты

## ✅ Результаты тестирования

Все основные функции протестированы и работают:

- ✅ Создание категорий
- ✅ Получение дерева категорий
- ✅ Создание продуктов
- ✅ Поиск продуктов
- ✅ Обновление продуктов
- ✅ Получение продуктов с категориями
- ✅ Работа через RabbitMQ
- ✅ API Gateway проксирование

## 🔧 Конфигурация

### package.json scripts

```json
"start:product": "nest start product-service",
"start:product:dev": "nest start product-service --watch",
"start:product:prod": "node dist/apps/product-service/main",
"build:product": "nest build product-service"
```

### nest-cli.json

```json
"product-service": {
  "type": "application",
  "root": "apps/product-service",
  "entryFile": "main",
  "sourceRoot": "apps/product-service/src",
  "compilerOptions": {
    "tsConfigPath": "apps/product-service/tsconfig.app.json"
  }
}
```

## 📝 Следующие шаги

1. ✅ PromoCode Service - выделен и работает
2. ✅ Product Service - выделен и работает
3. ⏳ Order Service - следующий на очереди
4. ⏳ User Service - управление пользователями
5. ⏳ Review Service - отзывы и рейтинги

## 🐛 Известные проблемы

- ProductView возвращает пустой ответ при создании (но данные сохраняются)
- Нужно добавить валидацию и обработку ошибок

## 📚 Документация

- [MICROSERVICES.md](./MICROSERVICES.md) - Общая документация по микросервисам
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Архитектура системы
