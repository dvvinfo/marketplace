<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Skeleton Loaders Demo</h1>

    <div class="space-y-8">
      <!-- Базовый skeleton -->
      <div>
        <h2 class="text-xl font-semibold mb-4">Базовый Skeleton</h2>
        <USkeleton class="h-12 w-full" />
      </div>

      <!-- Сетка скелетонов (как в каталоге) -->
      <div>
        <h2 class="text-xl font-semibold mb-4">Сетка товаров (каталог)</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <USkeleton v-for="i in 6" :key="i" class="h-96" />
        </div>
      </div>

      <!-- Карточка товара -->
      <div>
        <h2 class="text-xl font-semibold mb-4">Страница товара</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <USkeleton class="h-96" />
          <div class="space-y-4">
            <USkeleton class="h-12" />
            <USkeleton class="h-8" />
            <USkeleton class="h-24" />
            <USkeleton class="h-16" />
          </div>
        </div>
      </div>

      <!-- Список заказов -->
      <div>
        <h2 class="text-xl font-semibold mb-4">Список заказов</h2>
        <div class="space-y-4">
          <USkeleton v-for="i in 3" :key="i" class="h-32" />
        </div>
      </div>

      <!-- Корзина -->
      <div>
        <h2 class="text-xl font-semibold mb-4">Корзина</h2>
        <div class="space-y-4">
          <USkeleton v-for="i in 3" :key="i" class="h-32" />
        </div>
      </div>

      <!-- Checkout -->
      <div>
        <h2 class="text-xl font-semibold mb-4">Оформление заказа</h2>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 space-y-6">
            <USkeleton class="h-96" />
            <USkeleton class="h-64" />
          </div>
          <USkeleton class="h-96" />
        </div>
      </div>

      <!-- Кнопка для возврата -->
      <div class="mt-8">
        <UButton to="/" size="lg">
          Вернуться на главную
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Skeleton Loaders Demo',
});
</script>
