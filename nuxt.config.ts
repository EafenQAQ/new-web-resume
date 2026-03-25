// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/eslint", "@nuxt/ui", "nuxt-icon"],
  css: ["./app/assets/css/main.css"],

  // Runtime config for environment variables
  runtimeConfig: {
    // 服务端环境变量 (Netlify Function 使用)
    arkApiKey: process.env.RESUME_ARK_API_KEY,
    arkModelId: process.env.RESUME_ARK_MODEL_ID,
    // 客户端环境变量 (开发环境使用)
    public: {
      isNetlifyDev: process.env.NETLIFY_DEV === 'true' || process.env.NETLIFY === 'true',
      arkApiKey: process.env.NUXT_PUBLIC_RESUME_ARK_API_KEY,
      arkModelId: process.env.NUXT_PUBLIC_RESUME_ARK_MODEL_ID,
    },
  },

  // App configuration
  app: {
    head: {
      htmlAttrs: {
        lang: "zh-CN",
      },
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { charset: "utf-8" },
      ],
      link: [
        {
          rel: "preconnect",
          href: "https://fonts.googleapis.com",
        },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Noto+Sans+SC:wght@300;400;500;700&display=swap",
        },
        {
          rel: "icon",
          type: "image/x-icon",
          href: "/favicon.ico",
        }
      ],
    },
  },
});
