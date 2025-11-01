import { ref, computed } from 'vue';

// Глобальное состояние избранного (shared state)
const favorites = ref<number[]>([]);
const loading = ref(false);

export const useFavorites = () => {
  const toast = useToast();
  const { apiFetch } = useApi();

  // Загрузить избранное пользователя
  const loadFavorites = async () => {
    // Проверяем авторизацию перед загрузкой
    const { isAuthenticated, user } = useAuth();
    if (!isAuthenticated.value || !user.value) {
      favorites.value = [];
      return;
    }

    try {
      loading.value = true;
      // API Gateway возвращает массив объектов Favorite[]
      const response = await apiFetch<any[]>(`/favorites/user/${user.value.id}`);
      
      // Проверяем, что response является массивом
      if (Array.isArray(response)) {
        // Извлекаем только ID товаров
        favorites.value = response.map((fav: any) => fav.productId);
      } else {
        console.warn('Unexpected response format:', response);
        favorites.value = [];
      }
    } catch (error) {
      console.error('Ошибка загрузки избранного:', error);
      favorites.value = [];
    } finally {
      loading.value = false;
    }
  };

  // Проверить, находится ли товар в избранном
  const isFavorite = (productId: number) => {
    return favorites.value.includes(productId);
  };

  // Добавить товар в избранное
  const addToFavorites = async (productId: number) => {
    const { user } = useAuth();
    if (!user.value) {
      toast.add({
        title: 'Ошибка',
        description: 'Необходимо авторизоваться',
        icon: 'i-heroicons-x-circle',
        color: 'red',
      });
      return;
    }

    try {
      await apiFetch('/favorites', {
        method: 'POST',
        body: { userId: user.value.id, productId },
      });
      
      favorites.value.push(productId);
      toast.add({
        title: 'Добавлено в избранное',
        icon: 'i-heroicons-heart-solid',
        color: 'green',
      });
    } catch (error: any) {
      toast.add({
        title: 'Ошибка',
        description: error.message || 'Не удалось добавить в избранное',
        icon: 'i-heroicons-x-circle',
        color: 'red',
      });
    }
  };

  // Удалить товар из избранного
  const removeFromFavorites = async (productId: number) => {
    const { user } = useAuth();
    if (!user.value) {
      toast.add({
        title: 'Ошибка',
        description: 'Необходимо авторизоваться',
        icon: 'i-heroicons-x-circle',
        color: 'red',
      });
      return;
    }

    try {
      await apiFetch(`/favorites/user/${user.value.id}/product/${productId}`, {
        method: 'DELETE',
      });
      
      favorites.value = favorites.value.filter((id) => id !== productId);
      toast.add({
        title: 'Удалено из избранного',
        icon: 'i-heroicons-heart',
        color: 'gray',
      });
    } catch (error: any) {
      toast.add({
        title: 'Ошибка',
        description: error.message || 'Не удалось удалить из избранного',
        icon: 'i-heroicons-x-circle',
        color: 'red',
      });
    }
  };

  // Переключить состояние избранного
  const toggleFavorite = async (productId: number) => {
    if (isFavorite(productId)) {
      await removeFromFavorites(productId);
    } else {
      await addToFavorites(productId);
    }
  };

  // Количество товаров в избранном
  const favoritesCount = computed(() => favorites.value.length);

  return {
    favorites,
    loading,
    loadFavorites,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    favoritesCount,
  };
};
