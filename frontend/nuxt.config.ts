// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: ["@pinia/nuxt", "@nuxt/ui"],
  css: ["~/assets/css/main.css"],

  colorMode: {
    preference: "system", // По умолчанию как в системе
    fallback: "light", // Если система не поддерживает, используем светлую
  },

  runtimeConfig: {
    public: {
      apiBaseUrl:
        process.env.NUXT_PUBLIC_API_BASE_URL || "http://localhost:3001",
      appName: process.env.NUXT_PUBLIC_APP_NAME || "Marketplace",
      appUrl: process.env.NUXT_PUBLIC_APP_URL || "http://localhost:3000",
    },
  },

  app: {
    head: {
      title: "Marketplace",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "description", content: "E-commerce Marketplace" },
      ],
    },
  },

  // TypeScript configuration
  typescript: {
    strict: true,
    typeCheck: false,
  },
});
