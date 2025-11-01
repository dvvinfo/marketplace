<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <div class="container mx-auto px-4 py-8">
      <!-- Заголовок и поиск -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
          Каталог товаров
        </h1>
        
        <!-- Поиск -->
        <div class="max-w-2xl">
          <UInput
            v-model="searchQuery"
            placeholder="Поиск товаров..."
            size="xl"
            icon="i-heroicons-magnifying-glass"
            @input="onSearchInput"
            class="w-full"
            color="secondary"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Фильтры (Sidebar) -->
        <div class="lg:col-span-1">
          <ProductFilters
            v-model:selectedCategory="selectedCategory"
            v-model:minPrice="minPrice"
            v-model:maxPrice="maxPrice"
            :categories="categories"
            :loading="categoriesLoading"
            @apply="applyFilters"
            @reset="resetFilters"
          />
        </div>

        <!-- Список товаров -->
        <div class="lg:col-span-3">
          <!-- Сортировка и количество -->
          <div class="flex justify-between items-center mb-6">
            <p class="text-gray-600 dark:text-gray-300">
              Найдено товаров: <span class="font-semibold">{{ totalProducts }}</span>
            </p>
            <ProductSort v-model="sortBy" />
          </div>

          <!-- Загрузка -->
          <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <USkeleton v-for="i in 6" :key="i" class="h-96" />
          </div>

          <!-- Пустой результат -->
          <div v-else-if="!products || products.length === 0" class="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
            <UIcon name="i-heroicons-shopping-bag" class="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p class="text-gray-600 dark:text-gray-300 text-lg">Товары не найдены</p>
            <UButton @click="resetFilters" class="mt-4" variant="outline">
              Сбросить фильтры
            </UButton>
          </div>

          <!-- Сетка товаров -->
          <div v-else>
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <UCard
                v-for="product in products"
                :key="product.id"
                class="hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              >
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
                        <UIcon name="i-heroicons-photo" class="w-16 h-16 text-gray-400" />
                      </div>
                    </div>
                  </NuxtLink>
                </template>

                <NuxtLink :to="`/products/${product.id}`">
                  <h3 class="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100 hover:text-purple-600 transition-colors">
                    {{ product.title }}
                  </h3>
                </NuxtLink>
                <p class="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                  {{ product.description }}
                </p>
                <div class="flex justify-between items-center">
                  <span class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
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

            <!-- Пагинация -->
            <div v-if="totalPages > 1" class="mt-8 flex justify-center">
              <UPagination
                v-model="currentPage"
                :total="totalProducts"
                :page-count="pageSize"
                :max="5"
                show-first
                show-last
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { apiFetch } = useApi();
const cartStore = useCartStore();
const toast = useToast();
const route = useRoute();
const router = useRouter();

// Состояние
const products = ref<any[]>([]);
const categories = ref<any[]>([]);
const loading = ref(false);
const categoriesLoading = ref(false);
const addingToCart = ref<Record<number, boolean>>({});

// Фильтры
const searchQuery = ref('');
const selectedCategory = ref<number | null>(null);
const minPrice = ref<number | null>(null);
const maxPrice = ref<number | null>(null);
const sortBy = ref('default');

// Пагинация
const currentPage = ref(1);
const pageSize = ref(12);
const totalProducts = ref(0);
const totalPages = computed(() => Math.ceil(totalProducts.value / pageSize.value));

// Debounce для поиска
let searchTimeout: NodeJS.Timeout;

onMounted(async () => {
  // Загружаем категории
  await fetchCategories();
  
  // Загружаем корзину
  await cartStore.fetchCart();
  
  // Загружаем товары
  await fetchProducts();
});

// Следим за изменением страницы
watch(currentPage, () => {
  fetchProducts();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Следим за изменением сортировки
watch(sortBy, () => {
  currentPage.value = 1;
  fetchProducts();
});

const fetchCategories = async () => {
  categoriesLoading.value = true;
  try {
    const data = await apiFetch<any[]>('/categories');
    categories.value = data;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  } finally {
    categoriesLoading.value = false;
  }
};

const fetchProducts = async () => {
  loading.value = true;
  
  // Минимальная задержка для демонстрации skeleton loaders
  const minLoadingTime = 500; // 500ms
  const startTime = Date.now();
  
  try {
    const url = '/products/search';
    const params = new URLSearchParams();

    // Поиск
    if (searchQuery.value.trim()) {
      params.append('search', searchQuery.value.trim());
    }

    // Категория
    if (selectedCategory.value) {
      params.append('categoryId', selectedCategory.value.toString());
    }

    // Цена
    if (minPrice.value !== null) {
      params.append('minPrice', minPrice.value.toString());
    }
    if (maxPrice.value !== null) {
      params.append('maxPrice', maxPrice.value.toString());
    }

    // Сортировка
    if (sortBy.value !== 'default') {
      const sortMapping: Record<string, { sortBy: string; sortOrder: string }> = {
        'price_asc': { sortBy: 'price', sortOrder: 'ASC' },
        'price_desc': { sortBy: 'price', sortOrder: 'DESC' },
        'name_asc': { sortBy: 'title', sortOrder: 'ASC' },
        'name_desc': { sortBy: 'title', sortOrder: 'DESC' },
        'newest': { sortBy: 'createdAt', sortOrder: 'DESC' },
        'popular': { sortBy: 'createdAt', sortOrder: 'DESC' }, // Пока нет рейтинга
      };
      
      const sort = sortMapping[sortBy.value];
      if (sort) {
        params.append('sortBy', sort.sortBy);
        params.append('sortOrder', sort.sortOrder);
      }
    }

    // Пагинация
    params.append('page', currentPage.value.toString());
    params.append('limit', pageSize.value.toString());

    const queryString = params.toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;

    const data = await apiFetch<any>(fullUrl);
    
    // API возвращает объект с пагинацией
    products.value = data.products || [];
    totalProducts.value = data.total || 0;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    toast.add({
      title: 'Ошибка',
      description: 'Не удалось загрузить товары',
      color: 'error',
    });
  } finally {
    // Гарантируем минимальное время показа skeleton loaders
    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
    
    if (remainingTime > 0) {
      await new Promise(resolve => setTimeout(resolve, remainingTime));
    }
    
    loading.value = false;
  }
};

const onSearchInput = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentPage.value = 1;
    fetchProducts();
  }, 500);
};

const applyFilters = () => {
  currentPage.value = 1;
  fetchProducts();
};

const resetFilters = () => {
  searchQuery.value = '';
  selectedCategory.value = null;
  minPrice.value = null;
  maxPrice.value = null;
  sortBy.value = 'default';
  currentPage.value = 1;
  fetchProducts();
};

const isInCart = (productId: number) => {
  return cartStore.items.some(item => item.productId === productId);
};

const addToCart = async (productId: number) => {
  if (addingToCart.value[productId]) return;
  
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
