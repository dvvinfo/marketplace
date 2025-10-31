/**
 * Утилита для обработки ошибок API
 * Преобразует технические ошибки в понятные пользовательские сообщения
 */

export interface ApiError {
  statusCode?: number;
  status?: number;
  message?: string;
  data?: any;
}

/**
 * Получить понятное сообщение об ошибке для пользователя
 */
export function getUserFriendlyError(error: ApiError, context?: string): string {
  console.error(`Error in ${context || 'unknown context'}:`, error);

  const statusCode = error.statusCode || error.status;

  // Специфичные сообщения по контексту
  if (context === 'login') {
    if (statusCode === 401) return 'Неверный email или пароль';
    if (statusCode === 400) return 'Пожалуйста, проверьте правильность заполнения полей';
    return 'Не удалось войти. Попробуйте позже';
  }

  if (context === 'register') {
    if (statusCode === 409) return 'Пользователь с таким email уже существует';
    if (statusCode === 400) return 'Пожалуйста, проверьте правильность заполнения полей';
    return 'Не удалось зарегистрироваться. Попробуйте позже';
  }

  if (context === 'profile') {
    if (statusCode === 400) return 'Пожалуйста, проверьте правильность заполнения полей';
    if (statusCode === 401) return 'Сессия истекла. Пожалуйста, войдите снова';
    if (statusCode === 403) return 'У вас нет прав для изменения этого профиля';
    if (statusCode === 413) return 'Изображение слишком большое. Попробуйте другое фото';
    return 'Не удалось обновить профиль. Попробуйте позже';
  }

  if (context === 'password') {
    if (statusCode === 400) return 'Неверный текущий пароль';
    if (statusCode === 401) return 'Сессия истекла. Пожалуйста, войдите снова';
    return 'Не удалось изменить пароль. Попробуйте позже';
  }

  if (context === 'order') {
    if (statusCode === 400) return 'Пожалуйста, проверьте правильность заполнения всех полей';
    if (statusCode === 401) return 'Сессия истекла. Пожалуйста, войдите снова';
    if (statusCode === 404) return 'Некоторые товары больше недоступны';
    if (statusCode === 409) return 'Недостаточно товара на складе';
    return 'Не удалось оформить заказ. Попробуйте снова';
  }

  if (context === 'promo') {
    if (statusCode === 404) return 'Промокод не найден';
    if (statusCode === 400) return 'Промокод недействителен или истек';
    if (statusCode === 410) return 'Промокод больше не действует';
    return 'Не удалось проверить промокод';
  }

  if (context === 'review') {
    if (statusCode === 409) return 'Вы уже оставили отзыв на этот товар';
    if (statusCode === 401) return 'Пожалуйста, войдите в аккаунт чтобы оставить отзыв';
    if (statusCode === 400) return 'Пожалуйста, заполните все поля корректно';
    return 'Не удалось отправить отзыв. Попробуйте позже';
  }

  if (context === 'cart') {
    if (statusCode === 404) return 'Товар не найден';
    if (statusCode === 409) return 'Недостаточно товара на складе';
    if (statusCode === 401) return 'Сессия истекла. Пожалуйста, войдите снова';
    return 'Не удалось обновить корзину. Попробуйте позже';
  }

  // Общие сообщения по кодам ошибок
  switch (statusCode) {
    case 400:
      return 'Неверные данные. Пожалуйста, проверьте правильность заполнения полей';
    case 401:
      return 'Сессия истекла. Пожалуйста, войдите снова';
    case 403:
      return 'У вас нет доступа к этому действию';
    case 404:
      return 'Запрашиваемый ресурс не найден';
    case 409:
      return 'Конфликт данных. Попробуйте обновить страницу';
    case 413:
      return 'Файл слишком большой';
    case 422:
      return 'Данные не прошли валидацию';
    case 429:
      return 'Слишком много запросов. Пожалуйста, подождите';
    case 500:
      return 'Ошибка сервера. Попробуйте позже';
    case 502:
      return 'Сервер временно недоступен';
    case 503:
      return 'Сервис временно недоступен. Попробуйте позже';
    default:
      return 'Произошла ошибка. Попробуйте позже';
  }
}

/**
 * Проверить, является ли ошибка сетевой (нет подключения)
 */
export function isNetworkError(error: any): boolean {
  return (
    !error.statusCode &&
    !error.status &&
    (error.message?.includes('fetch') ||
      error.message?.includes('network') ||
      error.message?.includes('Failed to fetch'))
  );
}

/**
 * Получить сообщение для сетевой ошибки
 */
export function getNetworkErrorMessage(): string {
  return 'Нет подключения к интернету. Проверьте соединение';
}
