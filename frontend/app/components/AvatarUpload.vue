<template>
  <div class="flex flex-col items-center gap-4">
    <!-- Превью аватара -->
    <div class="relative group">
      <UAvatar
        :src="avatarUrl || undefined"
        :alt="userName"
        size="3xl"
        icon="i-heroicons-user"
        class="ring-4 ring-purple-200 dark:ring-purple-800 shadow-lg"
      />

      <!-- Оверлей при наведении -->
      <div
        class="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        @click="triggerFileInput"
      >
        <UIcon name="i-heroicons-camera" class="w-8 h-8 text-white" />
      </div>
    </div>

    <!-- Скрытый input для файла -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleFileChange"
    />

    <!-- Кнопки -->
    <div class="flex gap-2">
      <UButton
        @click="triggerFileInput"
        size="sm"
        color="secondary"
        variant="soft"
      >
        <UIcon name="i-heroicons-arrow-up-tray" class="w-4 h-4 mr-2" />
        Загрузить фото
      </UButton>

      <UButton
        v-if="avatarUrl"
        @click="removeAvatar"
        size="sm"
        color="error"
        variant="soft"
      >
        <UIcon name="i-heroicons-trash" class="w-4 h-4 mr-2" />
        Удалить
      </UButton>
    </div>

    <!-- Информация -->
    <p class="text-xs text-gray-500 dark:text-gray-400 text-center">
      JPG, PNG или GIF. Максимум 5MB.<br />
      Изображение будет автоматически сжато до 400x400px.
    </p>

    <!-- Ошибка -->
    <div
      v-if="error"
      class="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm"
    >
      {{ error }}
    </div>

    <!-- Загрузка -->
    <div v-if="uploading" class="text-center">
      <div
        class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"
      ></div>
      <p class="text-sm text-gray-600 dark:text-gray-300 mt-2">Загрузка...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string | null;
  userId: number;
  userName?: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string | null];
}>();

const toast = useToast();

const fileInput = ref<HTMLInputElement | null>(null);
const uploading = ref(false);
const error = ref("");

const avatarUrl = computed(() => props.modelValue);

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  error.value = "";

  // Валидация размера (5MB для исходного файла)
  if (file.size > 5 * 1024 * 1024) {
    error.value = "Файл слишком большой. Максимум 5MB.";
    return;
  }

  // Валидация типа
  if (!file.type.startsWith("image/")) {
    error.value = "Можно загружать только изображения.";
    return;
  }

  uploading.value = true;

  try {
    // Сжимаем и конвертируем изображение
    const compressedBase64 = await compressImage(file);

    // Только обновляем превью, не отправляем на сервер
    emit("update:modelValue", compressedBase64);

    toast.add({
      title: "Готово!",
      description:
        "Фото выбрано. Нажмите 'Сохранить изменения' для применения.",
      color: "info",
    });
  } catch (err: any) {
    console.error("Image processing error:", err);
    error.value = "Не удалось обработать изображение. Попробуйте другой файл";
    toast.add({
      title: "Ошибка",
      description: error.value,
      color: "error",
    });
  } finally {
    uploading.value = false;
    // Очищаем input
    if (target) target.value = "";
  }
};

const removeAvatar = () => {
  if (!confirm("Вы уверены, что хотите удалить аватар?")) {
    return;
  }

  // Только обновляем превью, не отправляем на сервер
  emit("update:modelValue", null);

  toast.add({
    title: "Готово!",
    description: "Аватар будет удален после сохранения изменений.",
    color: "info",
  });
};

const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Не удалось создать canvas"));
          return;
        }

        // Максимальный размер 400x400
        const maxSize = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Рисуем изображение
        ctx.drawImage(img, 0, 0, width, height);

        // Конвертируем в base64 с качеством 0.8
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.8);
        resolve(compressedBase64);
      };

      img.onerror = () => reject(new Error("Не удалось загрузить изображение"));
    };

    reader.onerror = () => reject(new Error("Не удалось прочитать файл"));
  });
};
</script>
