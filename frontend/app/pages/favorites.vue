<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2">Избранное</h1>
      <p class="text-gray-600">
        {{ favoritesCount }} {{ pluralize(favoritesCount, 'товар', 'товара', 'товаров') }}
      </p>
    </div>

    <!-- Загрузка -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <USkeleton v-for="i in 8" :key="i" class="h-96" />
    </div>

    <!-- Пустое избранное -->
    <UCard v-else-if="favoriteProducts.length === 0" class="text-center py-12">
      <div class="flex flex-col items-center gap-4">
        <UIcon name="i-heroicons-heart" class="w-24 h-24 text-gray-300" />
        <h2 class="text-2xl font-semibold text-gray-700">Избранное пусто</h2>
        <p class="text-gray-500 max-w-md">
          Добавляйте товары в избранное, чтобы не потерять их
        </p>
        <UButton to="/products" color="primary" size="lg">
          Перейти в каталог
        </UButton>
      </div>
    </UCard>

    <!-- Список избранных товаров -->
    <div v-else class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <UCard
        v-for="product in favoriteProducts"
        :key="product.id"
        class="hover:shadow-xl transition-shadow duration-300 cursor-pointer relative"
      >
        <!-- Кнопка избранного -->
        <div class="absolute top-2 right-2 z-10">
          <UButton
            icon="i-heroicons-heart-solid"
            color="error"
            variant="ghost"
            size="lg"
            @click.stop="handleToggleFavorite(product.id)"
            title="Удалить из избранного"
          />
        </div>

        <template #header>
          <NuxtLink :to="`/products/${product.id}`">
            <div class="relative overflow-hidden rounded-t-lg">
              <img
                v-if="product.image"
                :src="product.image"
                :alt="product.title"
                class="w-full h-48 object-cover hover:scale-110 transition-transform duration-300"
                @error="(e) => { console.error('Image load error:', product.image); (e.target as HTMLImageElement).style.display = 'none'; }"
              />
              <div
                v-if="!product.image"
                class="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center"
              >
                <UIcon
                  name="i-heroicons-photo"
                  class="w-16 h-16 text-gray-400"
                />
              </div>
            </div>
          </NuxtLink>
        </template>

        <NuxtLink :to="`/products/${product.id}`">
          <h3
            class="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100 hover:text-purple-600 transition-colors"
          >
            {{ product.title }}
          </h3>
        </NuxtLink>
        <p class="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
          {{ product.description }}
        </p>
        <div class="flex justify-between items-center">
          <span
            class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
          >
            {{ product.price }} ₽
          </span>
          <UButton
            v-if="!isInCart(product.id)"
            @click.stop="handleAddToCart(product)"
            class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            В корзину
          </UButton>
          <UButton
            v-else
            to="/cart"
            class="bg-green-600 hover:bg-green-700 text-white"
          >
            В корзине ✓
          </UButton>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart';

definePageMeta({
  middleware: 'auth',
});

const cartStore = useCartStore();
const { favorites, favoritesCount, loadFavorites, toggleFavorite } = useFavorites();
const { apiFetch } = useApi();
const toast = useToast();

const loading = ref(true);
const favoriteProducts = ref<any[]>([]);

// Загрузить избранное и детали товаров
onMounted(async () => {
  await loadFavorites();
  await loadFavoriteProducts();
  await cartStore.fetchCart();
  loading.value = false;
});

// Загрузить детали товаров из избранного
const loadFavoriteProducts = async () => {
  if (favorites.value.length === 0) {
    favoriteProducts.value = [];
    return;
  }

  try {
    console.log('Loading favorite products for IDs:', favorites.value);
    const products = await Promise.all(
      favorites.value.map((productId) =>
        apiFetch(`/products/${productId}`).catch((err) => {
          console.error(`Failed to load product ${productId}:`, err);
          return null;
        })
      )
    );
    favoriteProducts.value = products.filter((p) => p !== null);
    console.log('Loaded favorite products:', favoriteProducts.value);
  } catch (error) {
    console.error('Ошибка загрузки товаров:', error);
  }
};

// Переключить избранное
const handleToggleFavorite = async (productId: number) => {
  await toggleFavorite(productId);
  // Удаляем товар из списка
  favoriteProducts.value = favoriteProducts.value.filter(
    (p) => p.id !== productId
  );
};

// Проверить, находится ли товар в корзине
const isInCart = (productId: number) => {
  return cartStore.items.some(item => item.productId === productId);
};

// Добавить в корзину
const handleAddToCart = async (product: any) => {
  try {
    await cartStore.addItem(product.id, 1);
    toast.add({
      title: 'Успешно!',
      description: 'Товар добавлен в корзину',
      color: 'success',
    });
  } catch (error) {
    toast.add({
      title: 'Ошибка',
      description: 'Не удалось добавить товар в корзину',
      color: 'error',
    });
  }
};

// Функция для склонения слов
const pluralize = (count: number, one: string, few: string, many: string) => {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
};
</script>
