# 👤 User Service Documentation

## Содержание
- [Обзор](#обзор)
- [Архитектура](#архитектура)
- [Установка](#установка)
- [Конфигурация](#конфигурация)
- [API Reference](#api-reference)
- [Примеры использования](#примеры-использования)
- [Безопасность](#безопасность)
- [Тестирование](#тестирование)

## Обзор

User Service - это микросервис для управления пользователями, аутентификацией и адресами доставки в системе Marketplace. Сервис работает через RabbitMQ и предоставляет функциональность для регистрации, входа, управления профилями пользователей и их адресами.

### Основные возможности

- 🔐 Регистрация и аутентификация пользователей
- 🔑 JWT токены для авторизации
- 👥 CRUD операции с пользователями
- 📍 Управление адресами доставки
- 🔒 Безопасное хранение паролей (bcrypt)
- ✅ Валидация данных
- 📨 Асинхронная коммуникация через RabbitMQ

## Архитектура

### Технологический стек

- **Framework:** NestJS 10.x
- **Language:** TypeScript 5.x
- **Database:** PostgreSQL 15.x
- **ORM:** TypeORM 0.3.x
- **Message Broker:** RabbitMQ 3.x
- **Authentication:** JWT + bcrypt
- **Validation:** class-validator

### Структура модулей

```
User Service
├── User Module
│   ├── User Controller (RabbitMQ)
│   ├── User Service
│   └── User Entity
├── Auth Module
│   ├── Auth Controller (RabbitMQ)
│   ├── Auth Service
│   └── JWT Strategy
└── Address Module
    ├── Address Controller (RabbitMQ)
    ├── Address Service
    └── Address Entity
```

## Установка

### Предварительные требования

- Node.js >= 18.x
- PostgreSQL >= 15.x
- RabbitMQ >= 3.x
- npm или yarn

### Шаги установки

1. Установите зависимости:
```bash
cd backend
npm install
```

2. Настройте переменные окружения (см. [Конфигурация](#конфигурация))

3. Соберите сервис:
```bash
npm run build:user
```

4. Запустите сервис:
```bash
# Разработка
npm run start:user:dev

# Продакшн
npm run start:user:prod
```

## Конфигурация

### Переменные окружения

Создайте файл `.env` в корне проекта:

```env
# Database
POSTGRES_HOST=localhost
POSTGRES_PORT=5433
POSTGRES_USERNAME=marketplace
POSTGRES_PASSWORD=marketplace
POSTGRES_DATABASE=marketplace

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# RabbitMQ
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_USERNAME=marketplace
RABBITMQ_PASSWORD=marketplace
```

### Конфигурация TypeORM

```typescript
TypeOrmModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get<string>('POSTGRES_HOST'),
    port: configService.get<number>('POSTGRES_PORT'),
    username: configService.get<string>('POSTGRES_USERNAME'),
    password: configService.get<string>('POSTGRES_PASSWORD'),
    database: configService.get<string>('POSTGRES_DATABASE'),
    entities: [User, Address],
    synchronize: true, // false в продакшн!
  }),
})
```

## API Reference

### Authentication

#### Register User
Регистрация нового пользователя

**Pattern:** `auth_register`

**Request:**
```typescript
{
  email: string;        // Уникальный email
  password: string;     // Минимум 6 символов
  nameFirst: string;    // Имя
  nameLast: string;     // Фамилия
}
```

**Response:**
```typescript
{
  success: boolean;
  data: {
    user: {
      id: number;
      email: string;
      nameFirst: string;
      nameLast: string;
      role: string;
    };
    accessToken: string;
  }
}
```

**Errors:**
- `ConflictException` - Email уже используется
- `ValidationException` - Невалидные данные

#### Login User
Вход пользователя

**Pattern:** `auth_login`

**Request:**
```typescript
{
  email: string;
  password: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  data: {
    user: {
      id: number;
      email: string;
      nameFirst: string;
      nameLast: string;
    };
    accessToken: string;
  }
}
```

**Errors:**
- `UnauthorizedException` - Неверные учетные данные

#### Validate Token
Валидация JWT токена

**Pattern:** `auth_validate_token`

**Request:**
```typescript
string // JWT token
```

**Response:**
```typescript
{
  success: boolean;
  data: {
    id: number;
    email: string;
    nameFirst: string;
    nameLast: string;
    role: string;
  }
}
```

### Users

#### Get All Users
Получить всех пользователей

**Pattern:** `get_all_users`

**Request:** `{}`

**Response:**
```typescript
{
  success: boolean;
  data: User[]
}
```

#### Get User by ID
Получить пользователя по ID

**Pattern:** `get_user`

**Request:** `number` (userId)

**Response:**
```typescript
{
  success: boolean;
  data: {
    id: number;
    email: string;
    nameFirst: string;
    nameLast: string;
    birthDate: Date | null;
    gender: string | null;
    role: string;
  }
}
```

**Errors:**
- `NotFoundException` - Пользователь не найден

#### Get User by Email
Получить пользователя по email

**Pattern:** `get_user_by_email`

**Request:** `string` (email)

**Response:**
```typescript
{
  success: boolean;
  data: User | null
}
```

#### Create User
Создать пользователя

**Pattern:** `create_user`

**Request:**
```typescript
{
  email: string;
  password: string;
  nameFirst: string;
  nameLast: string;
  birthDate?: Date;
  gender?: 'male' | 'female' | 'other';
}
```

**Response:**
```typescript
{
  success: boolean;
  data: User
}
```

**Errors:**
- `ConflictException` - Email уже используется

#### Update User
Обновить пользователя

**Pattern:** `update_user`

**Request:**
```typescript
{
  id: number;
  data: {
    nameFirst?: string;
    nameLast?: string;
    birthDate?: Date;
    gender?: 'male' | 'female' | 'other';
  }
}
```

**Response:**
```typescript
{
  success: boolean;
  data: User
}
```

**Errors:**
- `NotFoundException` - Пользователь не найден

#### Delete User
Удалить пользователя

**Pattern:** `delete_user`

**Request:** `number` (userId)

**Response:**
```typescript
{
  success: boolean;
  message: string;
}
```

**Errors:**
- `NotFoundException` - Пользователь не найден

### Addresses

#### Get All Addresses
Получить все адреса

**Pattern:** `get_all_addresses`

**Request:** `{}`

**Response:**
```typescript
{
  success: boolean;
  data: Address[]
}
```

#### Get Address by ID
Получить адрес по ID

**Pattern:** `get_address`

**Request:** `number` (addressId)

**Response:**
```typescript
{
  success: boolean;
  data: Address
}
```

#### Get User Addresses
Получить адреса пользователя

**Pattern:** `get_user_addresses`

**Request:** `number` (userId)

**Response:**
```typescript
{
  success: boolean;
  data: Address[]
}
```

#### Get Default Address
Получить адрес по умолчанию

**Pattern:** `get_default_address`

**Request:** `number` (userId)

**Response:**
```typescript
{
  success: boolean;
  data: Address | null
}
```

#### Create Address
Создать адрес

**Pattern:** `create_address`

**Request:**
```typescript
{
  userId: number;
  fullName: string;
  phone: string;
  country: string;
  city: string;
  state?: string;
  postalCode: string;
  addressLine1: string;
  addressLine2?: string;
  isDefault?: boolean;
}
```

**Response:**
```typescript
{
  success: boolean;
  data: Address
}
```

#### Update Address
Обновить адрес

**Pattern:** `update_address`

**Request:**
```typescript
{
  id: number;
  userId: number;
  data: {
    fullName?: string;
    phone?: string;
    country?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    addressLine1?: string;
    addressLine2?: string;
  }
}
```

**Response:**
```typescript
{
  success: boolean;
  data: Address
}
```

**Errors:**
- `NotFoundException` - Адрес не найден
- `ForbiddenException` - Адрес принадлежит другому пользователю

#### Set Default Address
Установить адрес по умолчанию

**Pattern:** `set_default_address`

**Request:**
```typescript
{
  id: number;
  userId: number;
}
```

**Response:**
```typescript
{
  success: boolean;
  data: Address
}
```

#### Delete Address
Удалить адрес

**Pattern:** `delete_address`

**Request:**
```typescript
{
  id: number;
  userId: number;
}
```

**Response:**
```typescript
{
  success: boolean;
  message: string;
}
```

## Примеры использования

### Через API Gateway (HTTP)

#### Регистрация пользователя

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123",
    "nameFirst": "John",
    "nameLast": "Doe"
  }'
```

#### Вход пользователя

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123"
  }'
```

#### Получение пользователя

```bash
curl -X GET http://localhost:3000/users/1
```

#### Создание адреса

```bash
curl -X POST http://localhost:3000/addresses \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "fullName": "John Doe",
    "phone": "+1234567890",
    "country": "USA",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "addressLine1": "123 5th Avenue",
    "addressLine2": "Apt 45",
    "isDefault": true
  }'
```

### Через RabbitMQ (Прямая коммуникация)

```typescript
import { ClientProxy } from '@nestjs/microservices';

// Регистрация
const response = await firstValueFrom(
  this.userClient.send('auth_register', {
    email: 'user@example.com',
    password: 'SecurePass123',
    nameFirst: 'John',
    nameLast: 'Doe',
  }),
);

// Получение пользователя
const user = await firstValueFrom(
  this.userClient.send('get_user', 1),
);
```

## Безопасность

### Хеширование паролей

Пароли хешируются с использованием bcrypt с 10 раундами соли:

```typescript
const hashedPassword = await bcrypt.hash(password, 10);
```

### JWT Токены

Токены генерируются с payload:

```typescript
{
  sub: userId,
  email: userEmail,
  iat: issuedAt,
  exp: expiresAt
}
```

Срок действия: 7 дней (настраивается)

### Валидация данных

Все входящие данные валидируются с помощью class-validator:

```typescript
@IsEmail()
email: string;

@MinLength(6)
password: string;

@MinLength(2)
nameFirst: string;
```

### Защита от SQL Injection

TypeORM автоматически экранирует все параметры запросов.

### Защита паролей в ответах

Пароли никогда не возвращаются в ответах API:

```typescript
const { password, ...userWithoutPassword } = user;
return userWithoutPassword;
```

## Тестирование

### Unit тесты

```bash
npm run test
```

### E2E тесты

```bash
npm run test:e2e
```

### Ручное тестирование

Используйте скрипт `test-user-service.ps1`:

```powershell
cd backend
.\test-user-service.ps1
```

### Тестовые сценарии

1. **Регистрация нового пользователя**
   - Успешная регистрация
   - Дубликат email
   - Невалидные данные

2. **Аутентификация**
   - Успешный вход
   - Неверный пароль
   - Несуществующий пользователь

3. **Управление пользователями**
   - Получение списка
   - Получение по ID
   - Обновление данных
   - Удаление

4. **Управление адресами**
   - Создание адреса
   - Получение адресов пользователя
   - Установка адреса по умолчанию
   - Обновление адреса
   - Удаление адреса

## Мониторинг и логирование

### Логи

Сервис логирует:
- Запуск и остановку
- Подключение к БД и RabbitMQ
- Ошибки обработки запросов
- Критические ошибки

### Метрики

- Время ответа на запросы
- Количество успешных/неуспешных запросов
- Количество активных пользователей
- Количество регистраций

## Troubleshooting

### Сервис не запускается

1. Проверьте подключение к PostgreSQL
2. Проверьте подключение к RabbitMQ
3. Проверьте переменные окружения
4. Проверьте логи: `npm run start:user:dev`

### Ошибки аутентификации

1. Проверьте JWT_SECRET
2. Проверьте срок действия токена
3. Проверьте формат токена

### Ошибки базы данных

1. Проверьте подключение к PostgreSQL
2. Проверьте права доступа
3. Проверьте существование таблиц
4. Включите `synchronize: true` для автосоздания таблиц

## FAQ

**Q: Как изменить срок действия JWT токена?**  
A: Измените `JWT_EXPIRES_IN` в `.env` файле

**Q: Как добавить новые роли пользователей?**  
A: Обновите enum `UserRole` в `user.entity.ts`

**Q: Как включить email верификацию?**  
A: Добавьте поле `emailVerified` в User entity и реализуйте логику отправки email

**Q: Можно ли использовать другую БД?**  
A: Да, TypeORM поддерживает MySQL, MariaDB, SQLite и другие

## Поддержка

Для вопросов и предложений создайте issue в репозитории проекта.

---

**Версия:** 1.0.0  
**Последнее обновление:** 24 октября 2025  
**Автор:** Kiro AI Assistant
