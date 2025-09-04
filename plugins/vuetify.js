import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import 'vuetify/styles'

export default defineNuxtPlugin((nuxtApp) => {
    const vuetify = createVuetify({
        components,
        directives,
        icons: {
            defaultSet: 'mdi',
            aliases,
            sets: {
                mdi,
            },
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
        },
        defaults: {
            VBtn: {
                style: 'text-transform: none;'
            },
            VCard: {
                elevation: 2
            }
        }
    })

    nuxtApp.vueApp.use(vuetify)
})
