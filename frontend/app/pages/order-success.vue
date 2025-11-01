<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center py-12 px-4"
  >
    <div class="max-w-2xl w-full">
      <UCard class="text-center">
        <div class="py-8">
          <!-- Иконка успеха -->
          <div
            class="inline-block p-4 bg-gradient-to-r from-green-400 to-green-600 rounded-full mb-6"
          >
            <UIcon
              name="i-heroicons-check-circle"
              class="w-16 h-16 text-white"
            />
          </div>

          <h1
            class="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"
          >
            Заказ успешно оформлен!
          </h1>

          <p class="text-gray-600 dark:text-gray-300 text-lg mb-8">
            Спасибо за покупку! Мы отправили подтверждение на вашу почту.
          </p>

          <div
            v-if="orderId"
            class="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 mb-8"
          >
            <p class="text-gray-600 dark:text-gray-300 mb-2">Номер заказа:</p>
            <p
              class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
            >
              #{{ orderId }}
            </p>
          </div>

          <div v-if="loading" class="space-y-4">
            <USkeleton class="h-24" />
            <USkeleton class="h-32" />
          </div>

          <div
            v-else-if="order"
            class="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 text-left"
          >
            <h3 class="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
              Детали заказа
            </h3>

            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-300">Статус:</span>
                <span class="font-semibold text-blue-600">{{
                  getStatusLabel(order.status)
                }}</span>
              </div>

              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-300"
                  >Сумма заказа:</span
                >
                <span class="font-semibold"
                  >{{ Number(order.totalAmount).toFixed(2) }} ₽</span
                >
              </div>

              <div v-if="order.paymentMethod" class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-300"
                  >Способ оплаты:</span
                >
                <span class="font-semibold">{{
                  getPaymentMethodLabel(order.paymentMethod)
                }}</span>
              </div>

              <div v-if="order.shippingAddress" class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-300"
                  >Адрес доставки:</span
                >
                <span class="font-semibold text-right max-w-xs">{{
                  order.shippingAddress
                }}</span>
              </div>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UButton
              to="/orders"
              size="lg"
              class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              Мои заказы
            </UButton>

            <UButton to="/" size="lg" variant="outline">
              Продолжить покупки
            </UButton>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
  layout: false,
});

const route = useRoute();
const { apiFetch } = useApi();

const orderId = ref<string | null>(null);
const order = ref<any>(null);
const loading = ref(false);

onMounted(async () => {
  orderId.value = route.query.orderId as string;

  if (orderId.value) {
    // Добавляем таймаут на случай зависания
    const timeoutId = setTimeout(() => {
      if (loading.value) {
        console.warn("Order fetch timeout");
        loading.value = false;
      }
    }, 5000); // 5 секунд

    await fetchOrder();
    clearTimeout(timeoutId);
  }
});

const fetchOrder = async () => {
  if (!orderId.value) return;

  loading.value = true;
  try {
    order.value = await apiFetch<any>(`/orders/${orderId.value}`);
    console.log("Order loaded:", order.value);
  } catch (error) {
    console.error("Failed to fetch order:", error);
    // Не показываем ошибку пользователю, просто не отображаем детали
    order.value = null;
  } finally {
    loading.value = false;
  }
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: "Ожидает обработки",
    processing: "В обработке",
    shipped: "Отправлен",
    delivered: "Доставлен",
    cancelled: "Отменен",
  };
  return labels[status] || status;
};

const getPaymentMethodLabel = (method: string) => {
  const labels: Record<string, string> = {
    card: "Банковская карта",
    cash: "Наличными при получении",
    online: "Электронный кошелек",
  };
  return labels[method] || method;
};
</script>
