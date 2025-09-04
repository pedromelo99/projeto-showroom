export const useCarsStore = defineStore('cars', () => {
    const cars = ref([])
    const currentCar = ref(null)
    const featuredCars = ref([])
    const loading = ref(false)

    const fetchCars = async (params = {}) => {
        loading.value = true
        try {
            const { data } = await $fetch('/api/cars', {
                query: params
            })

            cars.value = data.cars || data
            return data
        } catch (error) {
            console.error('Erro ao buscar carros:', error)
            throw error
        } finally {
            loading.value = false
        }
    }

    const fetchCarById = async (id) => {
        loading.value = true
        try {
            const { data } = await $fetch(`/api/cars/${id}`)

            currentCar.value = data.car || data
            return data
        } catch (error) {
            console.error('Erro ao buscar carro:', error)
            throw error
        } finally {
            loading.value = false
        }
    }

    const fetchFeaturedCars = async () => {
        try {
            const { data } = await $fetch('/api/cars', {
                query: { featured: true, limit: 6 }
            })

            featuredCars.value = data.cars || data
            return data
        } catch (error) {
            console.error('Erro ao buscar carros em destaque:', error)
            throw error
        }
    }

    const createCar = async (carData) => {
        try {
            const { data } = await $fetch('/api/cars', {
                method: 'POST',
                body: carData
            })

            cars.value.unshift(data.car || data)
            return data
        } catch (error) {
            console.error('Erro ao criar carro:', error)
            throw error
        }
    }

    const updateCar = async (id, carData) => {
        try {
            const { data } = await $fetch(`/api/cars/${id}`, {
                method: 'PUT',
                body: carData
            })

            const index = cars.value.findIndex(car => car.id === id)
            if (index !== -1) {
                cars.value[index] = { ...cars.value[index], ...data.car }
            }

            if (currentCar.value && currentCar.value.id === id) {
                currentCar.value = { ...currentCar.value, ...data.car }
            }

            return data
        } catch (error) {
            console.error('Erro ao atualizar carro:', error)
            throw error
        }
    }

    const deleteCar = async (id) => {
        try {
            await $fetch(`/api/cars/${id}`, {
                method: 'DELETE'
            })

            cars.value = cars.value.filter(car => car.id !== id)

            if (currentCar.value && currentCar.value.id === id) {
                currentCar.value = null
            }

            return true
        } catch (error) {
            console.error('Erro ao excluir carro:', error)
            throw error
        }
    }

    const uploadCarImages = async (carId, images) => {
        try {
            const formData = new FormData()
            images.forEach((image, index) => {
                formData.append(`images`, image)
            })

            const { data } = await $fetch(`/api/cars/${carId}/images`, {
                method: 'POST',
                body: formData
            })

            return data
        } catch (error) {
            console.error('Erro ao fazer upload das imagens:', error)
            throw error
        }
    }

    const searchCars = async (query) => {
        try {
            const { data } = await $fetch('/api/search/cars', {
                query: { q: query }
            })

            return data.cars || data
        } catch (error) {
            console.error('Erro na busca de carros:', error)
            throw error
        }
    }

    const getCarById = (id) => {
        return cars.value.find(car => car.id === id)
    }

    const getCarsByBrand = (brand) => {
        return cars.value.filter(car => car.brand === brand)
    }

    const getCarsByStatus = (status) => {
        return cars.value.filter(car => car.status === status)
    }

    const getFeaturedCars = () => {
        return cars.value.filter(car => car.featured)
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
        searchCars,
        getCarById,
        getCarsByBrand,
        getCarsByStatus,
        getFeaturedCars
    }
})
