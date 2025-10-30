<template>
  <div class="space-y-2">
    <div
      v-for="category in categories"
      :key="category.id"
      class="category-item"
    >
      <div
        class="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
        :class="{ 'bg-purple-50 dark:bg-purple-900/20': selectedCategory === category.id }"
        @click="selectCategory(category.id)"
      >
        <!-- Иконка раскрытия (если есть дочерние) -->
        <UButton
          v-if="category.children && category.children.length > 0"
          @click.stop="toggleExpand(category.id)"
          variant="ghost"
          size="xs"
          :icon="expandedCategories.has(category.id) ? 'i-heroicons-chevron-down' : 'i-heroicons-chevron-right'"
        />
        <div v-else class="w-6"></div>

        <!-- Название категории -->
        <span
          class="flex-1 text-sm"
          :class="{ 'font-semibold text-purple-600 dark:text-purple-400': selectedCategory === category.id }"
        >
          {{ category.name }}
        </span>

        <!-- Количество товаров (если есть) -->
        <span
          v-if="category.productCount"
          class="text-xs text-gray-500 dark:text-gray-400"
        >
          {{ category.productCount }}
        </span>
      </div>

      <!-- Дочерние категории -->
      <div
        v-if="category.children && category.children.length > 0 && expandedCategories.has(category.id)"
        class="ml-6 mt-1"
      >
        <CategoryTree
          :categories="category.children"
          :selected-category="selectedCategory"
          @select="$emit('select', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Category {
  id: number;
  name: string;
  productCount?: number;
  children?: Category[];
}

interface Props {
  categories: Category[];
  selectedCategory: number | null;
}

defineProps<Props>();

const emit = defineEmits<{
  'select': [categoryId: number];
}>();

const expandedCategories = ref<Set<number>>(new Set());

const toggleExpand = (categoryId: number) => {
  if (expandedCategories.value.has(categoryId)) {
    expandedCategories.value.delete(categoryId);
  } else {
    expandedCategories.value.add(categoryId);
  }
};

const selectCategory = (categoryId: number) => {
  emit('select', categoryId);
};
</script>

<style scoped>
.category-item {
  position: relative;
}
</style>
