# Order Service - Микросервис для управления заказами и корзиной

## ✅ Статус

Order Service успешно выделен в отдельный микросервис и протестирован!

## 🏗️ Архитектура

```
API Gateway (HTTP :3000)
    ↓ RabbitMQ
Order Service (Microservice)
    ├── Order Module (заказы)
    │   ├── Создание заказов
    │   ├── Управление статусами
    │   └── История заказов
    └── Cart Module (корзина)
        ├── Добавление товаров
        ├── Обновление количества
        └── Очистка корзины
```

## 🚀 Запуск

### 1. Запустить инфраструктуру (Docker)

```bash
docker-compose up -d
```

### 2. Запустить Order Service

```bash
npm run start:order:dev
```

### 3. Запустить API Gateway

```bash
npm run start:dev
```

## 📡 API Endpoints

### Orders

- `GET /orders` - Получить все заказы
- `GET /orders/:id` - Получить заказ по ID
- `GET /orders/user/:userId` - Получить заказы пользователя
- `POST /orders` - Создать заказ
- `PUT /orders/:id` - Обновить заказ (статус, адрес)
- `DELETE /orders/:id` - Удалить заказ

### Cart

- `GET /cart/user/:userId` - Получить корзину пользователя
- `POST /cart/add` - Добавить товар в корзину
- `PUT /cart/item/:itemId` - Обновить количество товара
- `DELETE /cart/item/:itemId` - Удалить товар из корзины
- `DELETE /cart/user/:userId/clear` - Очистить корзину

## 🧪 Тестирование

### Примеры запросов

#### Добавить товар в корзину

```powershell
Invoke-RestMethod -Uri http://localhost:3000/cart/add -Method POST -ContentType "application/json" -Body '{
  "userId": 1,
  "productId": 1,
  "quantity": 2
}'
```

#### Получить корзину

```powershell
Invoke-RestMethod -Uri http://localhost:3000/cart/user/1 -Method GET
```

**Ответ:**
```json
{
  "id": 1,
  "userId": 1,
  "items": [
    {
      "id": 1,
      "productId": 1,
      "quantity": 2,
      "price": 899.99,
      "subtotal": 1799.98
    }
  ],
  "totalAmount": 1799.98
}
```

#### Создать заказ

```powershell
Invoke-RestMethod -Uri http://localhost:3000/orders -Method POST -ContentType "application/json" -Body '{
  "userId": 1,
  "items": [
    {"productId": 1, "quantity": 2},
    {"productId": 2, "quantity": 1}
  ],
  "shippingAddress": "123 Main St, City, Country",
  "phone": "+1234567890",
  "notes": "Please deliver after 5 PM"
}'
```

**Ответ:**
```json
{
  "id": 1,
  "userId": 1,
  "status": "pending",
  "totalAmount": 2699.97,
  "shippingAddress": "123 Main St, City, Country",
  "phone": "+1234567890",
  "notes": "Please deliver after 5 PM",
  "items": [
    {
      "id": 1,
      "productId": 1,
      "quantity": 2,
      "price": 899.99,
      "subtotal": 1799.98
    },
    {
      "id": 2,
      "productId": 2,
      "quantity": 1,
      "price": 899.99,
      "subtotal": 899.99
    }
  ],
  "createdAt": "2025-10-24T12:00:00.000Z"
}
```

#### Получить заказы пользователя

```powershell
Invoke-RestMethod -Uri http://localhost:3000/orders/user/1 -Method GET
```

#### Обновить статус заказа

```powershell
Invoke-RestMethod -Uri http://localhost:3000/orders/1 -Method PUT -ContentType "application/json" -Body '{
  "status": "processing"
}'
```

#### Обновить количество товара в корзине

```powershell
Invoke-RestMethod -Uri http://localhost:3000/cart/item/1 -Method PUT -ContentType "application/json" -Body '{
  "quantity": 3
}'
```

#### Удалить товар из корзины

```powershell
Invoke-RestMethod -Uri http://localhost:3000/cart/item/1 -Method DELETE
```

#### Очистить корзину

```powershell
Invoke-RestMethod -Uri http://localhost:3000/cart/user/1/clear -Method DELETE
```

## 📊 RabbitMQ Message Patterns

### Order Patterns

- `get_all_orders` - Получить все заказы
- `get_order` - Получить заказ по ID
- `get_user_orders` - Получить заказы пользователя
- `create_order` - Создать заказ
- `update_order` - Обновить заказ
- `delete_order` - Удалить заказ

### Cart Patterns

- `get_cart` - Получить корзину
- `add_to_cart` - Добавить в корзину
- `update_cart_item` - Обновить товар в корзине
- `remove_cart_item` - Удалить товар из корзины
- `clear_cart` - Очистить корзину

## 💡 Статусы заказов

```typescript
enum E_OrderStatus {
  PENDING = 'pending',       // Ожидает обработки
  PROCESSING = 'processing', // В обработке
  SHIPPED = 'shipped',       // Отправлен
  DELIVERED = 'delivered',   // Доставлен
  CANCELLED = 'cancelled'    // Отменен
}
```

### Жизненный цикл заказа

```
PENDING → PROCESSING → SHIPPED → DELIVERED
   ↓
CANCELLED (возможна отмена на любом этапе)
```

## 🔄 Интеграция с Product Service

Order Service интегрируется с Product Service для:

### 1. Проверка наличия товара

При создании заказа проверяется:
- Существует ли товар
- Достаточно ли товара на складе

```typescript
const productResponse = await productClient.send('get_product', productId);
if (product.stock < quantity) {
  throw new BadRequestException('Insufficient stock');
}
```

### 2. Обновление остатков

После создания заказа автоматически обновляется stock:

```typescript
await productClient.send('update_stock', {
  id: productId,
  quantity: product.stock - orderQuantity
});
```

### 3. Получение актуальной цены

Цена берется из Product Service в момент создания заказа:
- Если есть скидка (`discountPrice`), используется она
- Иначе используется обычная цена (`price`)

```typescript
const price = product.discountPrice || product.price;
```

## 📝 DTO (Data Transfer Objects)

### CreateOrderDto

```typescript
{
  userId: number;              // ID пользователя (обязательно)
  items: OrderItemDto[];       // Товары в заказе (обязательно)
  shippingAddress: string;     // Адрес доставки (обязательно)
  phone: string;               // Телефон (обязательно)
  notes?: string;              // Примечания (опционально)
}
```

### OrderItemDto

```typescript
{
  productId: number;  // ID товара (обязательно)
  quantity: number;   // Количество, минимум 1 (обязательно)
}
```

### UpdateOrderDto

```typescript
{
  status?: E_OrderStatus;      // Новый статус
  shippingAddress?: string;    // Новый адрес
  phone?: string;              // Новый телефон
  notes?: string;              // Новые примечания
}
```

### AddToCartDto

```typescript
{
  userId: number;      // ID пользователя (обязательно)
  productId: number;   // ID товара (обязательно)
  quantity: number;    // Количество, минимум 1 (обязательно)
}
```

### UpdateCartItemDto

```typescript
{
  quantity: number;  // Новое количество, минимум 1 (обязательно)
}
```

## 🗄️ База данных

### Таблица: orders

| Поле | Тип | Описание |
|------|-----|----------|
| id | integer | Первичный ключ |
| user_id | integer | ID пользователя |
| status | enum | Статус заказа |
| total_amount | decimal | Общая сумма |
| shipping_address | text | Адрес доставки |
| phone | varchar | Телефон |
| notes | text | Примечания |
| created_at | timestamp | Дата создания |
| updated_at | timestamp | Дата обновления |

### Таблица: order_items

| Поле | Тип | Описание |
|------|-----|----------|
| id | integer | Первичный ключ |
| order_id | integer | ID заказа |
| product_id | integer | ID товара |
| quantity | integer | Количество |
| price | decimal | Цена на момент заказа |
| subtotal | decimal | Сумма (price × quantity) |

### Таблица: carts

| Поле | Тип | Описание |
|------|-----|----------|
| id | integer | Первичный ключ |
| user_id | integer | ID пользователя (уникальный) |
| total_amount | decimal | Общая сумма |
| created_at | timestamp | Дата создания |
| updated_at | timestamp | Дата обновления |

### Таблица: cart_items

| Поле | Тип | Описание |
|------|-----|----------|
| id | integer | Первичный ключ |
| cart_id | integer | ID корзины |
| product_id | integer | ID товара |
| quantity | integer | Количество |
| price | decimal | Цена |
| subtotal | decimal | Сумма (price × quantity) |

## 🔧 Конфигурация

### package.json scripts

```json
"start:order": "nest start order-service",
"start:order:dev": "nest start order-service --watch",
"start:order:prod": "node dist/apps/order-service/main",
"build:order": "nest build order-service"
```

### nest-cli.json

```json
"order-service": {
  "type": "application",
  "root": "apps/order-service",
  "entryFile": "main",
  "sourceRoot": "apps/order-service/src",
  "compilerOptions": {
    "tsConfigPath": "apps/order-service/tsconfig.app.json"
  }
}
```

## 🎯 Бизнес-логика

### Создание заказа

1. **Валидация товаров**
   - Проверка существования каждого товара
   - Проверка наличия на складе

2. **Расчет суммы**
   - Получение актуальной цены из Product Service
   - Применение скидок (если есть)
   - Подсчет subtotal для каждой позиции
   - Подсчет общей суммы заказа

3. **Обновление остатков**
   - Уменьшение stock для каждого товара
   - Отправка запроса в Product Service

4. **Создание заказа**
   - Сохранение заказа со статусом `pending`
   - Сохранение позиций заказа

### Работа с корзиной

1. **Добавление товара**
   - Проверка существования товара
   - Проверка наличия на складе
   - Если товар уже в корзине - увеличение количества
   - Иначе - создание новой позиции
   - Пересчет общей суммы

2. **Обновление количества**
   - Проверка наличия на складе
   - Обновление subtotal
   - Пересчет общей суммы корзины

3. **Удаление товара**
   - Удаление позиции из корзины
   - Пересчет общей суммы

4. **Очистка корзины**
   - Удаление всех позиций
   - Обнуление общей суммы

## 🔐 Валидация и ошибки

### Проверки при создании заказа

- ✅ Товар существует
- ✅ Достаточно товара на складе
- ✅ Количество больше 0
- ✅ Указан адрес доставки
- ✅ Указан телефон

### Возможные ошибки

```typescript
// Товар не найден
throw new NotFoundException('Product with ID X not found');

// Недостаточно товара
throw new BadRequestException(
  'Insufficient stock for product. Available: X'
);

// Заказ не найден
throw new NotFoundException('Order with ID X not found');

// Корзина не найдена
throw new NotFoundException('Cart not found for user X');
```

## 📈 Примеры использования

### Сценарий 1: Покупка одного товара

```bash
# 1. Добавить товар в корзину
POST /cart/add
{
  "userId": 1,
  "productId": 1,
  "quantity": 1
}

# 2. Создать заказ
POST /orders
{
  "userId": 1,
  "items": [{"productId": 1, "quantity": 1}],
  "shippingAddress": "123 Main St",
  "phone": "+1234567890"
}

# Результат:
# - Заказ создан со статусом "pending"
# - Stock товара уменьшен на 1
# - Корзина может быть очищена
```

### Сценарий 2: Покупка нескольких товаров

```bash
# 1. Добавить товары в корзину
POST /cart/add {"userId": 1, "productId": 1, "quantity": 2}
POST /cart/add {"userId": 1, "productId": 2, "quantity": 1}

# 2. Просмотреть корзину
GET /cart/user/1
# Ответ: totalAmount = 2699.97

# 3. Создать заказ из корзины
POST /orders
{
  "userId": 1,
  "items": [
    {"productId": 1, "quantity": 2},
    {"productId": 2, "quantity": 1}
  ],
  "shippingAddress": "123 Main St",
  "phone": "+1234567890"
}

# 4. Очистить корзину
DELETE /cart/user/1/clear
```

### Сценарий 3: Обновление заказа

```bash
# 1. Создать заказ
POST /orders {...}
# Ответ: id = 1, status = "pending"

# 2. Начать обработку
PUT /orders/1
{"status": "processing"}

# 3. Отправить заказ
PUT /orders/1
{"status": "shipped"}

# 4. Подтвердить доставку
PUT /orders/1
{"status": "delivered"}
```

### Сценарий 4: Отмена заказа

```bash
# Отменить заказ
PUT /orders/1
{"status": "cancelled"}

# Примечание: Stock НЕ восстанавливается автоматически
# Это нужно реализовать отдельно
```

## 🚨 Важные замечания

### Управление остатками

- ✅ Stock уменьшается при создании заказа
- ⚠️ Stock НЕ восстанавливается при отмене заказа (нужно реализовать)
- ⚠️ Stock НЕ резервируется при добавлении в корзину

### Корзина

- Корзина создается автоматически при первом добавлении товара
- Одна корзина на пользователя (user_id уникальный)
- Корзина не очищается автоматически после создания заказа

### Цены

- Цена фиксируется в момент создания заказа
- Изменение цены товара НЕ влияет на существующие заказы
- Используется цена со скидкой, если она есть

## 📚 Документация

- [MICROSERVICES.md](./MICROSERVICES.md) - Общая документация по микросервисам
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Архитектура системы
- [MICROSERVICES-STATUS.md](./MICROSERVICES-STATUS.md) - Статус всех сервисов

## 🐛 Troubleshooting

### Заказ не создается

1. Проверьте наличие товара на складе
2. Проверьте, что Product Service запущен
3. Проверьте логи Order Service
4. Проверьте подключение к RabbitMQ

### Корзина пустая после добавления

1. Проверьте, что товар существует
2. Проверьте наличие на складе
3. Проверьте логи Order Service

### Stock не обновляется

1. Проверьте, что Product Service запущен
2. Проверьте подключение к RabbitMQ
3. Проверьте логи обоих сервисов

### Сервис не запускается

```bash
# Проверить Docker контейнеры
docker ps

# Проверить логи
npm run start:order:dev

# Проверить RabbitMQ
docker logs marketplace_rabbitmq
```

## 🔮 Будущие улучшения

### Планируется добавить:

- ⏳ Восстановление stock при отмене заказа
- ⏳ Резервирование товаров в корзине
- ⏳ Автоматическая очистка корзины после заказа
- ⏳ История изменений статуса заказа
- ⏳ Уведомления об изменении статуса
- ⏳ Интеграция с PromoCode Service для применения скидок
- ⏳ Расчет стоимости доставки
- ⏳ Поддержка нескольких адресов доставки
- ⏳ Отслеживание заказа (tracking)
- ⏳ Возвраты и обмены

---

**Дата создания:** 24 октября 2025  
**Статус:** ✅ Готово и протестировано  
**Emoji:** 🛒
