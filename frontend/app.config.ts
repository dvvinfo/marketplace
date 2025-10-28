export default defineAppConfig({
  ui: {
    primary: 'purple',
    gray: 'neutral',
    
    // Настройки по умолчанию для инпутов
    input: {
      default: {
        size: 'xl',
      },
    },
    
    // Настройки по умолчанию для кнопок
    button: {
      default: {
        size: 'xl',
        color: 'primary',
        loadingIcon: 'i-heroicons-arrow-path-20-solid',
      },
      rounded: 'rounded-xl',
      font: 'font-semibold',
      size: {
        xl: 'text-lg px-6 py-3.5',
      },
      color: {
        primary: {
          solid: 'shadow-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200',
        },
      },
    },
  }
})
