<template>
  <UApp>
    <div
      class="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
    >
      <NuxtRouteAnnouncer />
      <AppHeader />
      <NuxtPage />
      <AppFooter />
    </div>
    <UNotifications />
  </UApp>
</template>

<script setup lang="ts">
const { fetchUser, isAuthenticated, user } = useAuth();

// Загружаем пользователя при инициализации приложения
if (process.client && isAuthenticated.value && !user.value) {
  await fetchUser();
}
</script>
