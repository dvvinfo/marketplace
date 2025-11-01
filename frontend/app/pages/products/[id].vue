<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <div class="container mx-auto px-4 py-8">
      <!-- Loading State -->
      <div v-if="pending" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <USkeleton class="h-96" />
        <div class="space-y-4">
          <USkeleton class="h-12" />
          <USkeleton class="h-8" />
          <USkeleton class="h-24" />
          <USkeleton class="h-16" />
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <UIcon name="i-heroicons-exclamation-triangle" class="w-16 h-16 mx-auto text-red-500 mb-4" />
        <p class="text-gray-600 dark:text-gray-300 text-lg mb-4">Товар не найден</p>
        <UButton to="/" class="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          Вернуться к каталогу
        </UButton>
      </div>

      <!-- Product Content -->
      <div v-else-if="product">
        <!-- Breadcrumbs -->
        <nav class="mb-6 text-sm">
          <ol class="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <li><NuxtLink to="/" class="hover:text-purple-600">Главная</NuxtLink></li>
            <li>/</li>
            <li v-if="product.category">
              <span class="hover:text-purple-600">{{ product.category.name }}</span>
            </li>
            <li>/</li>
            <li class="text-gray-900 dark:text-gray-100">{{ product.title }}</li>
          </ol>
        </nav>

        <!-- Product Details -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <!-- Product Image -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div class="relative overflow-hidden rounded-lg">
              <img
                v-if="product.image"
                :src="product.image"
                :alt="product.title"
                class="w-full h-96 object-cover"
              />
              <div
                v-else
                class="w-full h-96 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center"
              >
                <UIcon name="i-heroicons-photo" class="w-32 h-32 text-gray-400" />
              </div>
            </div>
          </div>

          <!-- Product Info -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div class="flex justify-between items-start mb-4">
              <h1 class="text-4xl font-bold text-gray-900 dark:text-gray-100 flex-1">
                {{ product.title }}
              </h1>
              <!-- Кнопка избранного -->
              <UButton
                icon="i-heroicons-heart-solid"
                :color="isFavorite(product.id) ? 'error' : 'neutral'"
                variant="ghost"
                size="xl"
                @click="toggleFavorite(product.id)"
                :title="isFavorite(product.id) ? 'Удалить из избранного' : 'Добавить в избранное'"
              />
            </div>

            <!-- Rating -->
            <div v-if="productRating" class="flex items-center gap-3 mb-6">
              <div class="flex items-center">
                <UIcon
                  v-for="star in 5"
                  :key="star"
                  name="i-heroicons-star-solid"
                  :class="star <= Math.round(productRating.averageRating) ? 'text-yellow-400' : 'text-gray-300'"
                  class="w-6 h-6"
                />
              </div>
              <span class="text-lg font-semibold text-gray-700 dark:text-gray-300">
                {{ productRating.averageRating.toFixed(1) }}
              </span>
              <span class="text-gray-500 dark:text-gray-400">
                ({{ productRating.totalReviews }} отзывов)
              </span>
            </div>

            <!-- Price -->
            <div class="mb-6">
              <span class="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {{ product.price }} ₽
              </span>
            </div>

            <!-- Description -->
            <div class="mb-6">
              <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Описание</h3>
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                {{ product.description }}
              </p>
            </div>

            <!-- Stock -->
            <div class="mb-6">
              <span v-if="product.stock > 0" class="text-green-600 dark:text-green-400 font-semibold">
                ✓ В наличии ({{ product.stock }} шт.)
              </span>
              <span v-else class="text-red-600 dark:text-red-400 font-semibold">
                ✗ Нет в наличии
              </span>
            </div>

            <!-- Add to Cart -->
            <UButton
              v-if="!isInCart"
              @click="handleAddToCart"
              :disabled="product.stock === 0 || addingToCart"
              size="xl"
              block
              class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <span v-if="addingToCart">Добавление...</span>
              <span v-else>Добавить в корзину</span>
            </UButton>
            <UButton
              v-else
              to="/cart"
              size="xl"
              block
              class="bg-green-600 hover:bg-green-700 text-white"
            >
              В корзине ✓
            </UButton>
          </div>
        </div>

        <!-- Reviews Section -->
        <ReviewList :product-id="product.id" @rating-updated="fetchRating" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const { apiFetch } = useApi();
const cartStore = useCartStore();
const { loadFavorites, toggleFavorite, isFavorite } = useFavorites();
const toast = useToast();

const productId = computed(() => Number(route.params.id));
const addingToCart = ref(false);
const product = ref<any>(null);
const pending = ref(true);
const error = ref<Error | null>(null);

// Fetch product rating
const productRating = ref<any>(null);

const fetchRating = async () => {
  try {
    productRating.value = await apiFetch<any>(`/reviews/product/${productId.value}/rating`);
  } catch (err) {
    console.error('Failed to fetch rating:', err);
  }
};

const isInCart = computed(() => {
  return cartStore.items.some(item => item.productId === productId.value);
});

// Fetch product on mount
onMounted(async () => {
  try {
    product.value = await apiFetch<any>(`/products/${productId.value}`);
    await fetchRating();
    await cartStore.fetchCart();
  } catch (err) {
    console.error('Failed to fetch product:', err);
    error.value = err as Error;
  } finally {
    pending.value = false;
  }

  // Загружаем избранное независимо (не блокирует отображение товара)
  loadFavorites();
});

// Add to cart handler
const handleAddToCart = async () => {
  if (!product.value) return;
  
  addingToCart.value = true;
  try {
    await cartStore.addItem(product.value.id, 1);
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
  } finally {
    addingToCart.value = false;
  }
};

// SEO
useHead({
  title: product.value?.title || 'Товар',
  meta: [
    { name: 'description', content: product.value?.description || '' },
  ],
});
</script>
