export default defineNuxtConfig({
    devtools: { enabled: true },
    modules: [
        '@nuxtjs/axios',
        '@pinia/nuxt',
        '@nuxtjs/pwa',
        '@nuxtjs/vuetify'
    ],
    css: ['~/assets/css/main.css'],
    vuetify: {
        theme: {
            defaultTheme: 'light',
            themes: {
                light: {
                    colors: {
                        primary: '#1e3c72',
                        secondary: '#2a5298',
                        accent: '#ffd700',
                        error: '#f44336',
                        warning: '#ff9800',
                        info: '#2196f3',
                        success: '#4caf50'
                    }
                }
            }
        }
    },
    axios: {
        baseURL: process.env.API_BASE_URL || 'http://localhost:3001/api'
    },
    runtimeConfig: {
        public: {
            apiBase: process.env.API_BASE_URL || 'http://localhost:3001/api'
        }
    },
    ssr: true,
    nitro: {
        prerender: {
            routes: ['/']
        }
    }
})
