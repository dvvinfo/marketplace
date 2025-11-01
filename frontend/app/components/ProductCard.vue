<template>
  <UCard class="relative hover:shadow-lg transition-shadow">
    <!-- Кнопка избранного -->
    <div class="absolute top-2 -right-1 z-10">
      <FavoriteButton
        :product-id="product.id"
        :is-favorite="isFavorite"
        @toggle="$emit('toggleFavorite', product.id)"
      />
    </div>

    <NuxtLink :to="`/products/${product.id}`" class="block">
      <!-- Изображение товара -->
      <div class="aspect-square mb-4 overflow-hidden rounded-lg bg-gray-100">
        <img
          v-if="product.imageUrl"
          :src="product.imageUrl"
          :alt="product.name"
          class="w-full h-full object-cover hover:scale-105 transition-transform"
        />
        <div
          v-else
          class="w-full h-full flex items-center justify-center text-gray-400"
        >
          <UIcon name="i-heroicons-photo" class="w-16 h-16" />
        </div>
      </div>

      <!-- Информация о товаре -->
      <div class="space-y-2">
        <h3 class="font-semibold text-lg line-clamp-2 hover:text-primary">
          {{ product.name }}
        </h3>

        <p class="text-sm text-gray-600 line-clamp-2">
          {{ product.description }}
        </p>

        <!-- Рейтинг -->
        <div v-if="product.rating" class="flex items-center gap-1">
          <UIcon name="i-heroicons-star-solid" class="text-yellow-400" />
          <span class="text-sm font-medium">{{ product.rating.toFixed(1) }}</span>
          <span class="text-sm text-gray-500">({{ product.reviewCount || 0 }})</span>
        </div>

        <!-- Цена -->
        <div class="flex items-center justify-between">
          <span class="text-2xl font-bold text-primary">
            {{ formatPrice(product.price) }}
          </span>

          <!-- Наличие -->
          <UBadge
            :color="product.stock > 0 ? 'success' : 'error'"
            variant="subtle"
          >
            {{ product.stock > 0 ? 'В наличии' : 'Нет в наличии' }}
          </UBadge>
        </div>
      </div>
    </NuxtLink>

    <!-- Кнопка добавления в корзину -->
    <template #footer>
      <UButton
        block
        color="primary"
        :disabled="product.stock === 0"
        @click="$emit('addToCart', product)"
      >
        <UIcon name="i-heroicons-shopping-cart" class="mr-2" />
        В корзину
      </UButton>
    </template>
  </UCard>
</template>

<script setup lang="ts">
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  stock: number;
  rating?: number;
  reviewCount?: number;
}

defineProps<{
  product: Product;
  isFavorite: boolean;
}>();

defineEmits<{
  toggleFavorite: [productId: number];
  addToCart: [product: Product];
}>();

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
  }).format(price);
};
</script>
