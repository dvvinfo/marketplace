<template>
  <UApp>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
      <div class="max-w-2xl w-full">
        <UCard class="text-center">
          <template #header>
            <div class="py-8">
              <!-- Иконка ошибки -->
              <div class="mb-6">
                <UIcon
                  v-if="error.statusCode === 404"
                  name="i-heroicons-magnifying-glass-circle"
                  class="w-24 h-24 mx-auto text-purple-600 dark:text-purple-400"
                />
                <UIcon
                  v-else
                  name="i-heroicons-exclamation-triangle"
                  class="w-24 h-24 mx-auto text-red-600 dark:text-red-400"
                />
              </div>

              <!-- Код ошибки -->
              <h1 class="text-8xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                {{ error.statusCode || 500 }}
              </h1>

              <!-- Заголовок -->
              <h2 class="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                {{ errorTitle }}
              </h2>

              <!-- Описание -->
              <p class="text-lg text-gray-600 dark:text-gray-300 mb-8">
                {{ errorMessage }}
              </p>
            </div>
          </template>

          <!-- Детали ошибки (только в dev режиме) -->
          <div v-if="isDev && error.stack" class="mb-6">
            <UAccordion :items="[{
              label: 'Детали ошибки (dev)',
              icon: 'i-heroicons-code-bracket',
              defaultOpen: false,
              content: error.stack
            }]">
              <template #content="{ item }">
                <pre class="text-left text-xs bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto max-h-64">{{ item.content }}</pre>
              </template>
            </UAccordion>
          </div>

          <template #footer>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <!-- Кнопка "Назад" -->
              <UButton
                v-if="canGoBack"
                @click="goBack"
                size="lg"
                variant="outline"
                icon="i-heroicons-arrow-left"
              >
                Вернуться назад
              </UButton>

              <!-- Кнопка "На главную" -->
              <UButton
                @click="goHome"
                size="lg"
                class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                icon="i-heroicons-home"
              >
                На главную
              </UButton>

              <!-- Кнопка "Обновить" -->
              <UButton
                v-if="error.statusCode !== 404"
                @click="reload"
                size="lg"
                variant="outline"
                icon="i-heroicons-arrow-path"
              >
                Обновить страницу
              </UButton>
            </div>
          </template>
        </UCard>

        <!-- Дополнительная информация -->
        <div class="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Если проблема повторяется, пожалуйста, свяжитесь с поддержкой</p>
        </div>
      </div>
    </div>
  </UApp>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const isDev = process.dev

// Определяем заголовок ошибки
const errorTitle = computed(() => {
  switch (props.error.statusCode) {
    case 404:
      return 'Страница не найдена'
    case 403:
      return 'Доступ запрещён'
    case 401:
      return 'Требуется авторизация'
    case 500:
      return 'Ошибка сервера'
    case 503:
      return 'Сервис недоступен'
    default:
      return 'Произошла ошибка'
  }
})

// Определяем сообщение ошибки
const errorMessage = computed(() => {
  if (props.error.message) {
    return props.error.message
  }

  switch (props.error.statusCode) {
    case 404:
      return 'К сожалению, запрашиваемая страница не существует или была удалена'
    case 403:
      return 'У вас нет прав для доступа к этой странице'
    case 401:
      return 'Пожалуйста, войдите в систему для доступа к этой странице'
    case 500:
      return 'На сервере произошла ошибка. Мы уже работаем над её устранением'
    case 503:
      return 'Сервис временно недоступен. Попробуйте позже'
    default:
      return 'Что-то пошло не так. Попробуйте обновить страницу'
  }
})

// Проверяем, можно ли вернуться назад
const canGoBack = computed(() => {
  return process.client && window.history.length > 1
})

// Обработчики
const goBack = () => {
  if (process.client) {
    window.history.back()
  }
}

const goHome = () => {
  clearError({ redirect: '/' })
}

const reload = () => {
  if (process.client) {
    window.location.reload()
  }
}

// SEO
useHead({
  title: `${props.error.statusCode} - ${errorTitle.value}`,
})
</script>
