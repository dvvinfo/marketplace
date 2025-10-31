<template>
  <NuxtLink :to="`/orders/${order.id}`">
    <UCard
      class="p-4 sm:p-6 hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <div class="flex items-start justify-between mb-2">
            <div>
              <h3 class="text-lg font-semibold">Заказ #{{ order.id }}</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ formatDate(order.createdAt) }}
              </p>
            </div>
            
          </div>

          <div class="space-y-1 text-sm">
            <p class="text-gray-600 dark:text-gray-400 line-clamp-1">
              {{ order.shippingAddress }}
            </p>
            <p class="text-gray-600 dark:text-gray-400">
              {{ order.phone }}
            </p>
          </div>
        </div>

        <div class="flex flex-col justify-center items-center gap-1">
          <OrderStatus :status="order.status" />
          <p class="text-2xl font-bold">{{ formatPrice(order.totalAmount) }}</p>
        </div>
      </div>
    </UCard>
  </NuxtLink>
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

defineProps<{
  order: Order;
}>();

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
  }).format(price);
};
</script>
