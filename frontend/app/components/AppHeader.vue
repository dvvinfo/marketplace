<template>
  <header
    class="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-800 dark:via-purple-800 dark:to-pink-800 shadow-lg"
  >
    <nav class="container mx-auto px-4 py-4">
      <div class="flex justify-between items-center">
        <NuxtLink
          to="/"
          class="text-2xl font-bold text-white hover:text-gray-100 transition-colors"
        >
          🛒 Маркетплейс
        </NuxtLink>

        <div class="flex items-center gap-6">
          <NuxtLink
            to="/"
            class="text-white hover:text-gray-100 font-medium transition-colors"
          >
            Товары
          </NuxtLink>

          <!-- Переключатель темы -->
          <UButton
            @click="toggleTheme"
            variant="ghost"
            class="text-white hover:bg-white/20"
            :icon="colorMode.value === 'dark' ? 'i-heroicons-sun' : 'i-heroicons-moon'"
            square
          />

          <template v-if="isAuthenticated">
            <NuxtLink
              to="/cart"
              class="relative text-white hover:text-gray-100 transition-colors"
            >
              <UIcon name="i-heroicons-shopping-cart" class="w-6 h-6" />
              <span
                v-if="cartStore.totalItems > 0"
                class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg"
              >
                {{ cartStore.totalItems }}
              </span>
            </NuxtLink>

            <UPopover>
              <UButton variant="ghost" class="text-white hover:bg-white/20">
                {{ user?.nameFirst || "Аккаунт" }}
                <UIcon name="i-heroicons-chevron-down" class="w-4 h-4 ml-1" />
              </UButton>

              <template #content>
                <div class="p-2 space-y-1 min-w-[200px]">
                  <UButton
                    variant="ghost"
                    block
                    @click="navigateTo('/profile')"
                    class="justify-start"
                  >
                    <UIcon name="i-heroicons-user" class="w-4 h-4 mr-2" />
                    Профиль
                  </UButton>
                  <UButton
                    variant="ghost"
                    block
                    @click="navigateTo('/orders')"
                    class="justify-start"
                  >
                    <UIcon
                      name="i-heroicons-shopping-bag"
                      class="w-4 h-4 mr-2"
                    />
                    Заказы
                  </UButton>
                  <div class="border-t border-gray-200 my-1"></div>
                  <UButton
                    variant="ghost"
                    block
                    @click="logout"
                    class="justify-start text-red-600 hover:bg-red-50"
                  >
                    <UIcon
                      name="i-heroicons-arrow-right-on-rectangle"
                      class="w-4 h-4 mr-2"
                    />
                    Выйти
                  </UButton>
                </div>
              </template>
            </UPopover>
          </template>

          <template v-else>
            <NuxtLink to="/login">
              <UButton variant="ghost" class="text-white hover:bg-white/20"
                >Войти</UButton
              >
            </NuxtLink>
            <NuxtLink to="/register">
              <UButton class="bg-white text-purple-600 hover:bg-gray-100"
                >Регистрация</UButton
              >
            </NuxtLink>
          </template>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
const { isAuthenticated, user, logout: authLogout, fetchUser } = useAuth();
const cartStore = useCartStore();
const colorMode = useColorMode();

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
};

const logout = async () => {
  // Очищаем локальное состояние корзины без API запроса
  cartStore.items = [];
  await authLogout();
};

onMounted(async () => {
  console.log(
    "AppHeader mounted, isAuthenticated:",
    isAuthenticated.value,
    "user:",
    user.value
  );
  if (isAuthenticated.value) {
    await fetchUser();
    console.log("User after fetch:", user.value);
    cartStore.fetchCart();
  }
});

// Следим за изменением авторизации
watch(isAuthenticated, async (newVal) => {
  console.log("isAuthenticated changed to:", newVal);
  if (newVal) {
    await fetchUser();
    console.log("User after fetch in watch:", user.value);
    cartStore.fetchCart();
  }
});

// Следим за изменением user
watch(
  user,
  (newVal) => {
    console.log("User changed:", newVal);
  },
  { deep: true }
);
</script>
