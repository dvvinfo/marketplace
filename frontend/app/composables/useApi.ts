import type { UseFetchOptions } from 'nuxt/app'
import type { FetchError } from 'ofetch'

export interface ApiError extends Error {
  statusCode?: number
  statusMessage?: string
  data?: any
}

export const useApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl

  const apiFetch = async <T>(url: string, options?: UseFetchOptions<T> & { silent?: boolean }) => {
    const token = useCookie('auth_token')

    try {
      return await $fetch<T>(url, {
        baseURL,
        headers: {
          ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
          ...options?.headers,
        },
        ...options,
      })
    } catch (error) {
      const fetchError = error as FetchError
      
      // Создаём структурированную ошибку
      const apiError: ApiError = new Error(fetchError.message) as ApiError
      apiError.statusCode = fetchError.statusCode || fetchError.response?.status
      apiError.statusMessage = fetchError.statusMessage || fetchError.response?.statusText
      apiError.data = fetchError.data

      // Логируем ошибку
      console.error('API Error:', {
        url,
        statusCode: apiError.statusCode,
        message: apiError.message,
        data: apiError.data,
      })

      throw apiError
    }
  }

  // Вспомогательная функция для получения понятного сообщения об ошибке
  const getErrorMessage = (error: ApiError): string => {
    // Если есть сообщение от сервера
    if (error.data?.message) {
      if (Array.isArray(error.data.message)) {
        return error.data.message.join(', ')
      }
      return error.data.message
    }

    // Стандартные сообщения по кодам
    switch (error.statusCode) {
      case 400:
        return 'Неверные данные запроса'
      case 401:
        return 'Требуется авторизация'
      case 403:
        return 'Доступ запрещён'
      case 404:
        return 'Ресурс не найден'
      case 409:
        return 'Конфликт данных'
      case 422:
        return 'Ошибка валидации данных'
      case 429:
        return 'Слишком много запросов. Попробуйте позже'
      case 500:
        return 'Ошибка сервера'
      case 503:
        return 'Сервис временно недоступен'
      default:
        return error.message || 'Произошла ошибка при выполнении запроса'
    }
  }

  return {
    apiFetch,
    baseURL,
    getErrorMessage,
  }
}
