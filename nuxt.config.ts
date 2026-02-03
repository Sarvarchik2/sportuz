// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  css: [
    'mapbox-gl/dist/mapbox-gl.css'
  ],
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      // Nuxt автоматически подставит сюда значение из NUXT_PUBLIC_MAPBOX_ACCESS_TOKEN
      mapboxAccessToken: ''
    }
  }
})
