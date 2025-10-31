<template>
  <!-- Используем Teleport для создания модального окна -->
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <!-- Overlay (затемненный фон) -->
      <div
        class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        @click="close"
      ></div>

      <!-- Modal content -->
      <div class="relative z-10 w-full max-w-2xl">
        <UCard class="bg-white dark:bg-gray-800 shadow-2xl">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-100">
                Оплата картой
              </h3>
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-heroicons-x-mark"
                @click="close"
              />
            </div>
          </template>

          <div class="space-y-4">
            <div
              class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-4"
            >
              <p class="text-sm text-blue-700 dark:text-blue-400">
                <strong>Тестовый режим:</strong> Используйте любые данные для
                имитации оплаты
              </p>
            </div>

            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Номер карты <span class="text-red-500">*</span>
              </label>
              <UInput
                v-model="cardNumber"
                placeholder="1234 5678 9012 3456"
                size="xl"
                maxlength="19"
                @input="formatCardNumber"
                color="secondary"
                variant="outline"
                class="w-full"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Срок действия <span class="text-red-500">*</span>
                </label>
                <UInput
                  v-model="expiry"
                  placeholder="MM/YY"
                  size="xl"
                  maxlength="5"
                  @input="formatExpiry"
                  color="secondary"
                  variant="outline"
                  class="w-full"
                />
              </div>

              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  CVV <span class="text-red-500">*</span>
                </label>
                <UInput
                  v-model="cvv"
                  type="password"
                  placeholder="123"
                  size="xl"
                  maxlength="3"
                  color="secondary"
                  variant="outline"
                  class="w-full"
                />
              </div>
            </div>

            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Имя на карте <span class="text-red-500">*</span>
              </label>
              <UInput
                v-model="cardHolder"
                placeholder="IVAN IVANOV"
                size="xl"
                color="secondary"
                variant="outline"
                class="w-full"
              />
            </div>

            <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div class="flex justify-between items-center mb-4">
                <span class="text-gray-600 dark:text-gray-300">К оплате:</span>
                <span
                  class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  {{ amount.toFixed(2) }} ₽
                </span>
              </div>
            </div>
          </div>

          <template #footer>
            <div class="flex gap-3">
              <UButton
                color="secondary"
                variant="outline"
                block
                @click="close"
                size="xl"
              >
                Отмена
              </UButton>
              <UButton
                block
                @click="processPayment"
                :loading="processing"
                :disabled="!isFormValid"
                size="xl"
                class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                Оплатить
              </UButton>
            </div>
          </template>
        </UCard>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean;
  amount: number;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  success: [];
  error: [message: string];
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

// Отладка
watch(
  () => props.modelValue,
  (newVal) => {
    console.log("PaymentModal modelValue changed:", newVal);
  }
);

watch(isOpen, (newVal) => {
  console.log("PaymentModal isOpen changed:", newVal);
});

const cardNumber = ref("");
const expiry = ref("");
const cvv = ref("");
const cardHolder = ref("");
const processing = ref(false);

const isFormValid = computed(() => {
  return (
    cardNumber.value.replace(/\s/g, "").length >= 13 &&
    expiry.value.length === 5 &&
    cvv.value.length === 3 &&
    cardHolder.value.trim().length > 0
  );
});

const formatCardNumber = () => {
  let value = cardNumber.value.replace(/\s/g, "");
  let formatted = "";
  for (let i = 0; i < value.length; i++) {
    if (i > 0 && i % 4 === 0) {
      formatted += " ";
    }
    formatted += value[i];
  }
  cardNumber.value = formatted;
};

const formatExpiry = () => {
  let value = expiry.value.replace(/\D/g, "");
  if (value.length >= 2) {
    value = value.slice(0, 2) + "/" + value.slice(2, 4);
  }
  expiry.value = value;
};

const processPayment = async () => {
  processing.value = true;

  // Имитация обработки платежа (2 секунды)
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Имитация успешной оплаты (в реальном проекте здесь был бы API запрос)
  const success = Math.random() > 0.1; // 90% успеха

  processing.value = false;

  if (success) {
    emit("success");
    close();
  } else {
    emit("error", "Ошибка оплаты. Попробуйте другую карту.");
  }
};

const close = () => {
  isOpen.value = false;
  // Очищаем форму
  cardNumber.value = "";
  expiry.value = "";
  cvv.value = "";
  cardHolder.value = "";
};
</script>
