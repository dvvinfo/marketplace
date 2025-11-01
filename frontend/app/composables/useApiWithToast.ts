import type { UseFetchOptions } from 'nuxt/app'
import type { ApiError } from './useApi'

/**
 * Обёртка над useApi с автоматическими toast-уведомлениями
 * Используйте этот composable когда нужны автоматические уведомления об ошибках
 */
export const useApiWithToast = () => {
  const { apiFetch, baseURL, getErrorMessage } = useApi()
  const toast = useToast()

  const apiFetchWithToast = async <T>(
    url: string,
    options?: UseFetchOptions<T> & { 
      silent?: boolean
      successMessage?: string
    }
  ) => {
    const silent = options?.silent || false

    try {
      const result = await apiFetch<T>(url, options)
      
      // Показываем успешное сообщение если указано
      if (options?.successMessage) {
        toast.add({
          title: 'Успешно!',
          description: options.successMessage,
          color: 'success',
        })
      }
      
      return result
    } catch (error) {
      // Показываем toast только если не silent режим
      if (!silent) {
        const errorMessage = getErrorMessage(error as ApiError)
        
        toast.add({
          title: 'Ошибка',
          description: errorMessage,
          color: 'error',
        })
      }

      throw error
    }
  }

  return {
    apiFetch: apiFetchWithToast,
    baseURL,
    getErrorMessage,
  }
}
