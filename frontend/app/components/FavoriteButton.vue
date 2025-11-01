<template>
  <UButton
    icon="i-heroicons-heart-solid"
    :color="isFavorite ? 'error' : 'neutral'"
    variant="ghost"
    size="lg"
    @click="handleToggle"
    :title="isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  productId: number;
  isFavorite: boolean;
}>();

const emit = defineEmits<{
  toggle: [];
}>();

const handleToggle = () => {
  emit('toggle');
};
</script>
