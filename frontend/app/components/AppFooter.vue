<template>
  <footer class="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white mt-16">
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 class="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            🛒 Маркетплейс
          </h3>
          <p class="text-gray-400">
            Ваш универсальный магазин для всего, что вам нужно.
          </p>
        </div>

        <div>
          <h4 class="font-semibold mb-4">Быстрые ссылки</h4>
          <ul class="space-y-2 text-gray-400">
            <li><NuxtLink to="/" class="hover:text-white transition-colors">Товары</NuxtLink></li>
            <li><NuxtLink to="/cart" class="hover:text-white transition-colors">Корзина</NuxtLink></li>
            <li><NuxtLink to="/login" class="hover:text-white transition-colors">Войти</NuxtLink></li>
          </ul>
        </div>

        <div>
          <h4 class="font-semibold mb-4">Контакты</h4>
          <p class="text-gray-400">
            Email: support@marketplace.com<br>
            Телефон: +7 (999) 123-45-67
          </p>
        </div>
      </div>

      <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
        <p>&copy; {{ new Date().getFullYear() }} Маркетплейс. Все права защищены.</p>
      </div>
    </div>
  </footer>
</template>
