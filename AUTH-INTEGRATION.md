# Интеграция авторизации и регистрации

## Статус: ✅ Готово

Фронтенд успешно подключен к бэкенду для авторизации и регистрации.

## API Endpoints

### Регистрация

- **URL**: `POST /auth/register`
- **Body**:

```json
{
  "email": "user@example.com",
  "password": "password123",
  "nameFirst": "Иван",
  "nameLast": "Иванов"
}
```

- **Response**:

```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "nameFirst": "Иван",
    "nameLast": "Иванов",
    "role": "user"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Логин

- **URL**: `POST /auth/login`
- **Body**:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

- **Response**: Аналогично регистрации

### Профиль

- **URL**: `GET /auth/profile`
- **Headers**: `Authorization: Bearer {accessToken}`
- **Response**: Данные пользователя

## Фронтенд

### Страницы

- `/login` - Страница входа
- `/register` - Страница регистрации

### Composables

- `useAuth()` - Основной composable для работы с авторизацией
  - `login(email, password)` - Вход
  - `register(data)` - Регистрация
  - `logout()` - Выход
  - `fetchUser()` - Получить данные пользователя
  - `isAuthenticated` - Статус авторизации
  - `user` - Данные пользователя
  - `token` - JWT токен

### Middleware

- `auth.ts` - Защита страниц (только для авторизованных)
- `guest.ts` - Доступ только для неавторизованных

## Тестирование

Запустите оба сервиса:

```bash
# Backend (должен быть запущен на http://localhost:3001)
cd backend
npm run start:dev

# Frontend (запущен на http://localhost:3000)
cd frontend
npm run dev
```

Откройте http://localhost:3000/register для регистрации нового пользователя.

## Что было исправлено

1. ✅ Маппинг полей: `firstName/lastName` → `nameFirst/nameLast`
2. ✅ Исправлено имя поля токена: `access_token` → `accessToken`
3. ✅ Добавлена обработка ошибок с понятными сообщениями
4. ✅ Middleware для защиты роутов уже настроены
5. ✅ Cookie для хранения токена (7 дней)
6. ✅ Настроен CORS на бэкенде для фронтенда
7. ✅ Добавлен JwtStrategy и PassportModule в AuthModule
8. ✅ Исправлена логика сохранения сессии при перезагрузке страницы

## Функционал выхода

При нажатии кнопки "Выйти" в выпадающем меню:
1. Очищается JWT токен из cookies
2. Очищаются данные пользователя из состояния
3. Очищается корзина (локально)
4. Редирект на страницу `/login`

## ВАЖНО: Перезапуск бэкенда

После изменений в `main.ts` нужно перезапустить бэкенд:

```bash
cd backend
# Остановите текущий процесс (Ctrl+C) и запустите снова
npm run start:dev
```

## Отладка

В консоли браузера (F12) можно увидеть логи:
- Монтирование AppHeader с текущим статусом авторизации
- Загрузка данных пользователя
- Изменения в состоянии авторизации и пользователя
