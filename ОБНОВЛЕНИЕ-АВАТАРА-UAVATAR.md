# Обновление: Использование UAvatar

## Изменения

Заменили кастомную реализацию аватара на компонент **UAvatar** из Nuxt UI.

## Обновленные файлы

1. **AvatarUpload.vue** - использует UAvatar для превью
2. **AppHeader.vue** - использует UAvatar в хедере
3. **profile.vue** - передает userName в AvatarUpload

## Преимущества UAvatar

### Было (кастомная реализация):

```vue
<div class="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-200">
  <img v-if="avatarUrl" :src="avatarUrl" class="w-full h-full object-cover" />
  <div v-else class="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600">
    <UIcon name="i-heroicons-user" class="w-16 h-16 text-white" />
  </div>
</div>
```

### Стало (UAvatar):

```vue
<UAvatar
  :src="avatarUrl || undefined"
  :alt="userName"
  size="3xl"
  icon="i-heroicons-user"
  class="ring-4 ring-purple-200 dark:ring-purple-800 shadow-lg"
/>
```

## Преимущества

✅ **Меньше кода** - 1 компонент вместо 10+ строк  
✅ **Единый стиль** - соответствует Nuxt UI  
✅ **Автоматический fallback** - иконка если нет изображения  
✅ **Размеры из коробки** - xs, sm, md, lg, xl, 2xl, 3xl  
✅ **Темная тема** - автоматическая поддержка  
✅ **Accessibility** - встроенная поддержка alt  

## Размеры UAvatar

### В профиле:
```vue
<UAvatar size="3xl" />  <!-- 128x128px -->
```

### В хедере:
```vue
<UAvatar size="sm" />   <!-- 32x32px -->
```

### Доступные размеры:
- `xs` - 20x20px
- `sm` - 32x32px
- `md` - 40x40px (по умолчанию)
- `lg` - 48x48px
- `xl` - 64x64px
- `2xl` - 80x80px
- `3xl` - 128x128px

## Стилизация

### Рамка (ring):

**Профиль:**
```vue
class="ring-4 ring-purple-200 dark:ring-purple-800"
```

**Хедер:**
```vue
class="ring-2 ring-white"
```

### Тень:
```vue
class="shadow-lg"
```

## Props UAvatar

```typescript
{
  src?: string;           // URL изображения
  alt?: string;           // Alt текст
  size?: string;          // Размер (xs, sm, md, lg, xl, 2xl, 3xl)
  icon?: string;          // Иконка fallback
  text?: string;          // Текст fallback (инициалы)
  chip-color?: string;    // Цвет индикатора статуса
  chip-position?: string; // Позиция индикатора
}
```

## Примеры использования

### С изображением:
```vue
<UAvatar
  src="https://example.com/avatar.jpg"
  alt="John Doe"
  size="lg"
/>
```

### С иконкой fallback:
```vue
<UAvatar
  icon="i-heroicons-user"
  size="md"
/>
```

### С инициалами:
```vue
<UAvatar
  text="JD"
  size="xl"
/>
```

### С индикатором статуса:
```vue
<UAvatar
  src="avatar.jpg"
  chip-color="green"
  chip-position="top-right"
/>
```

## Интеграция в проект

### AvatarUpload Component

```vue
<UAvatar
  :src="avatarUrl || undefined"
  :alt="userName"
  size="3xl"
  icon="i-heroicons-user"
  class="ring-4 ring-purple-200 dark:ring-purple-800 shadow-lg"
/>
```

**Props:**
- `avatarUrl` - URL или base64 изображения
- `userName` - имя пользователя для alt
- `size="3xl"` - большой размер для профиля
- `icon` - иконка если нет аватара
- `class` - кастомные стили (рамка, тень)

### AppHeader Component

```vue
<UAvatar
  :src="user?.avatar || undefined"
  :alt="user?.nameFirst"
  size="sm"
  icon="i-heroicons-user"
  class="ring-2 ring-white"
/>
```

**Особенности:**
- `size="sm"` - маленький размер для хедера
- `ring-2 ring-white` - белая рамка на цветном фоне

## Миграция

### Шаг 1: Заменить кастомный div на UAvatar

**Было:**
```vue
<div class="w-32 h-32 rounded-full">
  <img :src="avatar" />
</div>
```

**Стало:**
```vue
<UAvatar :src="avatar" size="3xl" />
```

### Шаг 2: Добавить fallback

**Было:**
```vue
<div v-if="!avatar">
  <UIcon name="i-heroicons-user" />
</div>
```

**Стало:**
```vue
<UAvatar :src="avatar" icon="i-heroicons-user" />
```

### Шаг 3: Добавить стили

```vue
<UAvatar
  :src="avatar"
  size="3xl"
  class="ring-4 ring-purple-200 shadow-lg"
/>
```

## Результат

✅ Код стал чище и короче  
✅ Единый стиль со всем приложением  
✅ Автоматическая поддержка темной темы  
✅ Лучшая accessibility  
✅ Меньше кастомного CSS  

## Статус

✅ **Обновлено и готово**

**Дата обновления:** 31 октября 2025
