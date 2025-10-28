# 📝 Генерация TypeScript типов из Swagger

## Быстрый старт

### 1. Убедитесь что бэкенд запущен

```bash
# Проверьте доступность Swagger
curl http://localhost:3001/api-docs-json

# Или откройте в браузере
# http://localhost:3001/api-docs
```

### 2. Сгенерируйте типы

```bash
npm run generate:api
```

Это создаст файл `types/api.d.ts` с TypeScript типами.

## Как использовать типы

### Базовое использование

```typescript
import type { paths } from '~/types/api'

// Тип ответа GET /products
type ProductsResponse = paths['/products']['get']['responses']['200']['content']['application/json']

// Тип одного продукта
type Product = ProductsResponse[0]

// Тип тела запроса POST /auth/login
type LoginRequest = paths['/auth/login']['post']['requestBody']['content']['application/json']
```

### С composables

```typescript
// composables/useProducts.ts
import type { paths } from '~/types/api'

type Product = paths['/products']['get']['responses']['200']['content']['application/json'][0]

export const useProducts = () => {
  const { apiFetch } = useApi()

  const fetchProducts = async (): Promise<Product[]> => {
    return await apiFetch<Product[]>('/products')
  }

  return {
    fetchProducts
  }
}
```

### С Pinia stores

```typescript
// stores/products.ts
import { defineStore } from 'pinia'
import type { paths } from '~/types/api'

type Product = paths['/products']['get']['responses']['200']['content']['application/json'][0]

export const useProductsStore = defineStore('products', {
  state: () => ({
    items: [] as Product[],
    loading: false,
  }),

  actions: {
    async fetchProducts() {
      const { apiFetch } = useApi()
      this.loading = true

      try {
        this.items = await apiFetch<Product[]>('/products')
      } finally {
        this.loading = false
      }
    },
  },
})
```

## Структура типов

### Paths (Эндпоинты)

```typescript
paths['/products']['get']              // GET /products
paths['/products']['post']             // POST /products
paths['/products/{id}']['get']         // GET /products/:id
paths['/products/{id}']['patch']       // PATCH /products/:id
paths['/products/{id}']['delete']      // DELETE /products/:id
```

### Responses (Ответы)

```typescript
// Успешный ответ
paths['/products']['get']['responses']['200']['content']['application/json']

// Ошибка
paths['/products']['get']['responses']['404']['content']['application/json']
```

### Request Body (Тело запроса)

```typescript
paths['/products']['post']['requestBody']['content']['application/json']
```

### Parameters (Параметры)

```typescript
// Path параметры
paths['/products/{id}']['get']['parameters']['path']

// Query параметры
paths['/products']['get']['parameters']['query']
```

## Примеры для вашего API

### Auth

```typescript
import type { paths } from '~/types/api'

// Login
type LoginRequest = paths['/auth/login']['post']['requestBody']['content']['application/json']
type LoginResponse = paths['/auth/login']['post']['responses']['200']['content']['application/json']

// Register
type RegisterRequest = paths['/auth/register']['post']['requestBody']['content']['application/json']
type RegisterResponse = paths['/auth/register']['post']['responses']['201']['content']['application/json']
```

### Products

```typescript
// Список продуктов
type ProductsResponse = paths['/products']['get']['responses']['200']['content']['application/json']
type Product = ProductsResponse[0]

// Создание продукта
type CreateProductRequest = paths['/products']['post']['requestBody']['content']['application/json']

// Обновление продукта
type UpdateProductRequest = paths['/products/{id}']['patch']['requestBody']['content']['application/json']
```

### Cart

```typescript
// Корзина
type CartResponse = paths['/cart']['get']['responses']['200']['content']['application/json']

// Добавить в корзину
type AddToCartRequest = paths['/cart/items']['post']['requestBody']['content']['application/json']

// Обновить количество
type UpdateCartItemRequest = paths['/cart/items/{id}']['patch']['requestBody']['content']['application/json']
```

### Orders

```typescript
// Список заказов
type OrdersResponse = paths['/orders']['get']['responses']['200']['content']['application/json']
type Order = OrdersResponse[0]

// Создать заказ
type CreateOrderRequest = paths['/orders']['post']['requestBody']['content']['application/json']
```

## Когда регенерировать типы

Запускайте `npm run generate:api` после:

- ✅ Добавления новых эндпоинтов в бэкенде
- ✅ Изменения структуры данных (DTO)
- ✅ Изменения параметров запросов
- ✅ Обновления Swagger документации

## Автоматизация

### Git hook (pre-commit)

Создайте `.husky/pre-commit`:

```bash
#!/bin/sh
cd frontend && npm run generate:api
git add types/api.d.ts
```

### CI/CD

В вашем CI pipeline:

```yaml
- name: Generate API types
  run: |
    cd frontend
    npm run generate:api
```

## Troubleshooting

### Ошибка: Cannot connect to API

```
Error: connect ECONNREFUSED 127.0.0.1:3001
```

**Решение:** Запустите бэкенд:

```bash
cd backend
npm run start:dev
```

### Ошибка: Invalid OpenAPI schema

**Решение:** Проверьте что Swagger корректно настроен в бэкенде:

```bash
# Откройте в браузере
http://localhost:3001/api-docs

# Проверьте JSON
curl http://localhost:3001/api-docs-json
```

### Типы не обновляются

**Решение:** 

1. Удалите старый файл:
```bash
rm types/api.d.ts
```

2. Регенерируйте:
```bash
npm run generate:api
```

3. Перезапустите TypeScript сервер в IDE

## Альтернативы

### swagger-typescript-api

Генерирует готовые API клиенты:

```bash
npm install -D swagger-typescript-api

# Генерация
npx swagger-typescript-api -p http://localhost:3001/api-docs-json -o ./api -n api.ts
```

Использование:

```typescript
import { Api } from '~/api/api'

const api = new Api({
  baseURL: 'http://localhost:3001'
})

const products = await api.products.productsList()
```

### Ручная типизация

Если автогенерация не подходит, создайте типы вручную:

```typescript
// types/models.ts
export interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  imageUrl?: string
  categoryId: number
  createdAt: string
  updatedAt: string
}

export interface CartItem {
  id: number
  productId: number
  quantity: number
  product: Product
}

export interface Cart {
  id: number
  userId: number
  items: CartItem[]
}
```

## Полезные ссылки

- [openapi-typescript](https://github.com/drwpow/openapi-typescript)
- [swagger-typescript-api](https://github.com/acacode/swagger-typescript-api)
- [OpenAPI Specification](https://swagger.io/specification/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

---

**Совет:** Добавьте `types/api.d.ts` в `.gitignore` если хотите генерировать типы локально, или коммитьте если хотите версионировать.
