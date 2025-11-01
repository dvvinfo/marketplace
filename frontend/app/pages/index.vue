<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
  >
    <div class="container mx-auto px-4 py-8">
      <div class="text-center mb-12">
        <h1
          class="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400"
        >
          Каталог товаров
        </h1>
        <p class="text-gray-600 dark:text-gray-300 text-lg">
          Найдите всё, что вам нужно
        </p>
      </div>

      <div v-if="pending" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <USkeleton v-for="i in 8" :key="i" class="h-96" />
      </div>

      <div
        v-else-if="!products || products.length === 0"
        class="text-center py-12"
      >
        <UIcon
          name="i-heroicons-shopping-bag"
          class="w-16 h-16 mx-auto text-gray-400 mb-4"
        />
        <p class="text-gray-600 dark:text-gray-300 text-lg">
          Товары не найдены
        </p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <UCard
          v-for="product in products"
          :key="product.id"
          class="hover:shadow-xl transition-shadow duration-300 cursor-pointer relative"
        >
          <!-- Кнопка избранного -->
          <div class="absolute top-2 -right-1 z-10">
            <UButton
              icon="i-heroicons-heart-solid"
              :color="isFavorite(product.id) ? 'error' : 'neutral'"
              variant="ghost"
              size="lg"
              @click.stop="toggleFavorite(product.id)"
              :title="isFavorite(product.id) ? 'Удалить из избранного' : 'Добавить в избранное'"
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
              @click.stop="addToCart(product.id)"
              :disabled="addingToCart[product.id]"
              class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              {{ addingToCart[product.id] ? 'Добавление...' : 'В корзину' }}
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
  </div>
</template>

<script setup lang="ts">
const { apiFetch } = useApi();
const cartStore = useCartStore();
const { favorites, loadFavorites, toggleFavorite, isFavorite } = useFavorites();
const toast = useToast();

const products = ref<any[]>([]);
const pending = ref(true);
const error = ref<Error | null>(null);
const addingToCart = ref<Record<number, boolean>>({});

// Загружаем товары и корзину при монтировании компонента (только на клиенте)
onMounted(async () => {
  try {
    console.log('Fetching products...');
    const data = await apiFetch<any[]>('/products');
    console.log('Products received:', data);
    products.value = data;
    
    // Загружаем корзину для проверки наличия товаров
    await cartStore.fetchCart();
  } catch (err) {
    console.error('Failed to fetch products:', err);
    error.value = err as Error;
  } finally {
    pending.value = false;
  }

  // Загружаем избранное независимо (не блокирует отображение товаров)
  loadFavorites();
});

const isInCart = (productId: number) => {
  return cartStore.items.some(item => item.productId === productId);
};

const addToCart = async (productId: number) => {
  if (addingToCart.value[productId]) return; // Защита от двойного клика
  
  addingToCart.value[productId] = true;
  
  try {
    await cartStore.addItem(productId, 1);
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
    addingToCart.value[productId] = false;
  }
};
</script>
