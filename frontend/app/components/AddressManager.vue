<template>
  <UCard>
    <template #header>
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Адреса доставки
        </h2>
        <UButton
          @click="showAddForm = true"
          size="lg"
          color="secondary"
          variant="soft"
        >
          <UIcon name="i-heroicons-plus" class="w-5 h-5 mr-2" />
          Добавить адрес
        </UButton>
      </div>
    </template>

    <div v-if="loading" class="text-center py-8">
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"
      ></div>
    </div>

    <div
      v-else-if="addresses.length === 0 && !showAddForm"
      class="text-center py-8"
    >
      <UIcon
        name="i-heroicons-map-pin"
        class="w-16 h-16 mx-auto text-gray-400 mb-4"
      />
      <p class="text-gray-600 dark:text-gray-300 mb-4">
        У вас пока нет сохраненных адресов
      </p>
      <UButton
        @click="showAddForm = true"
        size="lg"
        color="secondary"
        variant="soft"
      >
        Добавить первый адрес
      </UButton>
    </div>

    <!-- Форма добавления/редактирования адреса -->
    <div
      v-if="showAddForm"
      class="mb-6 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl"
    >
      <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
        {{ editingAddress ? "Редактировать адрес" : "Новый адрес" }}
      </h3>

      <UForm
        :schema="addressSchema"
        :state="addressState"
        @submit="onSubmitAddress"
        class="space-y-4"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UFormField label="ФИО получателя" name="fullName">
            <UInput
              v-model="addressState.fullName"
              placeholder="Иванов Иван Иванович"
              size="xl"
              color="secondary"
              variant="outline"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Телефон" name="phone">
            <UInput
              v-model="addressState.phone"
              placeholder="+7 (999) 123-45-67"
              size="xl"
              color="secondary"
              variant="outline"
              class="w-full"
            />
          </UFormField>
        </div>

        <UFormField label="Адрес (улица, дом, квартира)" name="addressLine1">
          <UInput
            v-model="addressState.addressLine1"
            placeholder="ул. Ленина, д. 10, кв. 5"
            size="xl"
            color="secondary"
            variant="outline"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Дополнительная информация (необязательно)"
          name="addressLine2"
        >
          <UInput
            v-model="addressState.addressLine2"
            placeholder="Подъезд 2, домофон 123"
            size="xl"
            color="secondary"
            variant="outline"
            class="w-full"
          />
        </UFormField>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <UFormField label="Город" name="city">
            <UInput
              v-model="addressState.city"
              placeholder="Москва"
              size="xl"
              color="secondary"
              variant="outline"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Регион (необязательно)" name="state">
            <UInput
              v-model="addressState.state"
              placeholder="Московская область"
              size="xl"
              color="secondary"
              variant="outline"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Индекс" name="postalCode">
            <UInput
              v-model="addressState.postalCode"
              placeholder="123456"
              size="xl"
              color="secondary"
              variant="outline"
              class="w-full"
            />
          </UFormField>
        </div>

        <UFormField label="Страна" name="country">
          <UInput
            v-model="addressState.country"
            placeholder="Россия"
            size="xl"
            color="secondary"
            variant="outline"
            class="w-full"
          />
        </UFormField>

        <div class="flex items-center gap-2">
          <input
            type="checkbox"
            v-model="addressState.isDefault"
            id="isDefault"
            class="w-5 h-5 text-purple-600 rounded"
          />
          <label
            for="isDefault"
            class="text-gray-700 dark:text-gray-300 cursor-pointer"
          >
            Сделать адресом по умолчанию
          </label>
        </div>

        <div
          v-if="addressError"
          class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm"
        >
          {{ addressError }}
        </div>

        <div class="flex gap-3">
          <UButton
            type="submit"
            :loading="submitting"
            size="lg"
            class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            {{ editingAddress ? "Сохранить" : "Добавить" }}
          </UButton>
          <UButton
            @click="cancelAddressForm"
            size="lg"
            color="neutral"
            variant="soft"
          >
            Отмена
          </UButton>
        </div>
      </UForm>
    </div>

    <!-- Список адресов -->
    <div v-if="addresses.length > 0" class="space-y-4">
      <div
        v-for="address in addresses"
        :key="address.id"
        class="p-4 border-2 rounded-xl transition-all"
        :class="
          address.isDefault
            ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
            : 'border-gray-200 dark:border-gray-700'
        "
      >
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <h4 class="font-bold text-gray-800 dark:text-gray-100">
                {{ address.fullName }}
              </h4>
              <span
                v-if="address.isDefault"
                class="px-2 py-1 bg-purple-600 text-white text-xs rounded-full"
              >
                По умолчанию
              </span>
            </div>
            <p class="text-gray-600 dark:text-gray-300 mb-1">
              {{ address.addressLine1 }}
              <span v-if="address.addressLine2"
                >, {{ address.addressLine2 }}</span
              >
            </p>
            <p class="text-gray-500 dark:text-gray-400 text-sm">
              {{ address.city
              }}<span v-if="address.state">, {{ address.state }}</span
              >, {{ address.postalCode }}
            </p>
            <p class="text-gray-500 dark:text-gray-400 text-sm">
              {{ address.country }} • {{ address.phone }}
            </p>
          </div>

          <div class="flex gap-2 shrink-0 ml-4">
            <UButton
              @click="editAddress(address)"
              size="md"
              color="primary"
              variant="soft"
              icon="i-heroicons-pencil"
              square
              title="Редактировать"
            />
            <UButton
              @click="deleteAddress(address.id)"
              size="md"
              color="error"
              variant="soft"
              icon="i-heroicons-trash"
              square
              :loading="deletingId === address.id"
              title="Удалить"
            />
          </div>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { z } from "zod";
import { useAddresses } from "~/composables/useAddresses";

const props = defineProps<{
  userId: number;
}>();

const toast = useToast();
const { user } = useAuth();
const {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress: deleteAddressApi,
} = useAddresses();

const addresses = ref<any[]>([]);
const loading = ref(false);
const submitting = ref(false);
const deletingId = ref<number | null>(null);
const showAddForm = ref(false);
const editingAddress = ref<any>(null);
const addressError = ref("");

const addressState = reactive({
  fullName: "",
  phone: "",
  country: "Россия",
  city: "",
  state: "",
  postalCode: "",
  addressLine1: "",
  addressLine2: "",
  isDefault: false,
});

const addressSchema = z.object({
  fullName: z.string().min(2, "ФИО должно содержать минимум 2 символа"),
  phone: z.string().min(10, "Введите корректный номер телефона"),
  country: z.string().min(2, "Введите страну"),
  city: z.string().min(2, "Введите город"),
  state: z.string().optional(),
  postalCode: z.string().min(5, "Введите корректный индекс"),
  addressLine1: z.string().min(5, "Введите полный адрес"),
  addressLine2: z.string().optional(),
  isDefault: z.boolean().optional(),
});

type AddressSchema = z.output<typeof addressSchema>;

onMounted(() => {
  loadAddresses();
  // Инициализируем форму данными пользователя
  if (user.value) {
    addressState.fullName = `${user.value.nameFirst} ${user.value.nameLast}`;
    addressState.phone = user.value.phone || "";
  }
});

const loadAddresses = async () => {
  loading.value = true;
  try {
    addresses.value = await getAddresses(props.userId);
  } catch (err: any) {
    console.error("Failed to load addresses:", err);
    toast.add({
      title: "Ошибка",
      description: "Не удалось загрузить адреса",
      color: "error",
    });
  } finally {
    loading.value = false;
  }
};

const onSubmitAddress = async (event: { data: AddressSchema }) => {
  submitting.value = true;
  addressError.value = "";

  try {
    if (editingAddress.value) {
      // Редактирование существующего адреса
      await updateAddress(editingAddress.value.id, props.userId, event.data);

      toast.add({
        title: "Успешно!",
        description: "Адрес обновлен",
        color: "success",
      });
    } else {
      // Добавление нового адреса
      await createAddress({
        userId: props.userId,
        ...event.data,
      });

      toast.add({
        title: "Успешно!",
        description: "Адрес добавлен",
        color: "success",
      });
    }

    await loadAddresses();
    cancelAddressForm();
  } catch (err: any) {
    console.error("Address save error:", err);
    addressError.value =
      err.data?.message ||
      "Не удалось сохранить адрес. Проверьте правильность заполнения полей";
  } finally {
    submitting.value = false;
  }
};

const editAddress = (address: any) => {
  editingAddress.value = address;
  addressState.fullName = address.fullName;
  addressState.phone = address.phone;
  addressState.country = address.country;
  addressState.city = address.city;
  addressState.state = address.state || "";
  addressState.postalCode = address.postalCode;
  addressState.addressLine1 = address.addressLine1;
  addressState.addressLine2 = address.addressLine2 || "";
  addressState.isDefault = address.isDefault;
  showAddForm.value = true;
};

const deleteAddress = async (id: number) => {
  if (!confirm("Вы уверены, что хотите удалить этот адрес?")) {
    return;
  }

  deletingId.value = id;

  try {
    await deleteAddressApi(id, props.userId);

    toast.add({
      title: "Успешно!",
      description: "Адрес удален",
      color: "success",
    });

    await loadAddresses();
  } catch (err: any) {
    console.error("Address delete error:", err);
    toast.add({
      title: "Ошибка",
      description: "Не удалось удалить адрес. Попробуйте позже",
      color: "error",
    });
  } finally {
    deletingId.value = null;
  }
};

const cancelAddressForm = () => {
  showAddForm.value = false;
  editingAddress.value = null;
  addressState.fullName = user.value
    ? `${user.value.nameFirst} ${user.value.nameLast}`
    : "";
  addressState.phone = user.value?.phone || "";
  addressState.country = "Россия";
  addressState.city = "";
  addressState.state = "";
  addressState.postalCode = "";
  addressState.addressLine1 = "";
  addressState.addressLine2 = "";
  addressState.isDefault = false;
  addressError.value = "";
};
</script>
