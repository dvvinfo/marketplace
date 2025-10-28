<template>
  <div>
    <NuxtRouteAnnouncer />
    <AppHeader />
    <NuxtPage />
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
const { fetchUser, isAuthenticated } = useAuth()

onMounted(() => {
  if (isAuthenticated.value) {
    fetchUser()
  }
})
</script>
