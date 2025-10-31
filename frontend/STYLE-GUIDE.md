# Руководство по стилям - Маркетплейс

## 🎨 Цветовая схема

### Основные цвета

**Градиенты:**
```css
/* Основной градиент (кнопки, заголовки) */
bg-gradient-to-r from-blue-600 to-purple-600
hover:from-blue-700 hover:to-purple-700

/* Фон страниц */
bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50

/* Темная тема - фон */
dark:from-gray-900 dark:via-gray-800 dark:to-gray-900

/* Темная тема - градиенты */
dark:from-blue-400 dark:to-purple-400
```

**Акцентные цвета:**
- Синий: `blue-600` / `blue-700`
- Фиолетовый: `purple-600` / `purple-700`
- Розовый: `pink-600` / `pink-700`
- Зеленый (успех): `green-600`
- Красный (ошибка): `red-600`

## 📦 Компоненты Nuxt UI

### UInput - Текстовые поля

```vue
<UInput
  v-model="value"
  placeholder="Введите текст"
  size="xl"
  color="secondary"
  variant="outline"
  class="w-full"
/>
```

**Размеры:**
- `size="sm"` - маленький
- `size="md"` - средний (по умолчанию)
- `size="lg"` - большой
- `size="xl"` - очень большой ✅ (используем везде)

**Варианты:**
- `variant="outline"` ✅ (используем везде)
- `variant="solid"`
- `variant="ghost"`

### UTextarea - Многострочные поля

```vue
<UTextarea
  v-model="value"
  placeholder="Введите текст"
  size="xl"
  color="secondary"
  variant="outline"
  :rows="5"
  class="w-full"
/>
```

### UButton - Кнопки

**Основная кнопка (градиент):**
```vue
<UButton
  size="xl"
  class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
>
  Текст кнопки
</UButton>
```

**Вторичная кнопка:**
```vue
<UButton
  size="lg"
  color="secondary"
  variant="soft"
>
  Текст кнопки
</UButton>
```

**Кнопка-призрак:**
```vue
<UButton
  size="lg"
  color="gray"
  variant="ghost"
>
  Текст кнопки
</UButton>
```

**Кнопка на всю ширину:**
```vue
<UButton
  block
  size="xl"
  class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
>
  Текст кнопки
</UButton>
```

**Кнопка с загрузкой:**
```vue
<UButton
  :loading="loading"
  size="xl"
>
  Отправить
</UButton>
```

### UCard - Карточки

```vue
<UCard>
  <template #header>
    <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100">
      Заголовок
    </h2>
  </template>

  <!-- Основной контент -->
  <div class="space-y-4">
    <!-- ... -->
  </div>

  <template #footer>
    <UButton block size="lg">
      Действие
    </UButton>
  </template>
</UCard>
```

### UForm - Формы с валидацией

```vue
<UForm
  :schema="schema"
  :state="state"
  @submit="onSubmit"
  class="space-y-4"
>
  <UFormField label="Email" name="email">
    <UInput
      v-model="state.email"
      type="email"
      size="xl"
      color="secondary"
      variant="outline"
      class="w-full"
    />
  </UFormField>

  <UButton type="submit" block size="xl">
    Отправить
  </UButton>
</UForm>
```

**Схема валидации (Zod):**
```typescript
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Введите корректный email"),
  password: z.string().min(6, "Минимум 6 символов"),
});
```

### UIcon - Иконки

```vue
<!-- Heroicons -->
<UIcon name="i-heroicons-user" class="w-6 h-6" />
<UIcon name="i-heroicons-shopping-cart" class="w-6 h-6" />
<UIcon name="i-heroicons-heart" class="w-6 h-6" />

<!-- Размеры -->
<UIcon name="i-heroicons-user" class="w-4 h-4" />  <!-- маленький -->
<UIcon name="i-heroicons-user" class="w-5 h-5" />  <!-- средний -->
<UIcon name="i-heroicons-user" class="w-6 h-6" />  <!-- большой -->
<UIcon name="i-heroicons-user" class="w-8 h-8" />  <!-- очень большой -->
```

**Популярные иконки:**
- `i-heroicons-user` - пользователь
- `i-heroicons-shopping-cart` - корзина
- `i-heroicons-shopping-bag` - заказы
- `i-heroicons-heart` - избранное
- `i-heroicons-star` - звезда/рейтинг
- `i-heroicons-map-pin` - адрес
- `i-heroicons-lock-closed` - пароль
- `i-heroicons-check-circle` - успех
- `i-heroicons-exclamation-circle` - ошибка
- `i-heroicons-information-circle` - информация
- `i-heroicons-pencil` - редактировать
- `i-heroicons-trash` - удалить
- `i-heroicons-plus` - добавить
- `i-heroicons-x-mark` - закрыть

### UPopover - Выпадающее меню

```vue
<UPopover>
  <UButton>
    Открыть меню
    <UIcon name="i-heroicons-chevron-down" class="w-4 h-4 ml-1" />
  </UButton>

  <template #content>
    <div class="p-2 space-y-1 min-w-[200px]">
      <UButton variant="ghost" block class="justify-start">
        <UIcon name="i-heroicons-user" class="w-4 h-4 mr-2" />
        Пункт 1
      </UButton>
      <UButton variant="ghost" block class="justify-start">
        <UIcon name="i-heroicons-cog" class="w-4 h-4 mr-2" />
        Пункт 2
      </UButton>
    </div>
  </template>
</UPopover>
```

## 📐 Отступы и размеры

### Контейнеры

```vue
<!-- Основной контейнер страницы -->
<div class="container mx-auto px-4 py-8">
  <!-- Контент -->
</div>

<!-- Минимальная высота страницы -->
<div class="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
  <!-- Контент -->
</div>
```

### Отступы между элементами

```css
/* Вертикальные отступы */
space-y-2  /* 0.5rem = 8px */
space-y-3  /* 0.75rem = 12px */
space-y-4  /* 1rem = 16px */  ✅ (используем чаще всего)
space-y-5  /* 1.25rem = 20px */
space-y-6  /* 1.5rem = 24px */
space-y-8  /* 2rem = 32px */

/* Горизонтальные отступы */
space-x-2  /* 0.5rem = 8px */
space-x-3  /* 0.75rem = 12px */
space-x-4  /* 1rem = 16px */
gap-4      /* 1rem = 16px */  ✅ (для flex/grid)
gap-6      /* 1.5rem = 24px */
gap-8      /* 2rem = 32px */
```

### Внутренние отступы (padding)

```css
p-2   /* 0.5rem = 8px */
p-3   /* 0.75rem = 12px */
p-4   /* 1rem = 16px */  ✅ (используем для карточек)
p-6   /* 1.5rem = 24px */  ✅ (используем для форм)
p-8   /* 2rem = 32px */
p-10  /* 2.5rem = 40px */

/* Отдельные стороны */
px-4  /* padding-left + padding-right */
py-8  /* padding-top + padding-bottom */
pt-4  /* padding-top */
pb-4  /* padding-bottom */
```

### Скругления (border-radius)

```css
rounded-lg   /* 0.5rem = 8px */
rounded-xl   /* 0.75rem = 12px */  ✅ (используем чаще всего)
rounded-2xl  /* 1rem = 16px */  ✅ (для карточек)
rounded-3xl  /* 1.5rem = 24px */  ✅ (для модальных окон)
rounded-full /* 9999px - круг */
```

## 📝 Типографика

### Заголовки

```vue
<!-- H1 - Заголовок страницы -->
<h1 class="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
  Заголовок страницы
</h1>

<!-- H2 - Заголовок секции -->
<h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100">
  Заголовок секции
</h2>

<!-- H3 - Подзаголовок -->
<h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">
  Подзаголовок
</h3>

<!-- H4 - Маленький заголовок -->
<h4 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
  Маленький заголовок
</h4>
```

### Текст

```vue
<!-- Обычный текст -->
<p class="text-gray-600 dark:text-gray-300">
  Обычный текст
</p>

<!-- Маленький текст -->
<p class="text-sm text-gray-500 dark:text-gray-400">
  Маленький текст
</p>

<!-- Жирный текст -->
<span class="font-semibold text-gray-800 dark:text-gray-100">
  Жирный текст
</span>

<!-- Очень жирный текст -->
<span class="font-bold text-gray-900 dark:text-white">
  Очень жирный текст
</span>
```

## 🎯 Сетки (Grid)

### Адаптивная сетка

```vue
<!-- 1 колонка на mobile, 2 на tablet, 3 на desktop -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div>Элемент 1</div>
  <div>Элемент 2</div>
  <div>Элемент 3</div>
</div>

<!-- Боковое меню + контент -->
<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
  <div class="lg:col-span-1">
    <!-- Боковое меню -->
  </div>
  <div class="lg:col-span-2">
    <!-- Основной контент -->
  </div>
</div>
```

## 🔔 Уведомления (Toast)

```typescript
const toast = useToast()

// Успех
toast.add({
  title: "Успешно!",
  description: "Операция выполнена",
  color: "success"
})

// Ошибка
toast.add({
  title: "Ошибка",
  description: "Что-то пошло не так",
  color: "error"
})

// Информация
toast.add({
  title: "Информация",
  description: "Полезная информация",
  color: "info"
})

// Предупреждение
toast.add({
  title: "Внимание",
  description: "Будьте осторожны",
  color: "warning"
})
```

## 📦 Блоки сообщений

### Успех

```vue
<div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
  <div class="flex items-center gap-2">
    <UIcon name="i-heroicons-check-circle" class="w-5 h-5" />
    Операция выполнена успешно
  </div>
</div>
```

### Ошибка

```vue
<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
  <div class="flex items-center gap-2">
    <UIcon name="i-heroicons-exclamation-circle" class="w-5 h-5" />
    Произошла ошибка
  </div>
</div>
```

### Информация

```vue
<div class="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl text-sm">
  <div class="flex items-center gap-2">
    <UIcon name="i-heroicons-information-circle" class="w-5 h-5" />
    Полезная информация
  </div>
</div>
```

### Предупреждение

```vue
<div class="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-xl text-sm">
  <div class="flex items-center gap-2">
    <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5" />
    Будьте внимательны
  </div>
</div>
```

## 🔄 Загрузка (Loading)

### Спиннер

```vue
<div class="text-center py-12">
  <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
  <p class="mt-4 text-gray-600 dark:text-gray-300">Загрузка...</p>
</div>
```

### Кнопка с загрузкой

```vue
<UButton :loading="loading" size="xl">
  Отправить
</UButton>
```

## 🎨 Темная тема

### Автоматическая поддержка

Все компоненты должны поддерживать темную тему через `dark:` классы:

```vue
<!-- Фон -->
<div class="bg-white dark:bg-gray-800">
  <!-- Контент -->
</div>

<!-- Текст -->
<p class="text-gray-900 dark:text-white">
  Текст
</p>

<!-- Границы -->
<div class="border border-gray-200 dark:border-gray-700">
  <!-- Контент -->
</div>
```

### Переключатель темы

```vue
<UButton
  @click="toggleTheme"
  variant="ghost"
  :icon="colorMode.value === 'dark' ? 'i-heroicons-sun' : 'i-heroicons-moon'"
  square
/>
```

```typescript
const colorMode = useColorMode()

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
```

## 📱 Адаптивность

### Breakpoints

```css
/* Mobile first подход */
sm:   /* 640px */
md:   /* 768px */
lg:   /* 1024px */
xl:   /* 1280px */
2xl:  /* 1536px */
```

### Примеры

```vue
<!-- Скрыть на mobile -->
<div class="hidden md:block">
  Видно только на планшетах и десктопах
</div>

<!-- Показать только на mobile -->
<div class="block md:hidden">
  Видно только на мобильных
</div>

<!-- Адаптивные размеры текста -->
<h1 class="text-2xl md:text-3xl lg:text-4xl">
  Адаптивный заголовок
</h1>

<!-- Адаптивные отступы -->
<div class="px-4 md:px-6 lg:px-8">
  Контент с адаптивными отступами
</div>
```

## ✅ Чек-лист для новых компонентов

- [ ] Использовать Nuxt UI компоненты
- [ ] Размер инпутов: `size="xl"`
- [ ] Цвет инпутов: `color="secondary"`
- [ ] Вариант инпутов: `variant="outline"`
- [ ] Градиентные кнопки: `from-blue-600 to-purple-600`
- [ ] Скругления: `rounded-xl` или `rounded-2xl`
- [ ] Поддержка темной темы: `dark:` классы
- [ ] Адаптивность: mobile-first подход
- [ ] Валидация форм: Zod схемы
- [ ] Уведомления: `useToast()`
- [ ] Обработка ошибок: блоки сообщений
- [ ] Состояние загрузки: спиннеры и `:loading`

## 🎉 Заключение

Следуя этому руководству, все новые компоненты будут выглядеть единообразно и профессионально!
