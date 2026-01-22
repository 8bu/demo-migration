// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2025-01-22',

  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss'],

  // Disable SSR for Module Federation compatibility
  ssr: false,

  devServer: {
    port: 3000,
  },

  app: {
    head: {
      title: 'Shell App',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Nuxt 4 Shell Application' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },

  css: ['~/assets/css/main.css'],

  tailwindcss: {
    configPath: 'tailwind.config.ts',
    cssPath: '~/assets/css/main.css',
    viewer: true,
  },

  vite: {
    build: {
      target: 'esnext',
      minify: false, // Helps with debugging federation issues
      cssCodeSplit: false,
    },
    vue: {
      features: {
        propsDestructure: true,
      },
    },
    server: {
      proxy: {
        // Proxy legacy assets to the legacy dev server
        // This allows both apps to be accessed via localhost:3000
        '/_legacy/_nuxt': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
      },
    },
  },

  typescript: {
    strict: true,
    typeCheck: false, // Disable for now - requires vue-tsc
  },

  nitro: {
    preset: 'static',
  },
})
