<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Мои заказы</h1>

    <div v-if="pending" class="space-y-4">
      <USkeleton class="h-32" v-for="i in 3" :key="i" />
    </div>

    <div v-else-if="error" class="text-center py-12">
      <UIcon
        name="i-heroicons-exclamation-triangle"
        class="w-12 h-12 mx-auto text-red-500 mb-4"
      />
      <p class="text-gray-600 dark:text-gray-400">Ошибка загрузки заказов</p>
      <UButton @click="() => refresh()" class="mt-4">Попробовать снова</UButton>
    </div>

    <div v-else-if="!orders || orders.length === 0" class="text-center py-12">
      <UIcon
        name="i-heroicons-shopping-bag"
        class="w-16 h-16 mx-auto text-gray-400 mb-4"
      />
      <p class="text-xl text-gray-600 dark:text-gray-400 mb-4">
        У вас пока нет заказов
      </p>
      <UButton to="/products" color="primary">Перейти к покупкам</UButton>
    </div>

    <div v-else class="space-y-4">
      <OrderCard v-for="order in orders" :key="order.id" :order="order" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Order {
  id: number;
  userId: number;
  createdAt: string;
  status: string;
  totalAmount: number;
  shippingAddress: string;
  phone: string;
}

definePageMeta({
  middleware: "auth",
});

const { user } = useAuth();
const { apiFetch } = useApi();

const orders = ref<Order[]>([]);
const pending = ref(true);
const error = ref(false);

const fetchOrders = async () => {
  if (!user.value?.id) return;

  pending.value = true;
  error.value = false;

  try {
    orders.value = await apiFetch<Order[]>(`/orders/user/${user.value.id}`);
  } catch (err) {
    console.error("Ошибка загрузки заказов:", err);
    error.value = true;
  } finally {
    pending.value = false;
  }
};

const refresh = () => fetchOrders();

onMounted(() => {
  fetchOrders();
});
</script>
