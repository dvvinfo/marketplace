<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
  >
    <div class="container mx-auto px-4 py-8">
      <h1
        class="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"
      >
        👤 Мой профиль
      </h1>

      <ClientOnly>
        <div v-if="loading" class="text-center py-12">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"
          ></div>
          <p class="mt-4 text-gray-600 dark:text-gray-300">Загрузка...</p>
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Боковое меню -->
        <div class="lg:col-span-1">
          <UCard>
            <div class="text-center mb-6">
              <!-- Аватар -->
              <AvatarUpload
                v-model="avatarUrl"
                :user-id="user?.id"
                :user-name="`${user?.nameFirst} ${user?.nameLast}`"
                class="mb-4"
              />
              
              <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100">
                {{ user?.nameFirst }} {{ user?.nameLast }}
              </h2>
              <p class="text-gray-600 dark:text-gray-300 text-sm">
                {{ user?.email }}
              </p>
            </div>

            <div class="space-y-2">
              <button
                v-for="tab in tabs"
                :key="tab.value"
                @click="activeTab = tab.value"
                class="w-full text-left px-4 py-3 rounded-xl transition-all"
                :class="
                  activeTab === tab.value
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-semibold'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                "
              >
                <UIcon :name="tab.icon" class="w-5 h-5 inline mr-2" />
                {{ tab.label }}
              </button>
            </div>

            <template #footer>
              <UButton
                block
                @click="handleLogout"
                color="red"
                variant="soft"
                size="lg"
              >
                <UIcon name="i-heroicons-arrow-right-on-rectangle" class="w-5 h-5 mr-2" />
                Выйти
              </UButton>
            </template>
          </UCard>

          <!-- Статистика -->
          <UCard class="mt-6">
            <template #header>
              <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100">
                📊 Статистика
              </h3>
            </template>

            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-gray-600 dark:text-gray-300">Заказов</span>
                <span class="font-bold text-xl text-purple-600">
                  {{ stats.ordersCount }}
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600 dark:text-gray-300">Потрачено</span>
                <span class="font-bold text-xl text-green-600">
                  {{ stats.totalSpent.toFixed(2) }} ₽
                </span>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Основной контент -->
        <div class="lg:col-span-2">
          <!-- Редактирование профиля -->
          <ProfileForm
            v-if="activeTab === 'profile'"
            :user="user"
            :avatar="avatarUrl"
            @update="handleProfileUpdate"
          />

          <!-- Смена пароля -->
          <PasswordChangeForm
            v-if="activeTab === 'password'"
            @success="handlePasswordChange"
          />

          <!-- Адреса доставки -->
          <AddressManager
            v-if="activeTab === 'addresses'"
            :user-id="user?.id"
          />
        </div>
      </div>
      
      <template #fallback>
        <div class="text-center py-12">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"
          ></div>
          <p class="mt-4 text-gray-600 dark:text-gray-300">Загрузка профиля...</p>
        </div>
      </template>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});

const { user, logout, fetchUser } = useAuth();
const { apiFetch } = useApi();
const toast = useToast();

const loading = ref(false);
const activeTab = ref("profile");
const avatarUrl = ref(user.value?.avatar || null);
const stats = ref({
  ordersCount: 0,
  totalSpent: 0,
});

const tabs = [
  {
    value: "profile",
    label: "Профиль",
    icon: "i-heroicons-user",
  },
  {
    value: "password",
    label: "Пароль",
    icon: "i-heroicons-lock-closed",
  },
  {
    value: "addresses",
    label: "Адреса",
    icon: "i-heroicons-map-pin",
  },
];

onMounted(async () => {
  await loadStats();
});

const loadStats = async () => {
  if (!user.value?.id) return;

  try {
    const orders = await apiFetch<any[]>(`/orders/user/${user.value.id}`);
    stats.value.ordersCount = orders.length;
    stats.value.totalSpent = orders.reduce(
      (sum, order) => sum + (order.totalPrice || 0),
      0
    );
  } catch (error) {
    console.error("Failed to load stats:", error);
  }
};

const handleProfileUpdate = async () => {
  console.log('handleProfileUpdate: before fetchUser, user:', user.value);
  
  // Обновляем данные пользователя из API
  await fetchUser();
  
  console.log('handleProfileUpdate: after fetchUser, user:', user.value);
  
  // Обновляем аватар из свежих данных
  avatarUrl.value = user.value?.avatar || null;
  
  toast.add({
    title: "Успешно!",
    description: "Профиль обновлен",
    color: "success",
  });
};

const handlePasswordChange = () => {
  toast.add({
    title: "Успешно!",
    description: "Пароль изменен",
    color: "success",
  });
};

const handleAvatarUpdate = async () => {
  await fetchUser();
  avatarUrl.value = user.value?.avatar || null;
};

const handleLogout = async () => {
  await logout();
};

// Обновляем аватар при изменении user
watch(
  () => user.value?.avatar,
  (newAvatar) => {
    avatarUrl.value = newAvatar || null;
  }
);
</script>
