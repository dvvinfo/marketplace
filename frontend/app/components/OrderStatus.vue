<template>
  <UBadge :color="statusColor" variant="subtle" size="lg">
    {{ statusText }}
  </UBadge>
</template>

<script setup lang="ts">
const props = defineProps<{
  status: string;
}>();

const statusMap: Record<
  string,
  {
    text: string;
    color:
      | "primary"
      | "secondary"
      | "success"
      | "info"
      | "warning"
      | "error"
      | "neutral";
  }
> = {
  pending: { text: "Ожидает", color: "warning" },
  processing: { text: "В обработке", color: "info" },
  shipped: { text: "Отправлен", color: "primary" },
  delivered: { text: "Доставлен", color: "success" },
  cancelled: { text: "Отменен", color: "error" },
  completed: { text: "Завершен", color: "success" },
};

const statusText = computed(() => {
  return statusMap[props.status]?.text || props.status;
});

const statusColor = computed(() => {
  return statusMap[props.status]?.color || "neutral";
});
</script>
