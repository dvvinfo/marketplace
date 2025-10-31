<template>
  <UCard>
    <template #header>
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Промокод</h2>
    </template>

    <div class="space-y-4">
      <div class="flex gap-3">
        <UInput
          v-model="localPromoCode"
          placeholder="Введите промокод"
          size="xl"
          color="neutral"
          variant="outline"
          class="flex-1"
          :disabled="discount > 0"
        />
        
        <UButton
          v-if="discount === 0"
          @click="handleApply"
          :loading="loading"
          :disabled="!localPromoCode.trim()"
          size="xl"
          class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          Применить
        </UButton>
        
        <UButton
          v-else
          @click="handleClear"
          size="xl"
          color="error"
          variant="outline"
        >
          Удалить
        </UButton>
      </div>

      <div v-if="discount > 0" class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
        <div class="flex items-center gap-2 text-green-700 dark:text-green-400">
          <UIcon name="i-heroicons-check-circle" class="w-5 h-5" />
          <span class="font-semibold">Промокод применен! Скидка {{ discount }}%</span>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
  discount: number;
  loading: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
  'apply': [];
  'clear': [];
}>();

const localPromoCode = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const handleApply = () => {
  emit('apply');
};

const handleClear = () => {
  emit('clear');
};
</script>
