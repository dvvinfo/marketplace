<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="pending" class="space-y-4">
      <USkeleton class="h-8 w-64" />
      <USkeleton class="h-64" />
    </div>

    <div v-else-if="error || !order" class="text-center py-12">
      <UIcon
        name="i-heroicons-exclamation-triangle"
        class="w-12 h-12 mx-auto text-red-500 mb-4"
      />
      <p class="text-gray-600 dark:text-gray-400 mb-4">Заказ не найден</p>
      <UButton to="/orders">Вернуться к заказам</UButton>
    </div>

    <div v-else>
      <div class="flex items-center justify-between mb-6">
        <div>
          <UButton
            to="/orders"
            variant="ghost"
            icon="i-heroicons-arrow-left"
            class="mb-2"
          >
            Назад к заказам
          </UButton>
          <h1 class="text-3xl font-bold">Заказ #{{ order.id }}</h1>
          <p class="text-gray-600 dark:text-gray-400">
            {{ formatDate(order.createdAt) }}
          </p>
        </div>
        <OrderStatus :status="order.status" />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Товары -->
        <div class="lg:col-span-2">
          <UCard>
            <template #header>
              <h2 class="text-xl font-semibold">Товары в заказе</h2>
            </template>

            <div v-if="loadingItems" class="space-y-4">
              <USkeleton class="h-24" v-for="i in 3" :key="i" />
            </div>

            <div v-else-if="items && items.length > 0" class="space-y-4">
              <div
                v-for="item in items"
                :key="item.id"
                class="flex gap-4 pb-4 border-b last:border-b-0"
              >
                <div class="w-20 h-20 flex-shrink-0">
                  <img
                    v-if="item.product?.imageUrl"
                    :src="item.product.imageUrl"
                    :alt="item.product.name || 'Товар'"
                    class="w-full h-full object-cover rounded"
                    @error="(e) => (e.target as HTMLImageElement).style.display = 'none'"
                  />
                  <div
                    v-if="!item.product?.imageUrl"
                    class="w-full h-full bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center"
                  >
                    <UIcon
                      name="i-heroicons-cube"
                      class="w-8 h-8 text-gray-400"
                    />
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <NuxtLink
                    v-if="item.product?.name"
                    :to="`/products/${item.productId}`"
                    class="font-semibold hover:text-primary-500 transition-colors block truncate"
                  >
                    {{ item.product.name }}
                  </NuxtLink>
                  <h3 v-else class="font-semibold">
                    Товар #{{ item.productId }}
                  </h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ item.quantity }} × {{ formatPrice(item.price) }}
                  </p>
                </div>
                <div class="text-right flex-shrink-0">
                  <p class="font-semibold">
                    {{ formatPrice(item.subtotal) }}
                  </p>
                </div>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Информация о заказе -->
        <div class="space-y-4">
          <UCard>
            <template #header>
              <h2 class="text-xl font-semibold">Итого</h2>
            </template>

            <div class="space-y-2">
              <div class="flex justify-between text-xl font-bold">
                <span>Итого:</span>
                <span>{{ formatPrice(order.totalAmount) }}</span>
              </div>
            </div>
          </UCard>

          <UCard>
            <template #header>
              <h2 class="text-xl font-semibold">Доставка</h2>
            </template>

            <div class="space-y-2 text-sm">
              <p class="font-semibold">{{ order.shippingAddress }}</p>
              <p class="text-gray-600 dark:text-gray-400">
                Телефон: {{ order.phone }}
              </p>
            </div>
          </UCard>

          <UCard v-if="order.notes">
            <template #header>
              <h2 class="text-xl font-semibold">Примечания</h2>
            </template>

            <div class="text-sm">
              <p>{{ order.notes }}</p>
            </div>
          </UCard>

          <UButton block @click="repeatOrder" :loading="repeating" class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
            Повторить заказ
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Order {
  id: number;
  userId: number;
  createdAt: string;
  updatedAt?: string;
  status: string;
  totalAmount: number;
  shippingAddress: string;
  phone: string;
  notes?: string;
  items?: OrderItem[];
}

interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  subtotal: number;
  product?: {
    id: number;
    name: string;
    imageUrl?: string;
  };
}

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const { apiFetch } = useApi();

const orderId = computed(() => route.params.id as string);

const order = ref<Order | null>(null);
const pending = ref(true);
const error = ref(false);

const fetchOrder = async () => {
  pending.value = true;
  error.value = false;

  try {
    order.value = await apiFetch<Order>(`/orders/${orderId.value}`);
    console.log("Order loaded:", order.value);
    console.log("Items:", order.value?.items);
  } catch (err) {
    console.error("Ошибка загрузки заказа:", err);
    error.value = true;
  } finally {
    pending.value = false;
  }
};

const items = computed(() => order.value?.items || []);
const loadingItems = pending;

onMounted(() => {
  fetchOrder();
});

const repeating = ref(false);

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
  }).format(price);
};

const repeatOrder = async () => {
  if (!items.value || items.value.length === 0) return;

  repeating.value = true;
  try {
    for (const item of items.value) {
      if (item.productId) {
        await cartStore.addItem(item.productId, item.quantity);
      }
    }
    router.push("/cart");
  } catch (err) {
    console.error("Ошибка при повторении заказа:", err);
  } finally {
    repeating.value = false;
  }
};

definePageMeta({
  middleware: "auth",
});
</script>
