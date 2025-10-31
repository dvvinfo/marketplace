# Интеграция адресов с бэкендом

## Обзор

Компонент `AddressManager` теперь полностью интегрирован с бэкенд API для сохранения адресов доставки в базе данных PostgreSQL.

## Что изменено

### 1. Создан composable `useAddresses.ts`

**Расположение:** `frontend/app/composables/useAddresses.ts`

**Функции:**
- `getAddresses(userId)` - получить все адреса пользователя
- `getDefaultAddress(userId)` - получить адрес по умолчанию
- `createAddress(data)` - создать новый адрес
- `updateAddress(id, userId, data)` - обновить адрес
- `setDefaultAddress(id, userId)` - установить адрес по умолчанию
- `deleteAddress(id, userId)` - удалить адрес
- `formatAddressString(address)` - форматировать адрес в строку

**Интерфейсы:**
```typescript
interface Address {
  id: number;
  userId: number;
  fullName: string;
  phone: string;
  country: string;
  city: string;
  state?: string;
  postalCode: string;
  addressLine1: string;
  addressLine2?: string;
  isDefault: boolean;
}
```

### 2. Обновлен компонент `AddressManager.vue`

**Изменения:**
- ❌ Удалено: Сохранение в localStorage
- ✅ Добавлено: Интеграция с API через `useAddresses`
- ✅ Обновлены поля формы согласно бэкенд DTO:
  - `fullName` - ФИО получателя
  - `phone` - Телефон
  - `country` - Страна
  - `city` - Город
  - `state` - Регион (опционально)
  - `postalCode` - Почтовый индекс
  - `addressLine1` - Адрес (основная строка)
  - `addressLine2` - Дополнительная информация (опционально)
  - `isDefault` - Адрес по умолчанию

**Автозаполнение:**
- ФИО автоматически заполняется из профиля пользователя
- Телефон автоматически заполняется из профиля (если указан)

### 3. API эндпоинты

**Базовый URL:** `http://localhost:3001`

**Эндпоинты:**
- `GET /addresses/user/:userId` - список адресов
- `GET /addresses/user/:userId/default` - адрес по умолчанию
- `POST /addresses` - создать адрес
- `PUT /addresses/:id/user/:userId` - обновить адрес
- `PATCH /addresses/:id/user/:userId/default` - установить по умолчанию
- `DELETE /addresses/:id/user/:userId` - удалить адрес

## Использование

### В компоненте AddressManager

```vue
<AddressManager :user-id="user.id" />
```

### Через composable

```typescript
const { getAddresses, createAddress, formatAddressString } = useAddresses();

// Получить адреса
const addresses = await getAddresses(userId);

// Создать адрес
const newAddress = await createAddress({
  userId: 1,
  fullName: "Иванов Иван",
  phone: "+79991234567",
  country: "Россия",
  city: "Москва",
  postalCode: "123456",
  addressLine1: "ул. Ленина, д. 10, кв. 5",
  isDefault: true,
});

// Форматировать адрес
const formatted = formatAddressString(address);
// "ул. Ленина, д. 10, кв. 5, Москва, 123456, Россия"
```

## Структура данных

### Создание адреса (POST /addresses)

```json
{
  "userId": 1,
  "fullName": "Иванов Иван Иванович",
  "phone": "+7 (999) 123-45-67",
  "country": "Россия",
  "city": "Москва",
  "state": "Московская область",
  "postalCode": "123456",
  "addressLine1": "ул. Ленина, д. 10, кв. 5",
  "addressLine2": "Подъезд 2, домофон 123",
  "isDefault": true
}
```

### Ответ сервера

```json
{
  "id": 1,
  "userId": 1,
  "fullName": "Иванов Иван Иванович",
  "phone": "+7 (999) 123-45-67",
  "country": "Россия",
  "city": "Москва",
  "state": "Московская область",
  "postalCode": "123456",
  "addressLine1": "ул. Ленина, д. 10, кв. 5",
  "addressLine2": "Подъезд 2, домофон 123",
  "isDefault": true,
  "createdAt": "2025-10-31T12:00:00.000Z",
  "updatedAt": "2025-10-31T12:00:00.000Z"
}
```

## Валидация

**Минимальные требования:**
- ФИО: минимум 2 символа
- Телефон: минимум 10 символов
- Страна: минимум 2 символа
- Город: минимум 2 символа
- Индекс: минимум 5 символов
- Адрес (addressLine1): минимум 5 символов

## Особенности

1. **Адрес по умолчанию:** При установке нового адреса по умолчанию, флаг автоматически снимается с других адресов
2. **Автозаполнение:** Форма автоматически заполняется данными из профиля пользователя
3. **Валидация:** Все поля проходят валидацию на клиенте и сервере
4. **Уведомления:** Пользователь получает уведомления об успехе/ошибке операций

## Миграция данных

Если у пользователей были адреса в localStorage, они НЕ будут автоматически перенесены в базу данных. Пользователям нужно будет добавить адреса заново через форму.

## Тестирование

1. Откройте профиль пользователя
2. Перейдите на вкладку "Адреса"
3. Добавьте новый адрес
4. Проверьте, что адрес сохранился (обновите страницу)
5. Отредактируйте адрес
6. Установите адрес по умолчанию
7. Удалите адрес

## Готово! 🚀

Адреса теперь сохраняются в базе данных и доступны на всех устройствах пользователя.
