# Реализация смены пароля (Change Password)

## Обзор

Добавлен функционал смены пароля пользователя с проверкой текущего пароля.

## Архитектура

### 1. User Service (Микросервис)

#### DTO
- **ChangePasswordDto** (`backend/apps/user-service/src/auth/dto/change-password.dto.ts`)
  - `userId: number` - ID пользователя
  - `oldPassword: string` - Текущий пароль
  - `newPassword: string` - Новый пароль (минимум 6 символов)

#### UserService
- **changePassword(userId, oldPassword, newPassword)** - Метод в `user.service.ts`
  - Проверяет существование пользователя
  - Проверяет корректность текущего пароля
  - Хеширует новый пароль с помощью bcrypt
  - Сохраняет новый пароль в БД

#### AuthService
- **changePassword(userId, oldPassword, newPassword)** - Метод в `auth.service.ts`
  - Вызывает метод UserService
  - Возвращает сообщение об успехе

#### AuthController
- **@MessagePattern(AUTH_CHANGE_PASSWORD)** - Обработчик RabbitMQ
  - Принимает ChangePasswordDto
  - Вызывает AuthService.changePassword
  - Возвращает результат с обработкой ошибок

### 2. API Gateway

#### AuthController
- **POST /auth/change-password** - HTTP эндпоинт
  - Защищен JWT Guard
  - Принимает: `{ oldPassword, newPassword }`
  - Автоматически получает userId из JWT токена
  - Возвращает: `{ message: "Password changed successfully" }`

#### AuthService
- **changePassword(userId, oldPassword, newPassword)** - Метод
  - Отправляет сообщение в RabbitMQ
  - Паттерн: `AUTH_CHANGE_PASSWORD`

## Безопасность

1. **Аутентификация**: Требуется JWT токен
2. **Проверка текущего пароля**: Обязательна для смены
3. **Хеширование**: Новый пароль хешируется с помощью bcrypt (10 раундов)
4. **Валидация**: Минимальная длина нового пароля - 6 символов

## Обработка ошибок

- `NotFoundException`: Пользователь не найден
- `ConflictException`: Неверный текущий пароль
- `UnauthorizedException`: Невалидный JWT токен

## API Endpoint

### POST /auth/change-password

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body:**
```json
{
  "oldPassword": "current_password",
  "newPassword": "new_password"
}
```

**Success Response (200):**
```json
{
  "message": "Password changed successfully"
}
```

**Error Responses:**
- `400`: Неверный текущий пароль
- `401`: Не авторизован
- `404`: Пользователь не найден

## Тестирование

### Автоматический тест
```bash
# Windows
cd backend
.\TEST-CHANGE-PASSWORD.bat

# PowerShell
cd backend
.\test-change-password.ps1
```

### Ручное тестирование
Используйте файл `backend/test-change-password.http` с REST Client в VS Code.

### Тестовый сценарий
1. Регистрация нового пользователя
2. Логин для получения JWT токена
3. Смена пароля с валидным текущим паролем
4. Проверка: старый пароль больше не работает
5. Проверка: новый пароль работает корректно
6. Проверка: неверный текущий пароль отклоняется

## Интеграция с фронтендом

Фронтенд может вызвать эндпоинт:

```typescript
const changePassword = async (oldPassword: string, newPassword: string) => {
  const response = await fetch('/api/auth/change-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ oldPassword, newPassword })
  });
  
  if (!response.ok) {
    throw new Error('Failed to change password');
  }
  
  return await response.json();
};
```

## Файлы

### Созданные файлы:
- `backend/apps/user-service/src/auth/dto/change-password.dto.ts`
- `backend/test-change-password.http`
- `backend/test-change-password.ps1`
- `backend/TEST-CHANGE-PASSWORD.bat`

### Измененные файлы:
- `backend/apps/user-service/src/auth/auth.controller.ts`
- `backend/apps/user-service/src/auth/auth.service.ts`
- `backend/apps/user-service/src/user/user.service.ts`

### Существующие файлы (не изменялись):
- `backend/libs/shared/src/constants/index.ts` (паттерн уже был добавлен)
- `backend/apps/api-gateway/src/modules/auth/auth.controller.ts` (эндпоинт уже был)
- `backend/apps/api-gateway/src/modules/auth/auth.service.ts` (метод уже был)
