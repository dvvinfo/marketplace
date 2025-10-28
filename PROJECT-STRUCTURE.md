# 📁 Структура проекта

## Корневая директория

```
marketplace/
│
├── 📁 backend/                    # Backend (NestJS микросервисы)
│   ├── apps/                      # Микросервисы
│   │   ├── api-gateway/          # HTTP REST API + Swagger
│   │   ├── product-service/      # Продукты и категории
│   │   ├── order-service/        # Заказы и корзина
│   │   ├── user-service/         # Пользователи и авторизация
│   │   ├── promo-service/        # Промокоды
│   │   └── review-service/       # Отзывы и рейтинги
│   ├── libs/shared/              # Общие библиотеки
│   ├── package.json
│   └── README.md
│
├── 📁 frontend/                   # Frontend (Nuxt 3)
│   ├── app/                      # Главный компонент
│   │   └── app.vue
│   ├── components/               # UI компоненты
│   │   ├── AppHeader.vue
│   │   └── AppFooter.vue
│   ├── composables/              # Переиспользуемая логика
│   │   ├── useApi.ts
│   │   └── useAuth.ts
│   ├── middleware/               # Route guards
│   │   ├── auth.ts
│   │   └── guest.ts
│   ├── pages/                    # Страницы (auto-routing)
│   │   ├── index.vue            # /
│   │   ├── login.vue            # /login
│   │   ├── register.vue         # /register
│   │   └── cart.vue             # /cart
│   ├── stores/                   # Pinia stores
│   │   └── cart.ts
│   ├── types/                    # TypeScript типы
│   │   └── api.d.ts             # Генерируется из Swagger
│   ├── package.json
│   ├── nuxt.config.ts
│   ├── README.md
│   └── SWAGGER-TYPES.md
│
├── 📄 Документация (на русском)
│   ├── КРАТКОЕ-РЕЗЮМЕ.md         # Краткое резюме
│   └── ОТВЕТЫ-НА-ВОПРОСЫ.md      # Подробные ответы
│
├── 📄 Документация (главная)
│   ├── README.md                 # Главная документация
│   ├── GETTING-STARTED.md        # Полное руководство
│   ├── QUICK-CHECKLIST.md        # Быстрый старт (5 минут)
│   ├── WHAT-WAS-DONE.md          # Полное резюме
│   └── COMMANDS.md               # Шпаргалка команд
│
├── 📄 Документация (frontend)
│   ├── FRONTEND-SETUP.md         # Настройка фронтенда
│   └── FRONTEND-SUMMARY.md       # Резюме фронтенда
│
├── 📄 Документация (архитектура)
│   ├── ARCHITECTURE-VISUAL.md    # Визуальная архитектура
│   ├── MICROFRONTENDS-FAQ.md     # О микрофронтендах
│   ├── MODES.md                  # Режимы разработки
│   └── DOCKER.md                 # Docker инструкции
│
├── 🐳 Docker
│   ├── docker-compose.yml        # Production
│   └── docker-compose.dev.yml    # Development
│
└── 🚀 Скрипты запуска
    ├── START-ALL.bat/sh          # Запуск всего (production)
    ├── START-DEV.bat/sh          # Запуск всего (development)
    ├── START-FRONTEND.bat/sh     # Запуск фронтенда
    ├── START-INFRA.bat/sh        # Запуск инфраструктуры
    ├── STOP-ALL.bat/sh           # Остановка всего
    └── STOP-DEV.bat/sh           # Остановка dev режима
```

## Backend структура (детально)

```
backend/
│
├── apps/
│   │
│   ├── api-gateway/              # HTTP REST API
│   │   ├── src/
│   │   │   ├── main.ts          # Swagger + HTTP Server
│   │   │   ├── app.module.ts
│   │   │   └── modules/
│   │   │       ├── auth/        # JWT авторизация
│   │   │       ├── user/        # Пользователи
│   │   │       ├── product/     # Продукты
│   │   │       ├── cart/        # Корзина
│   │   │       ├── order/       # Заказы
│   │   │       ├── review/      # Отзывы
│   │   │       ├── promo-code/  # Промокоды
│   │   │       ├── category/    # Категории
│   │   │       ├── favorite/    # Избранное
│   │   │       └── analytics/   # Аналитика
│   │   └── test/
│   │
│   ├── product-service/          # Микросервис продуктов
│   │   ├── src/
│   │   │   ├── main.ts          # RabbitMQ Consumer
│   │   │   ├── product/         # Логика продуктов
│   │   │   ├── category/        # Логика категорий
│   │   │   └── product-view/    # Отслеживание просмотров
│   │   └── test/
│   │
│   ├── order-service/            # Микросервис заказов
│   │   ├── src/
│   │   │   ├── main.ts          # RabbitMQ Consumer
│   │   │   ├── order/           # Логика заказов
│   │   │   └── cart/            # Логика корзины
│   │   └── test/
│   │
│   ├── user-service/             # Микросервис пользователей
│   │   ├── src/
│   │   │   ├── main.ts          # RabbitMQ Consumer
│   │   │   ├── user/            # Логика пользователей
│   │   │   ├── auth/            # Логика авторизации
│   │   │   └── address/         # Логика адресов
│   │   └── test/
│   │
│   ├── promo-service/            # Микросервис промокодов
│   │   ├── src/
│   │   │   ├── main.ts          # RabbitMQ Consumer
│   │   │   └── promo-code/      # Логика промокодов
│   │   └── test/
│   │
│   └── review-service/           # Микросервис отзывов
│       ├── src/
│       │   ├── main.ts          # RabbitMQ Consumer
│       │   └── review/          # Логика отзывов
│       └── test/
│
├── libs/
│   └── shared/                   # Общие библиотеки
│       ├── config/              # Конфигурация
│       ├── constants/           # Константы
│       └── types/               # TypeScript типы
│
├── package.json
├── nest-cli.json
├── tsconfig.json
└── README.md
```

## Frontend структура (детально)

```
frontend/
│
├── app/
│   └── app.vue                   # Главный компонент приложения
│
├── components/                   # UI компоненты
│   ├── AppHeader.vue            # Шапка сайта
│   │   ├── Навигация
│   │   ├── Корзина (badge)
│   │   └── Меню пользователя
│   └── AppFooter.vue            # Подвал сайта
│
├── composables/                  # Переиспользуемая логика
│   ├── useApi.ts                # API клиент
│   │   ├── apiFetch()          # HTTP запросы
│   │   ├── JWT авторизация
│   │   └── Error handling
│   └── useAuth.ts               # Авторизация
│       ├── login()             # Вход
│       ├── register()          # Регистрация
│       ├── logout()            # Выход
│       ├── fetchUser()         # Получение пользователя
│       └── isAuthenticated     # Проверка авторизации
│
├── middleware/                   # Route guards
│   ├── auth.ts                  # Защита приватных страниц
│   └── guest.ts                 # Только для неавторизованных
│
├── pages/                        # Страницы (auto-routing)
│   ├── index.vue                # / - Главная (список продуктов)
│   ├── login.vue                # /login - Вход
│   ├── register.vue             # /register - Регистрация
│   └── cart.vue                 # /cart - Корзина
│
├── stores/                       # Pinia stores
│   └── cart.ts                  # Store корзины
│       ├── State: items, loading
│       ├── Getters: totalItems, totalPrice
│       └── Actions: fetchCart, addItem, updateQuantity, removeItem
│
├── types/                        # TypeScript типы
│   └── api.d.ts                 # Автогенерируется из Swagger
│
├── public/                       # Статические файлы
│   ├── favicon.ico
│   └── robots.txt
│
├── .env                          # Переменные окружения
├── .env.example                  # Пример переменных
├── .gitignore
├── package.json
├── nuxt.config.ts               # Конфигурация Nuxt
├── tsconfig.json                # Конфигурация TypeScript
├── README.md                     # Документация фронтенда
└── SWAGGER-TYPES.md             # Работа с типами
```

## Документация

### 🇷🇺 На русском языке

```
📄 КРАТКОЕ-РЕЗЮМЕ.md              # Краткое резюме
   ├── Что было сделано
   ├── Ответы на вопросы
   ├── Как запустить
   └── Что дальше

📄 ОТВЕТЫ-НА-ВОПРОСЫ.md           # Подробные ответы
   ├── Swagger и типы
   ├── Что такое микрофронтенды
   ├── Можем ли реализовать
   ├── Стоит ли это делать
   └── Рекомендации
```

### 📖 Главная документация

```
📄 README.md                      # Главная документация
   ├── Quick Start
   ├── Available Services
   ├── Documentation links
   └── Project Structure

📄 GETTING-STARTED.md             # Полное руководство
   ├── Prerequisites
   ├── Installation
   ├── Configuration
   └── Running

📄 QUICK-CHECKLIST.md             # Быстрый старт (5 минут)
   ├── Первый запуск
   ├── Development режим
   ├── Ежедневная разработка
   └── Troubleshooting

📄 WHAT-WAS-DONE.md               # Полное резюме
   ├── Frontend разработка
   ├── Документация
   ├── Ответы на вопросы
   └── Статистика

📄 COMMANDS.md                    # Шпаргалка команд
   ├── Быстрый старт
   ├── Backend команды
   ├── Frontend команды
   ├── Docker команды
   └── Troubleshooting
```

### 🎨 Frontend документация

```
📄 FRONTEND-SETUP.md              # Настройка фронтенда
   ├── Установка
   ├── Генерация типов
   ├── Структура проекта
   ├── Основные команды
   └── Troubleshooting

📄 FRONTEND-SUMMARY.md            # Резюме фронтенда
   ├── Что было сделано
   ├── Как запустить
   ├── Что дальше
   └── Технологии

📄 frontend/README.md             # Детальная документация
   ├── Setup
   ├── Development Server
   ├── Production
   └── Features

📄 frontend/SWAGGER-TYPES.md      # Работа с типами
   ├── Быстрый старт
   ├── Как использовать типы
   ├── Примеры
   └── Troubleshooting
```

### 🏗️ Архитектура

```
📄 ARCHITECTURE-VISUAL.md         # Визуальная архитектура
   ├── Общая архитектура
   ├── Frontend архитектура
   ├── Backend архитектура
   ├── Поток данных
   ├── Генерация типов
   └── Docker архитектура

📄 MICROFRONTENDS-FAQ.md          # О микрофронтендах
   ├── Что это такое
   ├── Популярные подходы
   ├── Нужны ли вам
   ├── Что использовать вместо
   └── Примеры реализации

📄 MODES.md                       # Режимы разработки
   ├── Development
   ├── Production
   └── Hybrid

📄 DOCKER.md                      # Docker инструкции
   ├── Setup
   ├── Commands
   └── Troubleshooting
```

## Скрипты

### Windows (.bat)

```
START-ALL.bat                     # Запуск всего (production)
START-DEV.bat                     # Запуск всего (development)
START-FRONTEND.bat                # Запуск фронтенда
START-INFRA.bat                   # Запуск инфраструктуры
STOP-ALL.bat                      # Остановка всего
STOP-DEV.bat                      # Остановка dev режима
```

### Linux/Mac (.sh)

```
START-ALL.sh                      # Запуск всего (production)
START-DEV.sh                      # Запуск всего (development)
START-FRONTEND.sh                 # Запуск фронтенда
START-INFRA.sh                    # Запуск инфраструктуры
STOP-ALL.sh                       # Остановка всего
STOP-DEV.sh                       # Остановка dev режима
```

## Docker

```
docker-compose.yml                # Production конфигурация
   ├── marketplace_postgres
   ├── marketplace_pgadmin
   ├── marketplace_rabbitmq
   ├── marketplace_api_gateway
   ├── marketplace_product_service
   ├── marketplace_order_service
   ├── marketplace_user_service
   ├── marketplace_promo_service
   ├── marketplace_review_service
   └── marketplace_frontend

docker-compose.dev.yml            # Development конфигурация
   ├── Hot-reload для всех сервисов
   ├── Volume mapping для кода
   └── Development окружение
```

## Порты

```
3000  - Frontend (Nuxt)
3001  - API Gateway (NestJS + Swagger)
5433  - PostgreSQL
5050  - PgAdmin
5672  - RabbitMQ (AMQP)
15672 - RabbitMQ Management UI
```

## Технологии

### Backend
- NestJS - Framework
- TypeScript - Language
- RabbitMQ - Message Broker
- PostgreSQL - Database
- TypeORM - ORM
- Swagger - API Documentation
- JWT - Authentication

### Frontend
- Nuxt 3 - Framework
- Vue 3 - UI Library
- TypeScript - Language
- Pinia - State Management
- Nuxt UI - UI Components
- Tailwind CSS - Styling
- VueUse - Composables
- openapi-typescript - Type Generation

### DevOps
- Docker - Containerization
- Docker Compose - Orchestration
- Git - Version Control

## Навигация по документации

**Начните здесь:**
1. 🇷🇺 [КРАТКОЕ-РЕЗЮМЕ.md](./КРАТКОЕ-РЕЗЮМЕ.md) - Краткое резюме
2. ⚡ [QUICK-CHECKLIST.md](./QUICK-CHECKLIST.md) - Быстрый старт

**Для понимания:**
3. 🏗️ [ARCHITECTURE-VISUAL.md](./ARCHITECTURE-VISUAL.md) - Архитектура
4. 🤔 [MICROFRONTENDS-FAQ.md](./MICROFRONTENDS-FAQ.md) - О микрофронтендах

**Для разработки:**
5. 📝 [COMMANDS.md](./COMMANDS.md) - Шпаргалка команд
6. 🎨 [FRONTEND-SETUP.md](./FRONTEND-SETUP.md) - Настройка фронтенда
7. 📚 [frontend/SWAGGER-TYPES.md](./frontend/SWAGGER-TYPES.md) - Работа с типами

**Полная информация:**
8. 📋 [WHAT-WAS-DONE.md](./WHAT-WAS-DONE.md) - Полное резюме
9. 🇷🇺 [ОТВЕТЫ-НА-ВОПРОСЫ.md](./ОТВЕТЫ-НА-ВОПРОСЫ.md) - Подробные ответы

---

**Готово к разработке!** 🚀
