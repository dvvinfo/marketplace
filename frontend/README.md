# 🛍️ Marketplace Frontend

Nuxt 3 приложение для e-commerce marketplace с автогенерацией типов из Swagger.

## 🚀 Быстрый старт

### 1. Установка зависимостей

```bash
npm install
```

### 2. Настройка окружения

Скопируйте `.env.example` в `.env`:

```bash
cp .env.example .env
```

### 3. Генерация типов из Swagger

**Важно:** Сначала запустите бэкенд API Gateway на порту 3001!

```bash
# Убедитесь что бэкенд запущен на http://localhost:3001
npm run generate:api
```

Это создаст файл `types/api.d.ts` с TypeScript типами из вашего Swagger.

### 4. Запуск dev сервера

```bash
npm run dev
```

Приложение будет доступно на http://localhost:3000

## 📁 Структура проекта

```
frontend/
├── app/
│   └── app.vue              # Главный компонент приложения
├── components/
│   ├── AppHeader.vue        # Шапка сайта
│   └── AppFooter.vue        # Подвал сайта
├── composables/
│   ├── useApi.ts            # API клиент с авторизацией
│   └── useAuth.ts           # Авторизация и аутентификация
├── middleware/
│   ├── auth.ts              # Защита приватных страниц
│   └── guest.ts             # Редирект авторизованных пользователей
├── pages/
│   ├── index.vue            # Главная страница (список продуктов)
│   ├── login.vue            # Страница входа
│   ├── register.vue         # Страница регистрации
│   └── cart.vue             # Корзина
├── stores/
│   └── cart.ts              # Pinia store для корзины
├── types/
│   └── api.d.ts             # Автогенерированные типы из Swagger
└── nuxt.config.ts           # Конфигурация Nuxt
```

## 🔧 Основные возможности

### API клиент (`useApi`)

```typescript
const { apiFetch } = useApi()

// GET запрос
const products = await apiFetch('/products')

// POST запрос
await apiFetch('/cart/items', {
  method: 'POST',
  body: { productId: 1, quantity: 2 }
})
```

### Авторизация (`useAuth`)

```typescript
const { login, register, logout, isAuthenticated, user } = useAuth()

// Вход
await login('email@example.com', 'password')

// Регистрация
await register({
  email: 'email@example.com',
  password: 'password',
  firstName: 'John',
  lastName: 'Doe'
})

// Выход
logout()
```

### Корзина (`useCartStore`)

```typescript
const cartStore = useCartStore()

// Добавить товар
await cartStore.addItem(productId, quantity)

// Обновить количество
await cartStore.updateQuantity(itemId, newQuantity)

// Удалить товар
await cartStore.removeItem(itemId)

// Очистить корзину
await cartStore.clearCart()
```

## 🔐 Middleware

### `auth` - Защита приватных страниц

```vue
<script setup>
definePageMeta({
  middleware: 'auth'
})
</script>
```

### `guest` - Только для неавторизованных

```vue
<script setup>
definePageMeta({
  middleware: 'guest'
})
</script>
```

## 🎨 UI компоненты

Проект использует [@nuxt/ui](https://ui.nuxt.com/) - библиотеку компонентов на базе Tailwind CSS.

Доступные компоненты:
- `UButton` - Кнопки
- `UCard` - Карточки
- `UInput` - Поля ввода
- `UForm` - Формы
- `UDropdown` - Выпадающие меню
- И многое другое...

## 📝 Переменные окружения

```env
# API Configuration
NUXT_PUBLIC_API_BASE_URL=http://localhost:3001

# App Configuration
NUXT_PUBLIC_APP_NAME=Marketplace
NUXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🔄 Автогенерация типов

### Как это работает

1. Бэкенд предоставляет Swagger документацию на `/api-docs-json`
2. Запускаем `npm run generate:api`
3. `openapi-typescript` генерирует TypeScript типы в `types/api.d.ts`
4. Используем типы в коде:

```typescript
import type { paths } from '~/types/api'

type Product = paths['/products']['get']['responses']['200']['content']['application/json'][0]
```

### Когда регенерировать типы

- После изменения API на бэкенде
- После добавления новых эндпоинтов
- После изменения структуры данных

## 🐳 Docker

### Development

```bash
docker-compose -f docker-compose.dev.yml up marketplace_frontend
```

### Production

```bash
docker-compose up marketplace_frontend
```

## 📦 Сборка для продакшена

```bash
npm run build
```

Предпросмотр продакшен сборки:

```bash
npm run preview
```

## 🎯 Следующие шаги

### Добавить страницы:
- [ ] `/products` - Каталог с фильтрами
- [ ] `/products/[id]` - Страница товара
- [ ] `/checkout` - Оформление заказа
- [ ] `/orders` - История заказов
- [ ] `/profile` - Профиль пользователя
- [ ] `/admin` - Админ панель

### Добавить функционал:
- [ ] Поиск товаров
- [ ] Фильтры и сортировка
- [ ] Избранное
- [ ] Отзывы
- [ ] Промокоды
- [ ] Адреса доставки

## 🤔 Микрофронтенды?

**Не рекомендуется** для этого проекта, потому что:
- Модульная структура Nuxt уже обеспечивает хорошую организацию кода
- Микрофронтенды добавляют сложность без явных преимуществ
- Единое приложение проще разрабатывать и поддерживать
- Бэкенд уже использует микросервисную архитектуру

**Когда стоит использовать микрофронтенды:**
- Большая команда (10+ разработчиков)
- Разные команды работают над разными модулями
- Нужны независимые релизы модулей
- Разные части используют разные фреймворки

## 📚 Полезные ссылки

- [Nuxt 3 Documentation](https://nuxt.com/docs)
- [Nuxt UI](https://ui.nuxt.com/)
- [Pinia](https://pinia.vuejs.org/)
- [VueUse](https://vueuse.org/)
- [Tailwind CSS](https://tailwindcss.com/)

---

Built with ❤️ using [Nuxt 3](https://nuxt.com/)
