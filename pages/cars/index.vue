<template>
  <div>
    <!-- Header Section -->
    <v-container fluid class="pa-0">
      <v-img
        src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        height="300"
        cover
        class="d-flex align-center"
      >
        <v-overlay
          :model-value="true"
          class="d-flex align-center justify-center"
        >
          <v-container>
            <v-row justify="center">
              <v-col cols="12" md="8" class="text-center">
                <h1 class="text-h3 text-md-h2 font-weight-bold text-white mb-4">
                  Nossa Frota
                </h1>
                <p class="text-h6 text-white">
                  Encontre o carro perfeito para você
                </p>
              </v-col>
            </v-row>
          </v-container>
        </v-overlay>
      </v-img>
    </v-container>

    <!-- Filters and Search -->
    <v-container class="py-8">
      <v-row>
        <v-col cols="12">
          <v-card elevation="2" class="pa-6">
            <h3 class="text-h6 mb-4">Filtros de Busca</h3>
            
            <v-row>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="filters.search"
                  label="Buscar por marca ou modelo"
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  clearable
                  @input="debouncedSearch"
                ></v-text-field>
              </v-col>
              
              <v-col cols="12" md="3">
                <v-select
                  v-model="filters.brand"
                  :items="brands"
                  label="Marca"
                  variant="outlined"
                  clearable
                  @update:model-value="applyFilters"
                ></v-select>
              </v-col>
              
              <v-col cols="12" md="3">
                <v-select
                  v-model="filters.fuel_type"
                  :items="fuelTypes"
                  label="Combustível"
                  variant="outlined"
                  clearable
                  @update:model-value="applyFilters"
                ></v-select>
              </v-col>
              
              <v-col cols="12" md="3">
                <v-select
                  v-model="filters.body_type"
                  :items="bodyTypes"
                  label="Tipo"
                  variant="outlined"
                  clearable
                  @update:model-value="applyFilters"
                ></v-select>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="3">
                <v-range-slider
                  v-model="priceRange"
                  :min="0"
                  :max="500000"
                  :step="10000"
                  label="Faixa de Preço"
                  thumb-label
                  @update:model-value="applyFilters"
                >
                  <template v-slot:thumb-label="{ modelValue }">
                    {{ formatPrice(modelValue) }}
                  </template>
                </v-range-slider>
              </v-col>
              
              <v-col cols="12" md="3">
                <v-range-slider
                  v-model="yearRange"
                  :min="2010"
                  :max="2024"
                  :step="1"
                  label="Ano"
                  thumb-label
                  @update:model-value="applyFilters"
                ></v-range-slider>
              </v-col>
              
              <v-col cols="12" md="3">
                <v-select
                  v-model="filters.transmission"
                  :items="transmissions"
                  label="Câmbio"
                  variant="outlined"
                  clearable
                  @update:model-value="applyFilters"
                ></v-select>
              </v-col>
              
              <v-col cols="12" md="3" class="d-flex align-center">
                <v-btn
                  color="primary"
                  variant="flat"
                  @click="clearFilters"
                >
                  Limpar Filtros
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Results Section -->
    <v-container class="pb-16">
      <v-row>
        <v-col cols="12" class="d-flex justify-space-between align-center mb-6">
          <div>
            <h2 class="text-h5">
              {{ filteredCars.length }} carro(s) encontrado(s)
            </h2>
            <p class="text-body-2 text-grey-darken-1">
              {{ getFilterDescription() }}
            </p>
          </div>
          
          <v-select
            v-model="sortBy"
            :items="sortOptions"
            label="Ordenar por"
            variant="outlined"
            style="max-width: 200px;"
            @update:model-value="applySorting"
          ></v-select>
        </v-col>
      </v-row>

      <!-- Loading State -->
      <v-row v-if="loading">
        <v-col
          v-for="n in 6"
          :key="n"
          cols="12"
          md="4"
          lg="3"
        >
          <v-skeleton-loader
            type="card"
            height="400"
          ></v-skeleton-loader>
        </v-col>
      </v-row>

      <!-- No Results -->
      <v-row v-else-if="filteredCars.length === 0">
        <v-col cols="12" class="text-center py-16">
          <v-icon size="64" color="grey-lighten-2" class="mb-4">
            mdi-car-off
          </v-icon>
          <h3 class="text-h5 mb-2">Nenhum carro encontrado</h3>
          <p class="text-body-1 text-grey-darken-1 mb-4">
            Tente ajustar os filtros de busca
          </p>
          <v-btn
            color="primary"
            @click="clearFilters"
          >
            Limpar Filtros
          </v-btn>
        </v-col>
      </v-row>

      <!-- Cars Grid -->
      <v-row v-else>
        <v-col
          v-for="car in paginatedCars"
          :key="car.id"
          cols="12"
          md="6"
          lg="4"
        >
          <CarCard
            :car="car"
            @view-details="viewCarDetails"
            @contact="contactAboutCar"
          />
        </v-col>
      </v-row>

      <!-- Pagination -->
      <v-row v-if="totalPages > 1">
        <v-col cols="12" class="d-flex justify-center">
          <v-pagination
            v-model="currentPage"
            :length="totalPages"
            @update:model-value="loadPage"
          ></v-pagination>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
const carsStore = useCarsStore()

const loading = ref(false)
const cars = ref([])
const filteredCars = ref([])
const currentPage = ref(1)
const itemsPerPage = 12

// Filters
const filters = ref({
  search: '',
  brand: null,
  fuel_type: null,
  body_type: null,
  transmission: null
})

const priceRange = ref([0, 500000])
const yearRange = ref([2010, 2024])
const sortBy = ref('price_asc')

// Options
const brands = ref([
  'Audi', 'BMW', 'Chevrolet', 'Fiat', 'Ford', 'Honda', 'Hyundai',
  'Jeep', 'Mercedes-Benz', 'Nissan', 'Peugeot', 'Renault', 'Toyota', 'Volkswagen'
])

const fuelTypes = ref([
  { title: 'Gasolina', value: 'gasoline' },
  { title: 'Álcool', value: 'ethanol' },
  { title: 'Flex', value: 'flex' },
  { title: 'Diesel', value: 'diesel' },
  { title: 'Elétrico', value: 'electric' },
  { title: 'Híbrido', value: 'hybrid' }
])

const bodyTypes = ref([
  { title: 'Sedan', value: 'sedan' },
  { title: 'Hatchback', value: 'hatchback' },
  { title: 'SUV', value: 'suv' },
  { title: 'Cupê', value: 'coupe' },
  { title: 'Conversível', value: 'convertible' },
  { title: 'Pickup', value: 'pickup' }
])

const transmissions = ref([
  { title: 'Manual', value: 'manual' },
  { title: 'Automático', value: 'automatic' },
  { title: 'CVT', value: 'cvt' }
])

const sortOptions = ref([
  { title: 'Preço: Menor para Maior', value: 'price_asc' },
  { title: 'Preço: Maior para Menor', value: 'price_desc' },
  { title: 'Ano: Mais Recente', value: 'year_desc' },
  { title: 'Ano: Mais Antigo', value: 'year_asc' },
  { title: 'Quilometragem: Menor', value: 'mileage_asc' },
  { title: 'Quilometragem: Maior', value: 'mileage_desc' }
])

// Computed
const totalPages = computed(() => Math.ceil(filteredCars.value.length / itemsPerPage))

const paginatedCars = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredCars.value.slice(start, end)
})

// Methods
const formatPrice = (price) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  }).format(price)
}

const getFilterDescription = () => {
  const descriptions = []
  
  if (filters.value.brand) {
    descriptions.push(`Marca: ${filters.value.brand}`)
  }
  
  if (filters.value.fuel_type) {
    const fuelType = fuelTypes.value.find(f => f.value === filters.value.fuel_type)
    descriptions.push(`Combustível: ${fuelType?.title}`)
  }
  
  if (filters.value.body_type) {
    const bodyType = bodyTypes.value.find(b => b.value === filters.value.body_type)
    descriptions.push(`Tipo: ${bodyType?.title}`)
  }
  
  if (priceRange.value[0] > 0 || priceRange.value[1] < 500000) {
    descriptions.push(`Preço: ${formatPrice(priceRange.value[0])} - ${formatPrice(priceRange.value[1])}`)
  }
  
  if (yearRange.value[0] > 2010 || yearRange.value[1] < 2024) {
    descriptions.push(`Ano: ${yearRange.value[0]} - ${yearRange.value[1]}`)
  }
  
  return descriptions.length > 0 ? descriptions.join(' • ') : 'Todos os carros'
}

const debouncedSearch = useDebounceFn(() => {
  applyFilters()
}, 500)

const applyFilters = () => {
  let filtered = [...cars.value]
  
  // Search filter
  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    filtered = filtered.filter(car => 
      car.brand.toLowerCase().includes(search) ||
      car.model.toLowerCase().includes(search)
    )
  }
  
  // Brand filter
  if (filters.value.brand) {
    filtered = filtered.filter(car => car.brand === filters.value.brand)
  }
  
  // Fuel type filter
  if (filters.value.fuel_type) {
    filtered = filtered.filter(car => car.fuel_type === filters.value.fuel_type)
  }
  
  // Body type filter
  if (filters.value.body_type) {
    filtered = filtered.filter(car => car.body_type === filters.value.body_type)
  }
  
  // Transmission filter
  if (filters.value.transmission) {
    filtered = filtered.filter(car => car.transmission === filters.value.transmission)
  }
  
  // Price range filter
  filtered = filtered.filter(car => 
    car.price >= priceRange.value[0] && car.price <= priceRange.value[1]
  )
  
  // Year range filter
  filtered = filtered.filter(car => 
    car.year >= yearRange.value[0] && car.year <= yearRange.value[1]
  )
  
  filteredCars.value = filtered
  currentPage.value = 1
  applySorting()
}

const applySorting = () => {
  const sorted = [...filteredCars.value]
  
  switch (sortBy.value) {
    case 'price_asc':
      sorted.sort((a, b) => a.price - b.price)
      break
    case 'price_desc':
      sorted.sort((a, b) => b.price - a.price)
      break
    case 'year_desc':
      sorted.sort((a, b) => b.year - a.year)
      break
    case 'year_asc':
      sorted.sort((a, b) => a.year - b.year)
      break
    case 'mileage_asc':
      sorted.sort((a, b) => (a.mileage || 0) - (b.mileage || 0))
      break
    case 'mileage_desc':
      sorted.sort((a, b) => (b.mileage || 0) - (a.mileage || 0))
      break
  }
  
  filteredCars.value = sorted
}

const clearFilters = () => {
  filters.value = {
    search: '',
    brand: null,
    fuel_type: null,
    body_type: null,
    transmission: null
  }
  priceRange.value = [0, 500000]
  yearRange.value = [2010, 2024]
  sortBy.value = 'price_asc'
  applyFilters()
}

const loadPage = (page) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const viewCarDetails = (carId) => {
  navigateTo(`/cars/${carId}`)
}

const contactAboutCar = (car) => {
  navigateTo(`/contact?car=${encodeURIComponent(`${car.brand} ${car.model}`)}`)
}

// Lifecycle
onMounted(async () => {
  loading.value = true
  try {
    await carsStore.fetchCars()
    cars.value = carsStore.cars
    filteredCars.value = [...cars.value]
    applySorting()
  } catch (error) {
    console.error('Erro ao carregar carros:', error)
  } finally {
    loading.value = false
  }
})

// SEO
useHead({
  title: 'Carros - AutoShow',
  meta: [
    { name: 'description', content: 'Encontre o carro perfeito para você. Nossa frota conta com veículos novos e seminovos das melhores marcas.' }
  ]
})
</script>
