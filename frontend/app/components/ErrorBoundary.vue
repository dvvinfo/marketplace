<template>
  <div>
    <!-- Если есть ошибка, показываем fallback -->
    <div v-if="hasError">
      <slot name="error" :error="error" :retry="retry" :reset="reset">
        <!-- Дефолтный fallback UI -->
        <UCard class="border-2 border-red-200 dark:border-red-800">
          <div class="text-center py-8">
            <UIcon
              name="i-heroicons-exclamation-triangle"
              class="w-16 h-16 mx-auto text-red-600 dark:text-red-400 mb-4"
            />
            <h3 class="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">
              Произошла ошибка
            </h3>
            <p class="text-gray-600 dark:text-gray-300 mb-6">
              {{ error?.message || 'Что-то пошло не так' }}
            </p>
            <div class="flex gap-4 justify-center">
              <UButton @click="retry" variant="outline">
                Попробовать снова
              </UButton>
              <UButton @click="reset" color="red">
                Сбросить
              </UButton>
            </div>
          </div>
        </UCard>
      </slot>
    </div>

    <!-- Если ошибки нет, показываем контент -->
    <slot v-else />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  // Функция для повторной попытки загрузки
  onRetry?: () => Promise<void> | void
  // Показывать ли детали ошибки
  showDetails?: boolean
}>()

const hasError = ref(false)
const error = ref<Error | null>(null)

// Перехватываем ошибки в дочерних компонентах
onErrorCaptured((err, instance, info) => {
  console.error('ErrorBoundary caught error:', err, info)
  
  hasError.value = true
  error.value = err as Error

  // Предотвращаем всплытие ошибки дальше
  return false
})

// Повторная попытка
const retry = async () => {
  hasError.value = false
  error.value = null

  if (props.onRetry) {
    try {
      await props.onRetry()
    } catch (err) {
      hasError.value = true
      error.value = err as Error
    }
  }
}

// Сброс состояния ошибки
const reset = () => {
  hasError.value = false
  error.value = null
}

// Экспортируем методы для внешнего использования
defineExpose({
  retry,
  reset,
  hasError: readonly(hasError),
  error: readonly(error),
})
</script>
