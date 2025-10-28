<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div
      class="max-w-md w-full bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700"
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
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
        </div>
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Регистрация</h2>
        <p class="text-gray-600 dark:text-gray-300">Создайте свой аккаунт</p>
      </div>

      <UForm
        :schema="schema"
        :state="state"
        @submit="onSubmit"
        class="space-y-4"
      >
        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Имя" name="firstName">
            <UInput
              v-model="state.firstName"
              placeholder="Иван"
              size="xl"
              color="neutral"
              variant="outline"
            />
          </UFormField>

          <UFormField label="Фамилия" name="lastName">
            <UInput
              v-model="state.lastName"
              placeholder="Иванов"
              size="xl"
              color="neutral"
              variant="outline"
            />
          </UFormField>
        </div>

        <UFormField label="Email" name="email">
          <UInput
            v-model="state.email"
            type="email"
            placeholder="example@mail.com"
            size="xl"
            class="w-full"
            color="neutral"
            variant="outline"
          />
        </UFormField>

        <UFormField label="Пароль" name="password">
          <UInput
            v-model="state.password"
            type="password"
            placeholder="••••••••"
            size="xl"
            class="w-full"
            color="neutral"
            variant="outline"
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
          class="mt-6"
          variant="subtle"
        >
          Зарегистрироваться
        </UButton>

        <div class="text-center pt-4">
          <UButton to="/login" size="xl" color="secondary" variant="link">
            Уже есть аккаунт? Войдите
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

const { register } = useAuth();
const router = useRouter();

const state = reactive({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
});

const loading = ref(false);
const error = ref("");

// Схема валидации с Zod
const schema = z.object({
  firstName: z
    .string({ required_error: "Имя обязательно" })
    .min(2, "Имя должно содержать минимум 2 символа")
    .max(50, "Имя слишком длинное"),
  lastName: z
    .string({ required_error: "Фамилия обязательна" })
    .min(2, "Фамилия должна содержать минимум 2 символа")
    .max(50, "Фамилия слишком длинная"),
  email: z
    .string({ required_error: "Email обязателен" })
    .email("Введите корректный email"),
  password: z
    .string({ required_error: "Пароль обязателен" })
    .min(6, "Пароль должен содержать минимум 6 символов")
    .max(100, "Пароль слишком длинный"),
});

type Schema = z.output<typeof schema>;

async function onSubmit(event: { data: Schema }) {
  loading.value = true;
  error.value = "";

  const result = await register(event.data);

  if (result.success) {
    await navigateTo("/");
  } else {
    error.value = result.error || "Ошибка регистрации";
  }

  loading.value = false;
}
</script>
