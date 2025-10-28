<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
        🛒 Корзина
      </h1>

      <div v-if="cartStore.loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        <p class="mt-4 text-gray-600 dark:text-gray-300">Загрузка...</p>
      </div>

      <div v-else-if="cartStore.items.length === 0" class="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
        <UIcon name="i-heroicons-shopping-cart" class="w-24 h-24 mx-auto text-gray-400 mb-4" />
        <p class="text-gray-600 dark:text-gray-300 mb-6 text-lg">Ваша корзина пуста</p>
        <UButton 
          to="/"
          size="lg"
          class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          Перейти к покупкам
        </UButton>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-4">
          <UCard 
            v-for="item in cartStore.items" 
            :key="item.id"
            class="hover:shadow-lg transition-shadow"
          >
            <div class="flex gap-4">
              <div class="relative overflow-hidden rounded-lg">
                <img
                  v-if="item.product.imageUrl"
                  :src="item.product.imageUrl"
                  :alt="item.product.name"
                  class="w-24 h-24 object-cover"
                />
                <div v-else class="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center rounded-lg">
                  <UIcon name="i-heroicons-photo" class="w-8 h-8 text-gray-400" />
                </div>
              </div>

              <div class="flex-1">
                <h3 class="font-semibold text-lg text-gray-800 dark:text-gray-100">{{ item.product.name }}</h3>
                <p class="text-gray-600 dark:text-gray-300">{{ item.product.price }} ₽</p>

                <div class="flex items-center gap-3 mt-3">
                  <UButton
                    size="sm"
                    @click="updateQuantity(item.id, item.quantity - 1)"
                    :disabled="item.quantity <= 1"
                    variant="outline"
                  >
                    -
                  </UButton>
                  <span class="font-semibold text-lg">{{ item.quantity }}</span>
                  <UButton
                    size="sm"
                    @click="updateQuantity(item.id, item.quantity + 1)"
                    variant="outline"
                  >
                    +
                  </UButton>
                </div>
              </div>

              <div class="text-right">
                <p class="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  {{ (item.product.price * item.quantity).toFixed(2) }} ₽
                </p>
                <UButton
                  color="error"
                  variant="ghost"
                  size="sm"
                  @click="removeItem(item.id)"
                  class="mt-2"
                >
                  Удалить
                </UButton>
              </div>
            </div>
          </UCard>
        </div>

        <div>
          <UCard class="sticky top-4">
            <template #header>
              <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Итого</h2>
            </template>

            <div class="space-y-3">
              <div class="flex justify-between text-gray-600 dark:text-gray-300">
                <span>Товаров ({{ cartStore.totalItems }})</span>
                <span>{{ cartStore.totalPrice.toFixed(2) }} ₽</span>
              </div>
              <div class="border-t border-gray-200 pt-3"></div>
              <div class="flex justify-between font-bold text-2xl">
                <span>Всего</span>
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  {{ cartStore.totalPrice.toFixed(2) }} ₽
                </span>
              </div>
            </div>

            <template #footer>
              <UButton 
                block 
                @click="checkout"
                size="lg"
                class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Оформить заказ
              </UButton>
            </template>
          </UCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});

const cartStore = useCartStore();
const router = useRouter();

onMounted(() => {
  cartStore.fetchCart();
});

const updateQuantity = async (itemId: number, quantity: number) => {
  await cartStore.updateQuantity(itemId, quantity);
};

const removeItem = async (itemId: number) => {
  await cartStore.removeItem(itemId);
};

const checkout = () => {
  router.push("/checkout");
};
</script>
