<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
  >
    <!-- Модальное окно оплаты -->
    <PaymentModal
      v-model="showPaymentModal"
      :amount="finalPrice"
      @success="onPaymentSuccess"
      @error="onPaymentError"
    />

    <div class="container mx-auto px-4 py-8">
      <h1
        class="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"
      >
        📦 Оформление заказа
      </h1>

      <div v-if="cartStore.loading || loading" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-6">
          <USkeleton class="h-96" />
          <USkeleton class="h-64" />
        </div>
        <USkeleton class="h-96" />
      </div>

      <div
        v-else-if="cartStore.items.length === 0"
        class="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg"
      >
        <UIcon
          name="i-heroicons-shopping-cart"
          class="w-24 h-24 mx-auto text-gray-400 mb-4"
        />
        <p class="text-gray-600 dark:text-gray-300 mb-6 text-lg">
          Ваша корзина пуста
        </p>
        <UButton
          to="/"
          size="lg"
          class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
        >
          Перейти к покупкам
        </UButton>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Форма оформления -->
        <div class="lg:col-span-2">
          <UCard class="mb-6">
            <template #header>
              <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100">
                Данные доставки
              </h2>
            </template>

            <UForm
              :schema="schema"
              :state="state"
              @submit="onSubmit"
              class="space-y-4"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UFormField label="Имя" name="firstName">
                  <UInput
                    v-model="state.firstName"
                    placeholder="Иван"
                    size="xl"
                    color="secondary"
                    variant="outline"
                    class="w-full"
                  />
                </UFormField>

                <UFormField label="Фамилия" name="lastName">
                  <UInput
                    v-model="state.lastName"
                    placeholder="Иванов"
                    size="xl"
                    color="secondary"
                    variant="outline"
                    class="w-full"
                  />
                </UFormField>
              </div>

              <UFormField label="Телефон" name="phone">
                <UInput
                  v-model="state.phone"
                  placeholder="+7 (999) 123-45-67"
                  size="xl"
                  color="secondary"
                  variant="outline"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="Адрес доставки" name="address">
                <UTextarea
                  v-model="state.address"
                  placeholder="Улица, дом, квартира"
                  size="xl"
                  color="secondary"
                  variant="outline"
                  :rows="5"
                  class="w-full"
                />
              </UFormField>

              <UFormField
                label="Комментарий к заказу (необязательно)"
                name="comment"
              >
                <UTextarea
                  v-model="state.comment"
                  placeholder="Дополнительная информация для курьера"
                  size="xl"
                  color="secondary"
                  variant="outline"
                  :rows="5"
                  class="w-full"
                />
              </UFormField>
            </UForm>
          </UCard>

          <!-- Способ оплаты -->
          <UCard class="mb-6">
            <template #header>
              <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100">
                Способ оплаты
              </h2>
            </template>

            <div class="space-y-3">
              <label
                v-for="method in paymentMethods"
                :key="method.value"
                class="flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-purple-400"
                :class="
                  state.paymentMethod === method.value
                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-700'
                "
              >
                <input
                  type="radio"
                  v-model="state.paymentMethod"
                  :value="method.value"
                  class="w-5 h-5 text-purple-600"
                />
                <div class="ml-3">
                  <p class="font-semibold text-gray-800 dark:text-gray-100">
                    {{ method.label }}
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-300">
                    {{ method.description }}
                  </p>
                </div>
              </label>
            </div>
          </UCard>

          <!-- Промокод -->
          <PromoCodeInput
            v-model="promoCode"
            :discount="discount"
            :loading="promoLoading"
            @apply="applyPromoCode"
            @clear="clearPromoCode"
          />
        </div>

        <!-- Итоговая сумма -->
        <div>
          <UCard class="sticky top-4">
            <template #header>
              <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100">
                Ваш заказ
              </h2>
            </template>

            <div class="space-y-4">
              <!-- Товары -->
              <div class="space-y-3 max-h-64 overflow-y-auto">
                <div
                  v-for="item in cartStore.items"
                  :key="item.id"
                  class="flex justify-between text-sm"
                >
                  <span class="text-gray-600 dark:text-gray-300">
                    {{ getItemName(item) }} × {{ item.quantity }}
                  </span>
                  <span class="font-semibold"
                    >{{
                      (getItemPrice(item) * item.quantity).toFixed(2)
                    }}
                    ₽</span
                  >
                </div>
              </div>

              <div class="border-t border-gray-200 pt-3"></div>

              <!-- Подытог -->
              <div
                class="flex justify-between text-gray-600 dark:text-gray-300"
              >
                <span>Подытог</span>
                <span>{{ cartStore.totalPrice.toFixed(2) }} ₽</span>
              </div>

              <!-- Скидка -->
              <div
                v-if="discount > 0"
                class="flex justify-between text-green-600"
              >
                <span>Скидка ({{ promoCode }})</span>
                <span>-{{ discountAmount.toFixed(2) }} ₽</span>
              </div>

              <!-- Доставка -->
              <div
                class="flex justify-between text-gray-600 dark:text-gray-300"
              >
                <span>Доставка</span>
                <span>{{ deliveryPrice.toFixed(2) }} ₽</span>
              </div>

              <div class="border-t border-gray-200 pt-3"></div>

              <!-- Итого -->
              <div class="flex justify-between font-bold text-2xl">
                <span>Итого</span>
                <span
                  class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  {{ finalPrice.toFixed(2) }} ₽
                </span>
              </div>
            </div>

            <template #footer>
              <div
                v-if="error"
                class="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm"
              >
                {{ error }}
              </div>

              <UButton
                block
                @click="onSubmit"
                :loading="submitting"
                :disabled="!isFormValid"
                size="lg"
                class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
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
import { z } from "zod";

definePageMeta({
  middleware: "auth",
});

const { apiFetch } = useApi();
const { user } = useAuth();
const cartStore = useCartStore();
const router = useRouter();
const toast = useToast();

const loading = ref(false);
const submitting = ref(false);
const error = ref("");
const promoLoading = ref(false);
const promoCode = ref("");
const discount = ref(0);
const deliveryPrice = ref(300); // Фиксированная стоимость доставки
const showPaymentModal = ref(false);

const state = reactive({
  firstName: user.value?.nameFirst || "",
  lastName: user.value?.nameLast || "",
  phone: "",
  address: "",
  comment: "",
  paymentMethod: "card",
});

const paymentMethods = [
  {
    value: "card",
    label: "Банковская карта",
    description: "Оплата картой онлайн",
  },
  {
    value: "cash",
    label: "Наличными при получении",
    description: "Оплата курьеру",
  },
  {
    value: "online",
    label: "Электронный кошелек",
    description: "Оплата через электронный кошелек",
  },
];

const schema = z.object({
  firstName: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  lastName: z.string().min(2, "Фамилия должна содержать минимум 2 символа"),
  phone: z.string().min(10, "Введите корректный номер телефона"),
  address: z.string().min(10, "Введите полный адрес доставки"),
  comment: z.string().optional(),
});

const discountAmount = computed(() => {
  return (cartStore.totalPrice * discount.value) / 100;
});

const finalPrice = computed(() => {
  return cartStore.totalPrice - discountAmount.value + deliveryPrice.value;
});

const isFormValid = computed(() => {
  return (
    state.firstName.length >= 2 &&
    state.lastName.length >= 2 &&
    state.phone.length >= 10 &&
    state.address.length >= 10
  );
});

// Вспомогательные функции для работы с разными структурами данных
const getItemName = (item: any) => {
  return item.product?.name || item.product?.title || item.name || "Товар";
};

const getItemPrice = (item: any) => {
  return item.product?.price || item.price || 0;
};

onMounted(async () => {
  await cartStore.fetchCart();
});

const applyPromoCode = async () => {
  if (!promoCode.value.trim()) {
    toast.add({
      title: "Ошибка",
      description: "Введите промокод",
      color: "error",
    });
    return;
  }

  promoLoading.value = true;

  try {
    const response = await apiFetch<any>("/promo-codes/validate", {
      method: "POST",
      body: {
        code: promoCode.value.trim(),
        orderAmount: cartStore.totalPrice,
      },
    });

    if (response.valid) {
      // Вычисляем процент скидки из discountAmount
      const discountPercent =
        (response.discountAmount / cartStore.totalPrice) * 100;
      discount.value = Math.round(discountPercent);

      toast.add({
        title: "Успешно!",
        description: `Промокод применен. Скидка ${discount.value}%`,
        color: "success",
      });
    } else {
      // Переводим сообщение с бэкенда на русский
      let errorMsg = "Промокод недействителен";
      if (response.message === "Invalid promo code") {
        errorMsg = "Неверный промокод";
      } else if (response.message === "Promo code expired") {
        errorMsg = "Промокод истек";
      } else if (response.message === "Promo code not active") {
        errorMsg = "Промокод неактивен";
      } else if (response.message) {
        errorMsg = response.message;
      }
      
      discount.value = 0;
      
      toast.add({
        title: "Промокод не применен",
        description: errorMsg,
        color: "error",
      });
    }
  } catch (err: any) {
    console.error("Promo code validation error:", err);
    
    let errorMessage = "Не удалось проверить промокод";
    if (err.statusCode === 404 || err.status === 404) {
      errorMessage = "Промокод не найден";
    } else if (err.statusCode === 400 || err.status === 400) {
      errorMessage = "Промокод недействителен или истек";
    }
    
    discount.value = 0;
    
    toast.add({
      title: "Ошибка",
      description: errorMessage,
      color: "error",
    });
  } finally {
    promoLoading.value = false;
  }
};

const clearPromoCode = () => {
  promoCode.value = "";
  discount.value = 0;
};

const onSubmit = async () => {
  if (!isFormValid.value) {
    error.value = "Заполните все обязательные поля";
    return;
  }

  // Если выбрана оплата картой, открываем модальное окно
  if (state.paymentMethod === "card") {
    console.log('Opening payment modal, current value:', showPaymentModal.value);
    showPaymentModal.value = true;
    console.log('After setting, value:', showPaymentModal.value);
    return;
  }

  // Для наличных - показываем информацию
  if (state.paymentMethod === "cash") {
    toast.add({
      title: "Оплата наличными",
      description: "Оплатите заказ курьеру при получении",
      color: "info",
    });
  }

  // Для электронного кошелька - показываем информацию
  if (state.paymentMethod === "online") {
    toast.add({
      title: "Электронный кошелек",
      description: "Ссылка на оплату будет отправлена на вашу почту",
      color: "info",
    });
  }

  // Для других способов оплаты создаем заказ сразу
  await createOrder();
};

const onPaymentSuccess = async () => {
  // После успешной оплаты создаем заказ
  await createOrder();
};

const onPaymentError = (message: string) => {
  toast.add({
    title: "Ошибка оплаты",
    description: message,
    color: "error",
  });
};

const createOrder = async () => {
  submitting.value = true;
  error.value = "";

  try {
    // Создаем заказ
    const orderData = {
      userId: user.value?.id,
      items: cartStore.items.map((item) => ({
        productId: item.productId || item.product?.id,
        quantity: item.quantity,
      })),
      shippingAddress: state.address,
      phone: state.phone,
      notes: state.comment || undefined,
    };

    const order = await apiFetch<any>("/orders", {
      method: "POST",
      body: orderData,
    });

    // Очищаем корзину
    await cartStore.clearCart();

    // Переходим на страницу успеха
    await router.push(`/order-success?orderId=${order.id}`);

    toast.add({
      title: "Успешно!",
      description: "Заказ успешно оформлен",
      color: "success",
    });
  } catch (err: any) {
    console.error("Failed to create order:", err);
    
    let errorMessage = "Не удалось оформить заказ. Попробуйте снова";
    if (err.statusCode === 400 || err.status === 400) {
      errorMessage = "Пожалуйста, проверьте правильность заполнения всех полей";
    } else if (err.statusCode === 401 || err.status === 401) {
      errorMessage = "Сессия истекла. Пожалуйста, войдите снова";
    } else if (err.statusCode === 404 || err.status === 404) {
      errorMessage = "Некоторые товары больше недоступны";
    } else if (err.statusCode === 409 || err.status === 409) {
      errorMessage = "Недостаточно товара на складе";
    }
    
    error.value = errorMessage;
    toast.add({
      title: "Ошибка",
      description: errorMessage,
      color: "error",
    });
  } finally {
    submitting.value = false;
  }
};
</script>
