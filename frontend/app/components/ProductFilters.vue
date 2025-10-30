<template>
  <UCard class="sticky top-4">
    <template #header>
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100">
          Фильтры
        </h2>
        <UButton
          @click="$emit('reset')"
          variant="ghost"
          size="sm"
          color="secondary"
        >
          Сбросить
        </UButton>
      </div>
    </template>

    <div class="space-y-6">
      <!-- Категории -->
      <div>
        <h3 class="font-semibold text-gray-700 dark:text-gray-200 mb-3">
          Категории
        </h3>

        <div v-if="loading" class="text-center py-4">
          <div
            class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"
          ></div>
        </div>

        <div v-else-if="categories.length === 0" class="text-gray-500 text-sm">
          Категории не найдены
        </div>

        <div v-else class="space-y-2 max-h-64 overflow-y-auto">
          <div
            v-for="category in categories"
            :key="category.id"
            @click="$emit('update:selectedCategory', category.id)"
            class="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
            :class="{
              'bg-purple-50 dark:bg-purple-900/20 font-semibold':
                selectedCategory === category.id,
            }"
          >
            <div class="flex items-center gap-2 w-full">
              <div
                class="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                :class="
                  selectedCategory === category.id
                    ? 'border-purple-600 bg-purple-600'
                    : 'border-gray-300 dark:border-gray-600'
                "
              >
                <div
                  v-if="selectedCategory === category.id"
                  class="w-2 h-2 rounded-full bg-white"
                ></div>
              </div>
              <span class="text-sm">{{ category.name }}</span>
            </div>
          </div>

          <!-- Опция "Все категории" -->
          <div
            @click="$emit('update:selectedCategory', null)"
            class="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors border-t border-gray-200 dark:border-gray-700 mt-2 pt-3"
            :class="{
              'bg-purple-50 dark:bg-purple-900/20 font-semibold':
                selectedCategory === null,
            }"
          >
            <div class="flex items-center gap-2 w-full">
              <div
                class="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                :class="
                  selectedCategory === null
                    ? 'border-purple-600 bg-purple-600'
                    : 'border-gray-300 dark:border-gray-600'
                "
              >
                <div
                  v-if="selectedCategory === null"
                  class="w-2 h-2 rounded-full bg-white"
                ></div>
              </div>
              <span class="text-sm">Все категории</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Цена -->
      <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h3 class="font-semibold text-gray-700 dark:text-gray-200 mb-3">
          Цена, ₽
        </h3>

        <div class="space-y-3">
          <UInput
            :model-value="minPrice"
            @update:model-value="
              $emit('update:minPrice', $event ? Number($event) : null)
            "
            type="number"
            placeholder="От"
            size="md"
            color="secondary"
            class="w-full"
          />
          <UInput
            :model-value="maxPrice"
            @update:model-value="
              $emit('update:maxPrice', $event ? Number($event) : null)
            "
            type="number"
            placeholder="До"
            size="md"
            color="secondary"
            class="w-full"
          />
        </div>
      </div>

      <!-- Кнопка применить -->
      <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
        <UButton
          @click="$emit('apply')"
          block
          size="lg"
          class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
        >
          Применить
        </UButton>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
interface Category {
  id: number;
  name: string;
  description?: string;
}

interface Props {
  selectedCategory: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  categories: Category[];
  loading?: boolean;
}

defineProps<Props>();

defineEmits<{
  "update:selectedCategory": [value: number | null];
  "update:minPrice": [value: number | null];
  "update:maxPrice": [value: number | null];
  apply: [];
  reset: [];
}>();
</script>
