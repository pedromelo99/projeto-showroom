export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig()

    const apiFetch = $fetch.create({
        baseURL: config.public.apiBase,
        onRequest({ options }) {
            try {
                const token = localStorage.getItem('auth_token')
                if (token) {
                    options.headers = {
                        ...(options.headers || {}),
                        Authorization: `Bearer ${token}`
                    }
                }
            } catch (_e) { }
        }
    })

    // disponibiliza client dedicado sem interferir no $fetch interno do Nuxt
    nuxtApp.provide('apiFetch', apiFetch)
})


