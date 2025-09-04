export const useCarsStore = defineStore('cars', () => {
    const cars = ref<any[]>([])
    const currentCar = ref<any | null>(null)
    const featuredCars = ref<any[]>([])
    const loading = ref<boolean>(false)

    const fetchCars = async (params: any = {}) => {
        loading.value = true
        try {
            const config = useRuntimeConfig()
            const { data } = await $fetch(`${config.public.apiBase}/cars`, { query: params })
            cars.value = (data as any).items || (data as any).cars || (data as any)
            return data
        } finally {
            loading.value = false
        }
    }

    const fetchCarById = async (id: number | string) => {
        loading.value = true
        try {
            const config = useRuntimeConfig()
            const { data } = await $fetch(`${config.public.apiBase}/cars/${id}`)
            currentCar.value = data as any
            return data
        } finally {
            loading.value = false
        }
    }

    const fetchFeaturedCars = async () => {
        const config = useRuntimeConfig()
        const { data } = await $fetch(`${config.public.apiBase}/cars`, { query: { featured: true, limit: 6 } })
        featuredCars.value = (data as any).items || (data as any).cars || (data as any)
        return data
    }

    const createCar = async (carData: any) => {
        const config = useRuntimeConfig()
        const { data } = await $fetch(`${config.public.apiBase}/cars`, { method: 'POST', body: carData })
        cars.value.unshift(data as any)
        return data
    }

    const updateCar = async (id: number | string, carData: any) => {
        const config = useRuntimeConfig()
        const { data } = await $fetch(`${config.public.apiBase}/cars/${id}`, { method: 'PUT', body: carData })
        const index = cars.value.findIndex(c => c.id === id)
        if (index !== -1) cars.value[index] = { ...cars.value[index], ...(data as any) }
        if (currentCar.value && currentCar.value.id === id) currentCar.value = { ...currentCar.value, ...(data as any) }
        return data
    }

    const deleteCar = async (id: number | string) => {
        const config = useRuntimeConfig()
        await $fetch(`${config.public.apiBase}/cars/${id}`, { method: 'DELETE' })
        cars.value = cars.value.filter(c => c.id !== id)
        if (currentCar.value && currentCar.value.id === id) currentCar.value = null
        return true
    }

    const uploadCarImages = async (carId: number | string, images: File[]) => {
        const formData = new FormData()
        images.forEach((img) => formData.append('images', img))
        const config = useRuntimeConfig()
        const { data } = await $fetch(`${config.public.apiBase}/cars/${carId}/images`, { method: 'POST', body: formData })
        return data
    }

    const searchCars = async (query: string) => {
        const config = useRuntimeConfig()
        const { data } = await $fetch(`${config.public.apiBase}/cars`, { query: { q: query } })
        return (data as any).items || (data as any)
    }

    return {
        cars: readonly(cars),
        currentCar: readonly(currentCar),
        featuredCars: readonly(featuredCars),
        loading: readonly(loading),
        fetchCars,
        fetchCarById,
        fetchFeaturedCars,
        createCar,
        updateCar,
        deleteCar,
        uploadCarImages,
        searchCars
    }
})


