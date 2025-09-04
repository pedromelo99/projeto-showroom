export default defineNuxtRouteMiddleware((to) => {
    const authStore = useAuthStore()

    // Initialize auth if not already done
    if (process.client && !authStore.isAuthenticated) {
        authStore.initializeAuth()
    }

    // Check if route requires authentication
    if (to.path.startsWith('/admin') || to.path.startsWith('/auth')) {
        if (!authStore.isAuthenticated) {
            return navigateTo('/auth/login')
        }
    }

    // Check if user is trying to access admin routes without admin privileges
    if (to.path.startsWith('/admin')) {
        if (authStore.user?.user_type !== 'admin') {
            throw createError({
                statusCode: 403,
                statusMessage: 'Acesso negado. Apenas administradores podem acessar esta área.'
            })
        }
    }

    // Redirect authenticated users away from auth pages
    if (to.path.startsWith('/auth') && authStore.isAuthenticated) {
        if (authStore.user?.user_type === 'admin') {
            return navigateTo('/admin')
        } else {
            return navigateTo('/')
        }
    }
})
