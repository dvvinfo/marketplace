<template>
  <div>
    <NuxtRouteAnnouncer />
    <AppHeader />
    <NuxtPage />
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
const { fetchUser, isAuthenticated, user } = useAuth()

// Загружаем пользователя при инициализации приложения
if (process.client && isAuthenticated.value && !user.value) {
  await fetchUser()
}
</script>
