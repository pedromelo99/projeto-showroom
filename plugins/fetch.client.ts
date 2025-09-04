export default defineNuxtPlugin(() => {
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
            } catch (_e) {
                // ignore
            }
        }
    })

    // substitui o $fetch global por uma instância com baseURL e header automático
    // atenção: apenas em cliente
    // @ts-ignore
    globalThis.$fetch = apiFetch
})


