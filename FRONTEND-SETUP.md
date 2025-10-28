# 🎨 Frontend Setup Guide

Пошаговая инструкция по настройке и запуску фронтенда.

## 📋 Предварительные требования

- Node.js 18+ 
- npm или yarn
- Запущенный бэкенд на порту 3001

## 🚀 Установка

### 1. Перейдите в директорию фронтенда

```bash
cd frontend
```

### 2. Установите зависимости

```bash
npm install
```

### 3. Настройте переменные окружения

```bash
# Скопируйте пример
cp .env.example .env

# Отредактируйте .env если нужно
# По умолчанию API на http://localhost:3001
```

### 4. Запустите бэкенд (если еще не запущен)

**Из корневой директории проекта:**

```bash
# Windows
START-ALL.bat

# Linux/Mac
./START-ALL.sh
```

Или через Docker:

```bash
docker-compose up -d
```

### 5. Сгенерируйте типы из Swagger

**Важно:** Бэкенд должен быть запущен!

```bash
npm run generate:api
```

Это создаст файл `types/api.d.ts` с TypeScript типами.

### 6. Запустите dev сервер

```bash
npm run dev
```

Фронтенд будет доступен на: **http://localhost:3000**

## 🔍 Проверка работы

1. Откройте http://localhost:3000
2. Вы должны увидеть главную страницу с продуктами
3. Попробуйте зарегистрироваться: http://localhost:3000/register
4. Войдите в систему: http://localhost:3000/login
5. Добавьте товары в корзину: http://localhost:3000/cart

## 📁 Структура проекта

```
frontend/
├── app/
│   └── app.vue              # Главный компонент
├── components/
│   ├── AppHeader.vue        # Шапка
│   └── AppFooter.vue        # Подвал
├── composables/
│   ├── useApi.ts            # API клиент
│   └── useAuth.ts           # Авторизация
├── middleware/
│   ├── auth.ts              # Защита страниц
│   └── guest.ts             # Только для гостей
├── pages/
│   ├── index.vue            # Главная
│   ├── login.vue            # Вход
│   ├── register.vue         # Регистрация
│   └── cart.vue             # Корзина
├── stores/
│   └── cart.ts              # Store корзины
└── types/
    └── api.d.ts             # Типы из Swagger (генерируется)
```

## 🔧 Основные команды

```bash
# Разработка
npm run dev

# Сборка для продакшена
npm run build

# Предпросмотр продакшен сборки
npm run preview

# Генерация типов из Swagger
npm run generate:api

# Генерация статического сайта
npm run generate
```

## 🐛 Решение проблем

### Ошибка при генерации типов

```
Error: connect ECONNREFUSED 127.0.0.1:3001
```

**Решение:** Убедитесь что бэкенд запущен на порту 3001

```bash
# Проверьте доступность Swagger
curl http://localhost:3001/api-docs-json
```

### Ошибки авторизации

```
401 Unauthorized
```

**Решение:** 
1. Проверьте что токен сохраняется в cookies
2. Проверьте что бэкенд принимает JWT токены
3. Попробуйте выйти и войти заново

### Порт 3000 занят

```bash
# Используйте другой порт
PORT=3001 npm run dev
```

Или измените в `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  devServer: {
    port: 3002
  }
})
```

## 🎯 Что дальше?

### Добавить страницы:

1. **Каталог товаров** (`/products`)
   - Фильтры по категориям
   - Поиск
   - Сортировка

2. **Страница товара** (`/products/[id]`)
   - Детальная информация
   - Отзывы
   - Похожие товары

3. **Оформление заказа** (`/checkout`)
   - Выбор адреса доставки
   - Применение промокода
   - Оплата

4. **История заказов** (`/orders`)
   - Список заказов
   - Статусы
   - Детали заказа

5. **Профиль** (`/profile`)
   - Редактирование данных
   - Адреса доставки
   - Избранное

6. **Админ панель** (`/admin`)
   - Управление товарами
   - Управление заказами
   - Аналитика

### Добавить функционал:

- [ ] Поиск товаров
- [ ] Фильтры и сортировка
- [ ] Избранное (wishlist)
- [ ] Отзывы и рейтинги
- [ ] Промокоды
- [ ] Адреса доставки
- [ ] История просмотров
- [ ] Уведомления
- [ ] Темная тема
- [ ] Мультиязычность (i18n)

## 🐳 Docker

### Development режим

```bash
# Из корневой директории
docker-compose -f docker-compose.dev.yml up marketplace_frontend
```

### Production режим

```bash
docker-compose up marketplace_frontend
```

## 📚 Технологии

- **Nuxt 3** - Vue.js фреймворк
- **TypeScript** - Типизация
- **Pinia** - State management
- **Nuxt UI** - UI компоненты
- **Tailwind CSS** - Стили
- **VueUse** - Композаблы
- **openapi-typescript** - Генерация типов

## 📖 Полезные ссылки

- [Nuxt 3 Docs](https://nuxt.com/docs)
- [Nuxt UI](https://ui.nuxt.com/)
- [Pinia](https://pinia.vuejs.org/)
- [VueUse](https://vueuse.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Backend Swagger](http://localhost:3001/api-docs)

---

Если возникли вопросы - проверьте [Backend README](./backend/README.md)
