# 🏗️ Архитектура проекта (визуально)

## Общая архитектура

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│                     http://localhost:3000                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      NUXT 3 FRONTEND                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │    Pages     │  │  Components  │  │  Composables │          │
│  │              │  │              │  │              │          │
│  │ - index.vue  │  │ - AppHeader  │  │ - useApi     │          │
│  │ - login.vue  │  │ - AppFooter  │  │ - useAuth    │          │
│  │ - cart.vue   │  │              │  │              │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │    Stores    │  │  Middleware  │  │    Types     │          │
│  │              │  │              │  │              │          │
│  │ - cart.ts    │  │ - auth.ts    │  │ - api.d.ts   │          │
│  │              │  │ - guest.ts   │  │ (generated)  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP + JWT
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY (NestJS)                        │
│                     http://localhost:3001                        │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Swagger UI                             │  │
│  │              http://localhost:3001/api-docs               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  Controllers:                                                     │
│  - AuthController      - ProductController                       │
│  - UserController      - CartController                          │
│  - OrderController     - ReviewController                        │
│  - PromoCodeController - CategoryController                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ RabbitMQ Messages
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         RABBITMQ                                 │
│                   http://localhost:15672                         │
│                                                                   │
│  Queues:                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │product_queue │  │ order_queue  │  │  user_queue  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│  ┌──────────────┐  ┌──────────────┐                             │
│  │promo_queue   │  │ review_queue │                             │
│  └──────────────┘  └──────────────┘                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Message Consumers
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MICROSERVICES                               │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Product    │  │    Order     │  │     User     │          │
│  │   Service    │  │   Service    │  │   Service    │          │
│  │              │  │              │  │              │          │
│  │ - Products   │  │ - Orders     │  │ - Users      │          │
│  │ - Categories │  │ - Cart       │  │ - Auth       │          │
│  │ - Views      │  │              │  │ - Addresses  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐                             │
│  │  PromoCode   │  │    Review    │                             │
│  │   Service    │  │   Service    │                             │
│  │              │  │              │                             │
│  │ - Promo      │  │ - Reviews    │                             │
│  │   Codes      │  │ - Ratings    │                             │
│  └──────────────┘  └──────────────┘                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ TypeORM
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      POSTGRESQL                                  │
│                     localhost:5433                               │
│                                                                   │
│  Tables:                                                          │
│  - users           - products        - orders                    │
│  - addresses       - categories      - order_items               │
│  - cart            - cart_items      - reviews                   │
│  - promo_codes     - product_views   - favorites                │
└─────────────────────────────────────────────────────────────────┘
```

## Frontend архитектура (детально)

```
frontend/
│
├── app/
│   └── app.vue ─────────────────┐
│                                 │
├── pages/                        │  Auto-routing
│   ├── index.vue ────────────────┤  /
│   ├── login.vue ────────────────┤  /login
│   ├── register.vue ─────────────┤  /register
│   └── cart.vue ─────────────────┤  /cart
│                                 │
├── components/                   │
│   ├── AppHeader.vue ────────────┤  Global components
│   └── AppFooter.vue ────────────┤
│                                 │
├── composables/                  │
│   ├── useApi.ts ────────────────┤  API client
│   │   └── apiFetch() ───────────┤  HTTP requests + JWT
│   │                             │
│   └── useAuth.ts ───────────────┤  Authentication
│       ├── login() ──────────────┤
│       ├── register() ────────────┤
│       ├── logout() ──────────────┤
│       └── fetchUser() ───────────┤
│                                 │
├── stores/                       │
│   └── cart.ts ──────────────────┤  Pinia store
│       ├── fetchCart() ──────────┤
│       ├── addItem() ─────────────┤
│       ├── updateQuantity() ──────┤
│       └── removeItem() ──────────┤
│                                 │
├── middleware/                   │
│   ├── auth.ts ──────────────────┤  Route guards
│   └── guest.ts ────────────────┤
│                                 │
└── types/                        │
    └── api.d.ts ────────────────┤  Auto-generated from Swagger
                                 │
                                 ▼
                          Backend API
```

## Backend архитектура (детально)

```
backend/
│
├── apps/
│   │
│   ├── api-gateway/ ────────────────┐
│   │   ├── src/                     │
│   │   │   ├── main.ts ─────────────┤  HTTP Server + Swagger
│   │   │   └── modules/             │
│   │   │       ├── auth/            │  JWT Authentication
│   │   │       ├── user/            │  User endpoints
│   │   │       ├── product/         │  Product endpoints
│   │   │       ├── cart/            │  Cart endpoints
│   │   │       ├── order/           │  Order endpoints
│   │   │       ├── review/          │  Review endpoints
│   │   │       └── promo-code/      │  PromoCode endpoints
│   │   │                             │
│   │   └── Sends messages to ────────┤
│   │                                 │
│   ├── product-service/ ─────────────┤
│   │   ├── src/                     │
│   │   │   ├── main.ts ─────────────┤  RabbitMQ Consumer
│   │   │   ├── product/             │  Product logic
│   │   │   ├── category/            │  Category logic
│   │   │   └── product-view/        │  View tracking
│   │   │                             │
│   ├── order-service/ ───────────────┤
│   │   ├── src/                     │
│   │   │   ├── main.ts ─────────────┤  RabbitMQ Consumer
│   │   │   ├── order/               │  Order logic
│   │   │   └── cart/                │  Cart logic
│   │   │                             │
│   ├── user-service/ ────────────────┤
│   │   ├── src/                     │
│   │   │   ├── main.ts ─────────────┤  RabbitMQ Consumer
│   │   │   ├── user/                │  User logic
│   │   │   ├── auth/                │  Auth logic
│   │   │   └── address/             │  Address logic
│   │   │                             │
│   ├── promo-service/ ───────────────┤
│   │   ├── src/                     │
│   │   │   ├── main.ts ─────────────┤  RabbitMQ Consumer
│   │   │   └── promo-code/          │  PromoCode logic
│   │   │                             │
│   └── review-service/ ──────────────┤
│       ├── src/                     │
│       │   ├── main.ts ─────────────┤  RabbitMQ Consumer
│       │   └── review/              │  Review logic
│       │                             │
│                                     │
└── libs/                             │
    └── shared/ ──────────────────────┤  Shared code
        ├── config/                   │  Configuration
        ├── constants/                │  Constants
        └── types/                    │  TypeScript types
                                     │
                                     ▼
                              PostgreSQL
```

## Поток данных (пример: добавление в корзину)

```
┌─────────────┐
│   Browser   │
│             │
│ Click "Add  │
│  to Cart"   │
└──────┬──────┘
       │
       │ 1. POST /cart/items
       │    { productId: 1, quantity: 1 }
       │    Authorization: Bearer <JWT>
       ▼
┌─────────────────────┐
│   API Gateway       │
│                     │
│ 1. Validate JWT     │
│ 2. Extract userId   │
│ 3. Send to RabbitMQ │
└──────┬──────────────┘
       │
       │ 2. RabbitMQ Message
       │    { pattern: 'cart.add', data: {...} }
       ▼
┌─────────────────────┐
│  Order Service      │
│                     │
│ 1. Receive message  │
│ 2. Validate product │
│ 3. Check stock      │
│ 4. Add to cart      │
│ 5. Save to DB       │
└──────┬──────────────┘
       │
       │ 3. Database Query
       │    INSERT INTO cart_items ...
       ▼
┌─────────────────────┐
│   PostgreSQL        │
│                     │
│ cart_items table    │
└──────┬──────────────┘
       │
       │ 4. Response
       ▼
┌─────────────────────┐
│  Order Service      │
│                     │
│ Return cart data    │
└──────┬──────────────┘
       │
       │ 5. RabbitMQ Response
       ▼
┌─────────────────────┐
│   API Gateway       │
│                     │
│ Format response     │
└──────┬──────────────┘
       │
       │ 6. HTTP Response
       │    { success: true, cart: {...} }
       ▼
┌─────────────┐
│   Browser   │
│             │
│ Update UI   │
│ Show cart   │
│   badge     │
└─────────────┘
```

## Генерация типов из Swagger

```
┌─────────────────────┐
│   API Gateway       │
│                     │
│ @nestjs/swagger     │
│                     │
│ Decorators:         │
│ - @ApiTags()        │
│ - @ApiOperation()   │
│ - @ApiProperty()    │
└──────┬──────────────┘
       │
       │ Generates
       ▼
┌─────────────────────┐
│  Swagger JSON       │
│                     │
│ /api-docs-json      │
│                     │
│ OpenAPI 3.0 spec    │
└──────┬──────────────┘
       │
       │ npm run generate:api
       ▼
┌─────────────────────┐
│ openapi-typescript  │
│                     │
│ Parses OpenAPI      │
│ Generates types     │
└──────┬──────────────┘
       │
       │ Creates
       ▼
┌─────────────────────┐
│  types/api.d.ts     │
│                     │
│ TypeScript types    │
│                     │
│ paths['/products']  │
│   ['get']           │
│   ['responses']     │
│   ['200']           │
│   ['content']       │
│   ['application/    │
│    json']           │
└──────┬──────────────┘
       │
       │ Used in
       ▼
┌─────────────────────┐
│  Frontend Code      │
│                     │
│ import type {       │
│   paths             │
│ } from '~/types/api'│
│                     │
│ type Product =      │
│   paths[...]        │
└─────────────────────┘
```

## Docker архитектура

```
┌─────────────────────────────────────────────────────────────┐
│                      Docker Network                          │
│                      (marketplace)                           │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Frontend    │  │ API Gateway  │  │   Product    │      │
│  │  Container   │  │  Container   │  │   Service    │      │
│  │              │  │              │  │  Container   │      │
│  │ Port: 3000   │  │ Port: 3001   │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Order     │  │     User     │  │  PromoCode   │      │
│  │   Service    │  │   Service    │  │   Service    │      │
│  │  Container   │  │  Container   │  │  Container   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Review    │  │  PostgreSQL  │  │  RabbitMQ    │      │
│  │   Service    │  │  Container   │  │  Container   │      │
│  │  Container   │  │              │  │              │      │
│  │              │  │ Port: 5433   │  │ Port: 5672   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────┐                                            │
│  │   PgAdmin    │                                            │
│  │  Container   │                                            │
│  │              │                                            │
│  │ Port: 5050   │                                            │
│  └──────────────┘                                            │
└─────────────────────────────────────────────────────────────┘
```

## Сравнение: Монолит vs Микросервисы vs Микрофронтенды

### Монолит (не используется)

```
┌─────────────────────────────────────┐
│         Single Application          │
│                                     │
│  ┌─────────────────────────────┐   │
│  │        Frontend             │   │
│  │  (React/Vue/Angular)        │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │        Backend              │   │
│  │  (Node.js/Python/Java)      │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │        Database             │   │
│  │  (PostgreSQL/MySQL)         │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### Микросервисы (используется на бэкенде)

```
┌─────────────────────────────────────┐
│         Frontend (Monolith)         │
│         Nuxt 3 Application          │
└─────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│          API Gateway                │
└─────────────────────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
┌──────────────┐    ┌──────────────┐
│   Product    │    │    Order     │
│   Service    │    │   Service    │
└──────────────┘    └──────────────┘
        │                   │
        └─────────┬─────────┘
                  ▼
        ┌──────────────────┐
        │    Database      │
        └──────────────────┘
```

### Микрофронтенды (НЕ используется)

```
┌─────────────────────────────────────┐
│       Shell Application             │
│       (Container/Host)              │
└─────────────────────────────────────┘
        │         │         │
        ▼         ▼         ▼
┌──────────┐ ┌──────────┐ ┌──────────┐
│ Products │ │   Cart   │ │  Admin   │
│  (React) │ │  (Vue)   │ │ (Angular)│
└──────────┘ └──────────┘ └──────────┘
        │         │         │
        └─────────┴─────────┘
                  │
                  ▼
        ┌──────────────────┐
        │   API Gateway    │
        └──────────────────┘
```

---

## Заключение

**Текущая архитектура:**
- ✅ Frontend: Монолит (Nuxt 3) с модульной структурой
- ✅ Backend: Микросервисы (NestJS) с RabbitMQ
- ✅ Database: Shared PostgreSQL
- ✅ Infrastructure: Docker + Docker Compose

**Почему это оптимально:**
- Простота разработки фронтенда
- Масштабируемость бэкенда
- Изоляция отказов на бэкенде
- Единый UX на фронтенде
- Быстрая разработка
- Легкая отладка

**Когда пересмотреть:**
- Команда выросла до 10+ человек
- Нужны независимые релизы модулей фронтенда
- Разные технологии для разных частей фронтенда
