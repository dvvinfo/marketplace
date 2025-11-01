/**
 * Плагин для глобальной обработки ошибок на клиенте
 */
export default defineNuxtPlugin((nuxtApp) => {
  // Обработка ошибок Vue
  nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
    console.error('Global error handler:', error, info)
    
    // Можно отправить ошибку в систему мониторинга (Sentry, LogRocket и т.д.)
    // if (process.env.NODE_ENV === 'production') {
    //   Sentry.captureException(error)
    // }
  }

  // Обработка необработанных промисов
  if (process.client) {
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason)
      
      // Предотвращаем дефолтное поведение
      event.preventDefault()
      
      // Можно показать уведомление пользователю
      // const toast = useToast()
      // toast.add({
      //   title: 'Ошибка',
      //   description: 'Произошла непредвиденная ошибка',
      //   color: 'error',
      // })
    })

    // Обработка ошибок загрузки ресурсов
    window.addEventListener('error', (event) => {
      if (event.target instanceof HTMLImageElement) {
        console.error('Image loading error:', event.target.src)
        // Можно установить placeholder изображение
        // event.target.src = '/placeholder.png'
      } else if (event.target instanceof HTMLScriptElement) {
        console.error('Script loading error:', event.target.src)
      }
    }, true)
  }
})
