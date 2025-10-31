<template>
  <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6">
    <h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
      {{ isEditing ? "Редактировать отзыв" : "Написать отзыв" }}
    </h3>

    <form @submit.prevent="submitReview" class="space-y-4">
      <!-- Rating -->
      <div>
        <label
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Оценка *
        </label>
        <div class="flex items-center gap-2">
          <button
            v-for="star in 5"
            :key="star"
            type="button"
            @click="rating = star"
            @mouseenter="hoverRating = star"
            @mouseleave="hoverRating = 0"
            class="transition-transform hover:scale-110"
          >
            <UIcon
              name="i-heroicons-star-solid"
              :class="
                star <= (hoverRating || rating)
                  ? 'text-yellow-400'
                  : 'text-gray-300'
              "
              class="w-8 h-8"
            />
          </button>
          <span v-if="rating" class="ml-2 text-gray-600 dark:text-gray-400">
            {{ ratingText }}
          </span>
        </div>
        <p v-if="errors.rating" class="text-red-500 text-sm mt-1">
          {{ errors.rating }}
        </p>
      </div>

      <!-- Comment -->
      <div>
        <label
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Комментарий
        </label>
        <UTextarea
          v-model="comment"
          :rows="4"
          placeholder="Расскажите о вашем опыте использования товара..."
          :disabled="submitting"
          class="w-full"
        />
        <p v-if="errors.comment" class="text-red-500 text-sm mt-1">
          {{ errors.comment }}
        </p>
      </div>

      <!-- Actions -->
      <div class="flex gap-3">
        <UButton
          type="submit"
          :disabled="submitting"
          class="bg-linear-to-r from-blue-600 to-purple-600"
        >
          {{
            submitting ? "Отправка..." : isEditing ? "Обновить" : "Опубликовать"
          }}
        </UButton>
        <UButton
          type="button"
          variant="outline"
          @click="$emit('cancel')"
          :disabled="submitting"
        >
          Отменить
        </UButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  productId: number;
  existingReview?: any;
}>();

const emit = defineEmits<{
  reviewCreated: [];
  cancel: [];
}>();

const { apiFetch } = useApi();
const { user } = useAuth();
const toast = useToast();

const rating = ref(props.existingReview?.rating || 0);
const comment = ref(props.existingReview?.comment || "");
const hoverRating = ref(0);
const submitting = ref(false);
const errors = ref<{ rating?: string; comment?: string }>({});

const isEditing = computed(() => !!props.existingReview);

const ratingText = computed(() => {
  const texts = ["", "Ужасно", "Плохо", "Нормально", "Хорошо", "Отлично"];
  return texts[rating.value] || "";
});

const validateForm = () => {
  errors.value = {};

  if (rating.value === 0) {
    errors.value.rating = "Пожалуйста, выберите оценку";
    return false;
  }

  if (rating.value < 1 || rating.value > 5) {
    errors.value.rating = "Оценка должна быть от 1 до 5";
    return false;
  }

  return true;
};

const submitReview = async () => {
  if (!validateForm()) return;
  if (!user.value) return;

  submitting.value = true;

  try {
    // Очищаем комментарий от лишних пробелов и переносов строк
    const cleanComment = comment.value?.trim() || "";

    const body = {
      userId: user.value.id,
      productId: props.productId,
      rating: rating.value,
      comment: cleanComment || undefined,
    };

    if (isEditing.value) {
      // Update existing review
      await apiFetch(
        `/reviews/${props.existingReview.id}/user/${user.value.id}`,
        {
          method: "PUT",
          body: {
            rating: rating.value,
            comment: cleanComment || undefined,
          },
        }
      );
    } else {
      // Create new review
      await apiFetch("/reviews", {
        method: "POST",
        body,
      });
    }

    emit("reviewCreated");
  } catch (error: any) {
    console.error("Failed to submit review:", error);

    let errorMessage = "Не удалось отправить отзыв";

    if (error.statusCode === 409 || error.status === 409) {
      errorMessage = "Вы уже оставили отзыв на этот товар";
    } else if (error.statusCode === 401 || error.status === 401) {
      errorMessage = "Пожалуйста, войдите в аккаунт чтобы оставить отзыв";
    } else if (error.statusCode === 400 || error.status === 400) {
      errorMessage = "Пожалуйста, заполните все поля корректно";
    } else {
      errorMessage = "Не удалось отправить отзыв. Попробуйте позже";
    }

    toast.add({
      title: "Ошибка",
      description: errorMessage,
      color: "error",
    });
  } finally {
    submitting.value = false;
  }
};
</script>
