export default defineNuxtConfig({
    devtools: { enabled: true },
    modules: [
        '@pinia/nuxt'
    ],
    css: [
        '~/assets/css/main.css',
        'vuetify/styles'
    ],
    build: {
        transpile: ['vuetify']
    },
    vite: {
        ssr: {
            noExternal: ['vuetify']
        },
        plugins: [
            // @ts-ignore
            import('vite-plugin-vuetify').then(mod => mod.default({ autoImport: true }))
        ]
    },
    runtimeConfig: {
        public: {
            apiBase: process.env.API_BASE_URL || 'http://localhost:4000/api'
        }
    },
    ssr: true,
    nitro: {
        prerender: {
            routes: ['/']
        }
    }
})
