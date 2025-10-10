# Система авторизации и аутентификации

## Описание
Реализована полноценная система авторизации с использованием JWT токенов.

## Технологии
- **Passport.js** - фреймворк для аутентификации
- **JWT** (JSON Web Tokens) - для генерации токенов
- **bcrypt** - для хеширования паролей
- **Local Strategy** - для логина по email/password
- **JWT Strategy** - для защиты роутов

## API Endpoints

### 1. Регистрация
**POST** `/auth/register`

**Body** (JSON):
```json
{
  "email": "user@example.com",
  "password": "password123",
  "nameFirst": "John",
  "nameLast": "Doe",
  "birthDate": "1990-01-01T00:00:00.000Z",
  "gender": "male"
}
```

**Response** (201 Created):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

### 2. Логин
**POST** `/auth/login`

**Body** (JSON):
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response** (200 OK):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

### 3. Получить профиль (защищенный роут)
**GET** `/auth/profile`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Response** (200 OK):
```json
{
  "id": 1,
  "email": "user@example.com"
}
```

## Использование в Postman

### Шаг 1: Регистрация
1. Выберите запрос "Register" из раздела "Auth"
2. Отправьте запрос
3. Получите `access_token` в ответе

### Шаг 2: Логин
1. Выберите запрос "Login" из раздела "Auth"
2. Отправьте запрос
3. Токен автоматически сохранится в переменную `accessToken` (благодаря скрипту в Tests)

### Шаг 3: Доступ к защищенным роутам
1. Выберите запрос "Get Profile (Protected)"
2. Токен автоматически подставится в заголовок `Authorization`
3. Отправьте запрос

## Защита роутов

Чтобы защитить роут JWT авторизацией, добавьте декоратор `@UseGuards(JwtAuthGuard)`:

```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Get('protected-route')
async protectedRoute(@Request() req) {
  // req.user содержит { id, email }
  return req.user;
}
```

## Получение текущего пользователя

В защищенных роутах доступ к пользователю через `@Request() req`:

```typescript
@UseGuards(JwtAuthGuard)
@Get('my-data')
async getMyData(@Request() req) {
  const userId = req.user.id;
  const userEmail = req.user.email;
  // ...
}
```

## Конфигурация

### Переменные окружения (.env)
```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### Настройки JWT (auth.module.ts)
- **Секрет**: из переменной `JWT_SECRET`
- **Время жизни токена**: 24 часа
- Можно изменить в `auth.module.ts`:
  ```typescript
  JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '24h' }, // <-- здесь
  })
  ```

## Безопасность

1. **Пароли хешируются** с помощью bcrypt (10 rounds)
2. **JWT токены** подписываются секретным ключом
3. **Пароли не возвращаются** в API ответах
4. **Проверка дубликатов** email при регистрации

## Структура файлов

```
src/modules/auth/
├── dto/
│   ├── login.dto.ts           # DTO для логина
│   └── register.dto.ts        # DTO для регистрации
├── guards/
│   ├── jwt-auth.guard.ts      # Guard для JWT
│   └── local-auth.guard.ts    # Guard для Local стратегии
├── strategies/
│   ├── jwt.strategy.ts        # JWT стратегия
│   └── local.strategy.ts      # Local стратегия
├── auth.controller.ts         # Контроллер с endpoints
├── auth.service.ts            # Бизнес-логика авторизации
└── auth.module.ts             # Модуль авторизации
```

## Примечания

- При регистрации автоматически возвращается токен (не нужно логиниться отдельно)
- Токен действителен 24 часа
- После истечения токена нужно логиниться заново
- Для production обязательно смените `JWT_SECRET` на надежный ключ
