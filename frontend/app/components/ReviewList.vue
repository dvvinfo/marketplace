<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
    <h2 class="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
      Отзывы
    </h2>

    <!-- Add Review Button (for authenticated users) -->
    <div v-if="isAuthenticated && !userReview" class="mb-6">
      <UButton
        @click="showReviewForm = !showReviewForm"
        class="bg-gradient-to-r from-blue-600 to-purple-600"
      >
        {{ showReviewForm ? 'Отменить' : 'Написать отзыв' }}
      </UButton>
    </div>

    <!-- Review Form -->
    <ReviewForm
      v-if="showReviewForm && isAuthenticated"
      :product-id="productId"
      :existing-review="userReview"
      @review-created="handleReviewCreated"
      @cancel="showReviewForm = false"
      class="mb-8"
    />

    <!-- User's Review (if exists) -->
    <div v-if="userReview" class="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
      <div class="flex items-center justify-between mb-2">
        <span class="font-semibold text-blue-700 dark:text-blue-300">Ваш отзыв</span>
        <div class="flex gap-2">
          <UButton
            size="xs"
            variant="ghost"
            @click="editReview"
          >
            Редактировать
          </UButton>
          <UButton
            size="xs"
            variant="ghost"
            color="error"
            @click="deleteReview"
          >
            Удалить
          </UButton>
        </div>
      </div>
      <div class="flex items-center gap-2 mb-2">
        <UIcon
          v-for="star in 5"
          :key="star"
          name="i-heroicons-star-solid"
          :class="star <= userReview.rating ? 'text-yellow-400' : 'text-gray-300'"
          class="w-5 h-5"
        />
      </div>
      <p class="text-gray-700 dark:text-gray-300">{{ userReview.comment }}</p>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
        {{ formatDate(userReview.createdAt) }}
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
    </div>

    <!-- Reviews List -->
    <div v-else-if="reviews.length > 0" class="space-y-6">
      <div
        v-for="review in reviews"
        :key="review.id"
        class="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0"
      >
        <div class="flex items-start justify-between mb-2">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="font-semibold text-gray-900 dark:text-gray-100">
                Пользователь #{{ review.userId }}
              </span>
            </div>
            <div class="flex items-center gap-2">
              <UIcon
                v-for="star in 5"
                :key="star"
                name="i-heroicons-star-solid"
                :class="star <= review.rating ? 'text-yellow-400' : 'text-gray-300'"
                class="w-5 h-5"
              />
            </div>
          </div>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ formatDate(review.createdAt) }}
          </span>
        </div>
        <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
          {{ review.comment }}
        </p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!userReview" class="text-center py-8">
      <UIcon name="i-heroicons-chat-bubble-left-right" class="w-16 h-16 mx-auto text-gray-400 mb-4" />
      <p class="text-gray-600 dark:text-gray-300">Пока нет отзывов</p>
      <p v-if="isAuthenticated" class="text-gray-500 dark:text-gray-400 text-sm mt-2">
        Будьте первым, кто оставит отзыв!
      </p>
    </div>
    
    <!-- No other reviews message -->
    <div v-else class="text-center py-8">
      <p class="text-gray-500 dark:text-gray-400">Других отзывов пока нет</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  productId: number;
}>();

const emit = defineEmits<{
  ratingUpdated: [];
}>();

const { apiFetch } = useApi();
const { isAuthenticated, user } = useAuth();
const toast = useToast();

const reviews = ref<any[]>([]);
const userReview = ref<any>(null);
const loading = ref(false);
const showReviewForm = ref(false);

// Fetch reviews
const fetchReviews = async () => {
  loading.value = true;
  try {
    const allReviews = await apiFetch<any[]>(`/reviews/product/${props.productId}`);
    
    // Separate user's review from others
    if (isAuthenticated.value && user.value) {
      userReview.value = allReviews.find(r => r.userId === user.value.id);
      reviews.value = allReviews.filter(r => r.userId !== user.value.id);
    } else {
      reviews.value = allReviews;
    }
  } catch (error) {
    console.error('Failed to fetch reviews:', error);
  } finally {
    loading.value = false;
  }
};

// Handle review created
const handleReviewCreated = () => {
  showReviewForm.value = false;
  fetchReviews();
  emit('ratingUpdated');
  toast.add({
    title: 'Успешно!',
    description: 'Ваш отзыв опубликован',
    color: 'success',
  });
};

// Edit review
const editReview = () => {
  showReviewForm.value = true;
};

// Delete review
const deleteReview = async () => {
  if (!userReview.value || !user.value) return;
  
  try {
    await apiFetch(`/reviews/${userReview.value.id}/user/${user.value.id}`, {
      method: 'DELETE',
    });
    
    userReview.value = null;
    fetchReviews();
    emit('ratingUpdated');
    
    toast.add({
      title: 'Успешно!',
      description: 'Отзыв удален',
      color: 'success',
    });
  } catch (error) {
    toast.add({
      title: 'Ошибка',
      description: 'Не удалось удалить отзыв',
      color: 'error',
    });
  }
};

// Format date
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Fetch reviews on mount
onMounted(() => {
  fetchReviews();
});
</script>
