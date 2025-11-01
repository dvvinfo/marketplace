# Функционал избранного (Wishlist)

## Описание

Реализован полноценный функционал избранного товаров с интеграцией бэкенда и фронтенда.

## Бэкенд (User Service)

### API Endpoints

#### 1. Добавить товар в избранное
```
POST /favorites
Authorization: Bearer <token>
Body: { "productId": 1 }
```

#### 2. Удалить товар из избранного
```
DELETE /favorites/:productId
Authorization: Bearer <token>
```

#### 3. Получить список избранных товаров
```
GET /favorites
Authorization: Bearer <token>
Response: [1, 2, 3, ...] // массив ID товаров
```

#### 4. Проверить, находится ли товар в избранном
```
GET /favorites/check/:productId
Authorization: Bearer <token>
Response: { "isFavorite": true }
```

#### 5. Получить количество товаров в избранном
```
GET /favorites/count
Authorization: Bearer <token>
Response: { "count": 5 }
```

### Структура базы данных

Таблица `favorites`:
- `id` - первичный ключ
- `user_id` - ID пользователя
- `product_id` - ID товара
- `created_at` - дата добавления
- Уникальный индекс на `(user_id, product_id)`

### Файлы бэкенда

```
backend/apps/user-service/src/favorites/
├── favorite.entity.ts          # Entity для TypeORM
├── favorites.service.ts        # Бизнес-логика
├── favorites.controller.ts     # REST API контроллер
├── favorites.module.ts         # NestJS модуль
└── dto/
    └── add-favorite.dto.ts     # DTO для валидации
```

## Фронтенд

### Composable: useFavorites

Основной composable для работы с избранным:

```typescript
const {
  favorites,          // ref<number[]> - массив ID избранных товаров
  loading,            // ref<boolean> - состояние загрузки
  loadFavorites,      // () => Promise<void> - загрузить избранное
  isFavorite,         // (productId: number) => boolean - проверка
  addToFavorites,     // (productId: number) => Promise<void> - добавить
  removeFromFavorites,// (productId: number) => Promise<void> - удалить
  toggleFavorite,     // (productId: number) => Promise<void> - переключить
  favoritesCount,     // computed<number> - количество товаров
} = useFavorites();
```

### Компоненты

#### 1. FavoriteButton.vue
Кнопка-сердечко для добавления/удаления из избранного:
```vue
<FavoriteButton
  :product-id="product.id"
  :is-favorite="isFavorite(product.id)"
  @toggle="toggleFavorite(product.id)"
/>
```

#### 2. ProductCard.vue
Карточка товара с кнопкой избранного:
```vue
<ProductCard
  :product="product"
  :is-favorite="isFavorite(product.id)"
  @toggle-favorite="toggleFavorite"
  @add-to-cart="addToCart"
/>
```

### Страницы

#### 1. /favorites
Страница со списком избранных товаров:
- Отображение всех избранных товаров
- Кнопка удаления из избранного
- Кнопка добавления в корзину
- Пустое состояние с призывом к действию

#### 2. Интеграция на других страницах

**Главная страница (/):**
- Кнопка-сердечко в правом верхнем углу каждой карточки товара

**Страница товара (/products/[id]):**
- Большая кнопка-сердечко рядом с названием товара

**Каталог (/products):**
- Кнопка-сердечко в правом верхнем углу каждой карточки товара

**Хедер (AppHeader):**
- Иконка сердечка с счетчиком избранных товаров
- Ссылка на страницу избранного

### Файлы фронтенда

```
frontend/app/
├── composables/
│   └── useFavorites.ts         # Composable для работы с избранным
├── components/
│   ├── FavoriteButton.vue      # Кнопка избранного
│   ├── ProductCard.vue         # Карточка товара с избранным
│   └── AppHeader.vue           # Хедер с иконкой избранного
└── pages/
    ├── favorites.vue           # Страница избранного
    ├── index.vue               # Главная (с кнопками избранного)
    ├── products/
    │   ├── index.vue           # Каталог (с кнопками избранного)
    │   └── [id].vue            # Товар (с кнопкой избранного)
```

## Особенности реализации

### 1. Автоматическая загрузка
Избранное автоматически загружается при:
- Монтировании AppHeader (если пользователь авторизован)
- Изменении статуса авторизации
- Переходе на страницы с товарами

### 2. Оптимистичные обновления
При добавлении/удалении товара из избранного:
- UI обновляется мгновенно
- Запрос отправляется на бэкенд
- При ошибке показывается toast-уведомление

### 3. Toast-уведомления
Все действия с избранным сопровождаются уведомлениями:
- ✅ "Добавлено в избранное" (зеленый)
- ℹ️ "Удалено из избранного" (серый)
- ❌ "Ошибка" (красный)

### 4. Счетчик в хедере
В хедере отображается:
- Иконка сердечка
- Розовый бейдж с количеством товаров (если > 0)
- Ссылка на страницу избранного

### 5. Визуальные состояния
Кнопка избранного имеет два состояния:
- **Не в избранном**: контурное сердечко (серое/белое)
- **В избранном**: заполненное сердечко (красное)

## Использование

### Добавление кнопки избранного на новую страницу

1. Импортируйте composable:
```typescript
const { isFavorite, toggleFavorite, loadFavorites } = useFavorites();
```

2. Загрузите избранное при монтировании:
```typescript
onMounted(async () => {
  await loadFavorites();
});
```

3. Добавьте кнопку:
```vue
<UButton
  :icon="isFavorite(productId) ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'"
  :color="isFavorite(productId) ? 'error' : 'neutral'"
  @click="toggleFavorite(productId)"
/>
```

## Тестирование

### Ручное тестирование

1. Авторизуйтесь в системе
2. Перейдите на главную страницу
3. Нажмите на сердечко на любом товаре
4. Проверьте, что счетчик в хедере увеличился
5. Перейдите на страницу избранного
6. Проверьте, что товар отображается
7. Удалите товар из избранного
8. Проверьте, что счетчик уменьшился

### API тестирование

```bash
# Получить токен
TOKEN="your_jwt_token"

# Добавить в избранное
curl -X POST http://localhost:3000/favorites \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId": 1}'

# Получить избранное
curl http://localhost:3000/favorites \
  -H "Authorization: Bearer $TOKEN"

# Удалить из избранного
curl -X DELETE http://localhost:3000/favorites/1 \
  -H "Authorization: Bearer $TOKEN"
```

## Возможные улучшения

1. **Синхронизация между вкладками** - использовать localStorage events
2. **Оффлайн поддержка** - кэшировать избранное в localStorage
3. **Анимации** - добавить плавные анимации при добавлении/удалении
4. **Массовые операции** - добавить возможность удалить все из избранного
5. **Сортировка** - сортировка избранного по дате добавления, цене и т.д.
6. **Поделиться избранным** - генерация ссылки на список избранного
7. **Уведомления о скидках** - уведомлять о скидках на избранные товары

## Статус

✅ Бэкенд API реализован
✅ Фронтенд composable создан
✅ Компоненты созданы
✅ Страница избранного создана
✅ Интеграция на всех страницах
✅ Счетчик в хедере
✅ Toast-уведомления
✅ Документация

**Дата создания:** 2025-11-01
**Версия:** 1.0.0
