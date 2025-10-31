<template>
  <UCard>
    <template #header>
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100">
        Редактирование профиля
      </h2>
    </template>

    <UForm :schema="schema" :state="state" @submit="onSubmit" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UFormField label="Имя" name="firstName">
          <UInput
            v-model="state.firstName"
            placeholder="Иван"
            size="xl"
            color="secondary"
            variant="outline"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Фамилия" name="lastName">
          <UInput
            v-model="state.lastName"
            placeholder="Иванов"
            size="xl"
            color="secondary"
            variant="outline"
            class="w-full"
          />
        </UFormField>
      </div>

      <UFormField label="Email" name="email">
        <UInput
          v-model="state.email"
          type="email"
          placeholder="example@mail.com"
          size="xl"
          color="secondary"
          variant="outline"
          class="w-full"
          disabled
        />
      </UFormField>

      <UFormField label="Телефон" name="phone">
        <UInput
          v-model="state.phone"
          type="tel"
          placeholder="+7 (999) 123-45-67"
          size="xl"
          color="secondary"
          variant="outline"
          class="w-full"
        />
      </UFormField>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UFormField label="Дата рождения" name="birthDate">
          <UInput
            v-model="state.birthDate"
            type="date"
            size="xl"
            color="secondary"
            variant="outline"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Пол" name="gender">
          <select
            v-model="state.gender"
            class="w-full px-3 py-2.5 text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Не указан</option>
            <option value="male">Мужской</option>
            <option value="female">Женский</option>
            <option value="other">Другой</option>
          </select>
        </UFormField>
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
        Сохранить изменения
      </UButton>
    </UForm>
  </UCard>
</template>

<script setup lang="ts">
import { z } from "zod";

const props = defineProps<{
  user: any;
  avatar?: string | null;
}>();

const emit = defineEmits<{
  update: [];
}>();

const { apiFetch } = useApi();

const state = reactive({
  firstName: props.user?.nameFirst || "",
  lastName: props.user?.nameLast || "",
  email: props.user?.email || "",
  phone: props.user?.phone || "",
  birthDate: props.user?.birthDate ? new Date(props.user.birthDate).toISOString().split('T')[0] : "",
  gender: props.user?.gender || "",
});

const loading = ref(false);
const error = ref("");
const success = ref("");

const schema = z.object({
  firstName: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  lastName: z.string().min(2, "Фамилия должна содержать минимум 2 символа"),
  email: z.string().email("Введите корректный email"),
  phone: z.string().optional(),
  birthDate: z.string().optional(),
  gender: z.enum(["male", "female", "other", ""]).optional(),
});

type Schema = z.output<typeof schema>;

async function onSubmit(event: { data: Schema }) {
  loading.value = true;
  error.value = "";
  success.value = "";

  try {
    const updateData: any = {
      nameFirst: event.data.firstName,
      nameLast: event.data.lastName,
    };

    // Добавляем телефон только если он указан
    if (event.data.phone) {
      updateData.phone = event.data.phone;
    }

    // Добавляем дату рождения только если она указана
    if (event.data.birthDate) {
      updateData.birthDate = new Date(event.data.birthDate).toISOString();
    }

    // Добавляем пол только если он указан
    if (event.data.gender && event.data.gender !== "") {
      updateData.gender = event.data.gender;
    }

    // Добавляем аватар если он изменился
    if (props.avatar !== undefined && props.avatar !== props.user?.avatar) {
      updateData.avatar = props.avatar;
    }

    await apiFetch(`/users/${props.user.id}`, {
      method: "PUT",
      body: updateData,
    });

    success.value = "Профиль успешно обновлен";
    
    // Очищаем сообщение через 3 секунды
    setTimeout(() => {
      success.value = "";
    }, 3000);
    
    emit("update");
  } catch (err: any) {
    console.error("Profile update error:", err);
    
    // Показываем понятное сообщение пользователю
    if (err.statusCode === 400 || err.status === 400) {
      error.value = "Пожалуйста, проверьте правильность заполнения полей";
    } else if (err.statusCode === 401 || err.status === 401) {
      error.value = "Сессия истекла. Пожалуйста, войдите снова";
    } else if (err.statusCode === 403 || err.status === 403) {
      error.value = "У вас нет прав для изменения этого профиля";
    } else if (err.statusCode === 413 || err.status === 413) {
      error.value = "Изображение слишком большое. Попробуйте другое фото";
    } else {
      error.value = "Не удалось обновить профиль. Попробуйте позже";
    }
  } finally {
    loading.value = false;
  }
}

// Обновляем состояние при изменении пропса user
watch(
  () => props.user,
  (newUser) => {
    if (newUser) {
      state.firstName = newUser.nameFirst || "";
      state.lastName = newUser.nameLast || "";
      state.email = newUser.email || "";
      state.phone = newUser.phone || "";
      state.birthDate = newUser.birthDate ? new Date(newUser.birthDate).toISOString().split('T')[0] : "";
      state.gender = newUser.gender || "";
    }
  },
  { deep: true, immediate: true }
);
</script>
