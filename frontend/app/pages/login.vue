<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div
      class="max-w-md w-full bg-white p-10 rounded-3xl shadow-2xl border border-gray-100"
    >
      <div class="text-center mb-8">
        <div
          class="inline-block p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4"
        >
          <svg
            class="w-12 h-12 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <h2 class="text-3xl font-bold text-gray-900 mb-2">Вход в аккаунт</h2>
        <p class="text-gray-600">Добро пожаловать обратно!</p>
      </div>

      <UForm
        :schema="schema"
        :state="state"
        @submit="onSubmit"
        class="space-y-5"
      >
        <UFormField label="Email" name="email">
          <UInput
            v-model="state.email"
            type="email"
            placeholder="example@mail.com"
            size="xl"
            color="neutral"
            variant="outline"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Пароль" name="password">
          <UInput
            v-model="state.password"
            type="password"
            placeholder="••••••••"
            size="xl"
            color="neutral"
            variant="outline"
            class="w-full"
          />
        </UFormField>

        <div
          v-if="error"
          class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm"
        >
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
            {{ error }}
          </div>
        </div>

        <UButton
          type="submit"
          block
          :loading="loading"
          size="xl"
          color="secondary"
          variant="subtle"
          class="mt-6"
        >
          Войти
        </UButton>

        <div class="text-center pt-4">
          <UButton to="/register" size="xl" color="secondary" variant="link">
            Нет аккаунта? Зарегистрируйтесь
          </UButton>
        </div>
      </UForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from "zod";

definePageMeta({
  middleware: "guest",
  layout: false,
});

const { login } = useAuth();
const router = useRouter();

const state = reactive({
  email: "",
  password: "",
});

const loading = ref(false);
const error = ref("");

// Схема валидации с Zod
const schema = z.object({
  email: z
    .string({ required_error: "Email обязателен" })
    .email("Введите корректный email"),
  password: z
    .string({ required_error: "Пароль обязателен" })
    .min(6, "Пароль должен содержать минимум 6 символов"),
});

type Schema = z.output<typeof schema>;



async function onSubmit(event: { data: Schema }) {
  loading.value = true;
  error.value = "";

  const result = await login(event.data.email, event.data.password);

  if (result.success) {
    router.push("/");
  } else {
    error.value = result.error || "Неверный email или пароль";
  }

  loading.value = false;
}
</script>
