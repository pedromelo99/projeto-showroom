import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

export default defineNuxtPlugin((nuxtApp) => {
    const vuetify = createVuetify({
        icons: {
            defaultSet: 'mdi',
            aliases,
            sets: { mdi }
        },
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
    })

    nuxtApp.vueApp.use(vuetify)
})


