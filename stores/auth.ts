export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const token = ref(null)
    const isAuthenticated = computed(() => !!user.value && !!token.value)

    const login = async (credentials: any) => {
        try {
            const config = useRuntimeConfig()
            const { data } = await $fetch(`${config.public.apiBase}/auth/login`, {
                method: 'POST',
                body: credentials
            })

            user.value = (data as any).user
            token.value = (data as any).token

            if (process.client) {
                localStorage.setItem('auth_token', (data as any).token)
                localStorage.setItem('user', JSON.stringify((data as any).user))
            }

            return data
        } catch (error: any) {
            throw new Error(error.data?.message || 'Erro no login')
        }
    }

    const register = async (userData: any) => {
        try {
            const config = useRuntimeConfig()
            const { data } = await $fetch(`${config.public.apiBase}/auth/register`, {
                method: 'POST',
                body: userData
            })

            user.value = (data as any).user
            token.value = (data as any).token

            if (process.client) {
                localStorage.setItem('auth_token', (data as any).token)
                localStorage.setItem('user', JSON.stringify((data as any).user))
            }

            return data
        } catch (error: any) {
            throw new Error(error.data?.message || 'Erro no cadastro')
        }
    }

    const logout = async () => {
        try {
            if (token.value) {
                const config = useRuntimeConfig()
                await $fetch(`${config.public.apiBase}/auth/logout`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token.value}`
                    }
                })
            }
        } catch (error) {
            console.error('Erro no logout:', error)
        } finally {
            user.value = null
            token.value = null

            if (process.client) {
                localStorage.removeItem('auth_token')
                localStorage.removeItem('user')
            }
        }
    }

    const fetchUser = async () => {
        try {
            if (!token.value) return

            const config = useRuntimeConfig()
            const { data } = await $fetch(`${config.public.apiBase}/auth/me`, {
                headers: {
                    Authorization: `Bearer ${token.value}`
                }
            })

            user.value = (data as any).user
            return (data as any).user
        } catch (error) {
            console.error('Erro ao buscar usuário:', error)
            await logout()
        }
    }

    const initializeAuth = () => {
        if (process.client) {
            const storedToken = localStorage.getItem('auth_token')
            const storedUser = localStorage.getItem('user')

            if (storedToken && storedUser) {
                token.value = storedToken
                user.value = JSON.parse(storedUser)
            }
        }
    }

    return {
        user: readonly(user),
        token: readonly(token),
        isAuthenticated,
        login,
        register,
        logout,
        fetchUser,
        initializeAuth
    }
})


