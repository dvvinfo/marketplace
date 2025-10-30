<template>
  <USelect
    :model-value="modelValue"
    @update:model-value="handleChange"
    :items="sortOptions"
    option-attribute="label"
    value-attribute="value"
    size="md"
    color="secondary"
    class="w-48"
  />
</template>

<script setup lang="ts">
interface Props {
  modelValue: string;
}

defineProps<Props>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const sortOptions = [
  { label: "По умолчанию", value: "default" },
  { label: "Сначала дешевле", value: "price_asc" },
  { label: "Сначала дороже", value: "price_desc" },
  { label: "Новинки", value: "newest" },
];

const handleChange = (value: any) => {
  if (typeof value === "string") {
    emit("update:modelValue", value);
  }
};
</script>
