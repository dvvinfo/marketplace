<template>
  <UCard>
    <template #header>
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100">
        Смена пароля
      </h2>
    </template>

    <UForm :schema="schema" :state="state" @submit="onSubmit" class="space-y-4">
      <UFormField label="Текущий пароль" name="currentPassword">
        <UInput
          v-model="state.currentPassword"
          type="password"
          placeholder="••••••••"
          size="xl"
          color="secondary"
          variant="outline"
          class="w-full"
        />
      </UFormField>

      <UFormField label="Новый пароль" name="newPassword">
        <UInput
          v-model="state.newPassword"
          type="password"
          placeholder="••••••••"
          size="xl"
          color="secondary"
          variant="outline"
          class="w-full"
        />
      </UFormField>

      <UFormField label="Подтвердите новый пароль" name="confirmPassword">
        <UInput
          v-model="state.confirmPassword"
          type="password"
          placeholder="••••••••"
          size="xl"
          color="secondary"
          variant="outline"
          class="w-full"
        />
      </UFormField>

      <div class="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl text-sm">
        <div class="flex items-start gap-2">
          <UIcon name="i-heroicons-information-circle" class="w-5 h-5 mt-0.5" />
          <div>
            <p class="font-semibold mb-1">Требования к паролю:</p>
            <ul class="list-disc list-inside space-y-1">
              <li>Минимум 6 символов</li>
              <li>Рекомендуется использовать буквы и цифры</li>
            </ul>
          </div>
        </div>
      </div>

      <div
        v-if="error"
        class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm"
      >
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-exclamation-circle" class="w-5 h-5" />
          {{ error }}
        </div>
      </div>

      <div
        v-if="success"
        class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm"
      >
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-check-circle" class="w-5 h-5" />
          {{ success }}
        </div>
      </div>

      <UButton
        type="submit"
        block
        :loading="loading"
        size="xl"
        class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
      >
        Изменить пароль
      </UButton>
    </UForm>
  </UCard>
</template>

<script setup lang="ts">
import { z } from "zod";

const emit = defineEmits<{
  success: [];
}>();

const { apiFetch } = useApi();

const state = reactive({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const loading = ref(false);
const error = ref("");
const success = ref("");

const schema = z
  .object({
    currentPassword: z
      .string()
      .min(6, "Пароль должен содержать минимум 6 символов"),
    newPassword: z
      .string()
      .min(6, "Пароль должен содержать минимум 6 символов"),
    confirmPassword: z
      .string()
      .min(6, "Пароль должен содержать минимум 6 символов"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

type Schema = z.output<typeof schema>;

async function onSubmit(event: { data: Schema }) {
  loading.value = true;
  error.value = "";
  success.value = "";

  try {
    await apiFetch("/auth/change-password", {
      method: "PUT",
      body: {
        oldPassword: event.data.currentPassword,
        newPassword: event.data.newPassword,
      },
    });

    success.value = "Пароль успешно изменен";
    
    // Очищаем форму
    state.currentPassword = "";
    state.newPassword = "";
    state.confirmPassword = "";

    emit("success");
  } catch (err: any) {
    console.error("Password change error:", err);
    
    // Показываем понятное сообщение пользователю
    if (err.statusCode === 400 || err.status === 400) {
      error.value = "Неверный текущий пароль";
    } else if (err.statusCode === 401 || err.status === 401) {
      error.value = "Сессия истекла. Пожалуйста, войдите снова";
    } else {
      error.value = "Не удалось изменить пароль. Попробуйте позже";
    }
  } finally {
    loading.value = false;
  }
}
</script>
