/**
 * Composable для централизованной обработки ошибок
 */
export const useErrorHandler = () => {
  const toast = useToast()

  /**
   * Обработка ошибки с показом уведомления
   */
  const handleError = (error: any, customMessage?: string) => {
    console.error('Error handled:', error)

    let message = customMessage || 'Произошла ошибка'

    // Извлекаем сообщение из разных типов ошибок
    if (error?.data?.message) {
      message = Array.isArray(error.data.message)
        ? error.data.message.join(', ')
        : error.data.message
    } else if (error?.message) {
      message = error.message
    } else if (typeof error === 'string') {
      message = error
    }

    toast.add({
      title: 'Ошибка',
      description: message,
      color: 'error',
    })
  }

  /**
   * Обработка успешной операции
   */
  const handleSuccess = (message: string) => {
    toast.add({
      title: 'Успешно!',
      description: message,
      color: 'success',
    })
  }

  /**
   * Обработка предупреждения
   */
  const handleWarning = (message: string) => {
    toast.add({
      title: 'Внимание',
      description: message,
      color: 'warning',
    })
  }

  /**
   * Обработка информационного сообщения
   */
  const handleInfo = (message: string) => {
    toast.add({
      title: 'Информация',
      description: message,
      color: 'info',
    })
  }

  /**
   * Обёртка для async функций с автоматической обработкой ошибок
   */
  const withErrorHandling = async <T>(
    fn: () => Promise<T>,
    options?: {
      errorMessage?: string
      successMessage?: string
      silent?: boolean
    }
  ): Promise<T | null> => {
    try {
      const result = await fn()
      
      if (options?.successMessage) {
        handleSuccess(options.successMessage)
      }
      
      return result
    } catch (error) {
      if (!options?.silent) {
        handleError(error, options?.errorMessage)
      }
      return null
    }
  }

  return {
    handleError,
    handleSuccess,
    handleWarning,
    handleInfo,
    withErrorHandling,
  }
}
