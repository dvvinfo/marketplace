<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
  >
    <div class="container mx-auto px-4 py-8">
      <div class="text-center mb-12">
        <h1
          class="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
        >
          Каталог товаров
        </h1>
        <p class="text-gray-600 text-lg">Найдите всё, что вам нужно</p>
      </div>

      <div v-if="pending" class="text-center py-12">
        <div
          class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"
        ></div>
        <p class="mt-4 text-gray-600">Загрузка товаров...</p>
      </div>

      <div
        v-else-if="!products || products.length === 0"
        class="text-center py-12"
      >
        <UIcon
          name="i-heroicons-shopping-bag"
          class="w-16 h-16 mx-auto text-gray-400 mb-4"
        />
        <p class="text-gray-600 text-lg">Товары не найдены</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <UCard
          v-for="product in products"
          :key="product.id"
          class="hover:shadow-xl transition-shadow duration-300"
        >
          <template #header>
            <div class="relative overflow-hidden rounded-t-lg">
              <img
                v-if="product.imageUrl"
                :src="product.imageUrl"
                :alt="product.name"
                class="w-full h-48 object-cover hover:scale-110 transition-transform duration-300"
              />
              <div
                v-else
                class="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center"
              >
                <UIcon
                  name="i-heroicons-photo"
                  class="w-16 h-16 text-gray-400"
                />
              </div>
            </div>
          </template>

          <h3 class="text-lg font-semibold mb-2 text-gray-800">
            {{ product.name }}
          </h3>
          <p class="text-gray-600 mb-4 line-clamp-2">
            {{ product.description }}
          </p>
          <div class="flex justify-between items-center">
            <span
              class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
            >
              {{ product.price }} ₽
            </span>
            <UButton
              @click="addToCart(product.id)"
              class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              В корзину
            </UButton>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { apiFetch } = useApi();
const cartStore = useCartStore();

const { data: products, pending } = await useAsyncData("products", () =>
  apiFetch<any[]>("/products")
);

const addToCart = async (productId: number) => {
  try {
    await cartStore.addItem(productId, 1);
    // Show success notification
  } catch (error) {
    // Show error notification
  }
};
</script>
