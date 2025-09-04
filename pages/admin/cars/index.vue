<template>
  <div>
    <v-row class="mb-6">
      <v-col cols="12" md="6">
        <h1 class="text-h4 font-weight-bold">
          Gerenciar Carros
        </h1>
        <p class="text-body-1 text-grey-darken-1">
          Gerencie o estoque de veículos
        </p>
      </v-col>
      <v-col cols="12" md="6" class="text-md-right">
        <v-btn
          color="primary"
          size="large"
          :to="'/admin/cars/new'"
        >
          <v-icon class="mr-2">mdi-plus</v-icon>
          Adicionar Carro
        </v-btn>
      </v-col>
    </v-row>

    <!-- Filters -->
    <v-card elevation="2" class="mb-6">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="filters.search"
              label="Buscar carro"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              clearable
              @input="debouncedSearch"
            ></v-text-field>
          </v-col>
          
          <v-col cols="12" md="3">
            <v-select
              v-model="filters.status"
              :items="statusOptions"
              label="Status"
              variant="outlined"
              clearable
              @update:model-value="applyFilters"
            ></v-select>
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
          
          <v-col cols="12" md="3" class="d-flex align-center">
            <v-btn
              color="primary"
              variant="outlined"
              @click="clearFilters"
            >
              Limpar Filtros
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Cars Table -->
    <v-card elevation="2">
      <v-data-table
        :headers="headers"
        :items="filteredCars"
        :loading="loading"
        :items-per-page="10"
        class="elevation-0"
      >
        <template v-slot:item.images="{ item }">
          <v-avatar
            v-if="item.images && item.images.length > 0"
            size="60"
            rounded
          >
            <v-img
              :src="item.images[0].image_url"
              :alt="`${item.brand} ${item.model}`"
            ></v-img>
          </v-avatar>
          <v-icon v-else size="40" color="grey-lighten-2">
            mdi-car
          </v-icon>
        </template>

        <template v-slot:item.brand_model="{ item }">
          <div>
            <div class="font-weight-bold">{{ item.brand }} {{ item.model }}</div>
            <div class="text-caption text-grey-darken-1">{{ item.year }}</div>
          </div>
        </template>

        <template v-slot:item.price="{ item }">
          <div class="font-weight-bold text-primary">
            {{ formatPrice(item.price) }}
          </div>
        </template>

        <template v-slot:item.status="{ item }">
          <v-chip
            :color="getStatusColor(item.status)"
            size="small"
          >
            {{ getStatusText(item.status) }}
          </v-chip>
        </template>

        <template v-slot:item.featured="{ item }">
          <v-icon
            :color="item.featured ? 'warning' : 'grey-lighten-2'"
            @click="toggleFeatured(item)"
          >
            {{ item.featured ? 'mdi-star' : 'mdi-star-outline' }}
          </v-icon>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn
            icon
            size="small"
            @click="viewCar(item)"
          >
            <v-icon>mdi-eye</v-icon>
          </v-btn>
          <v-btn
            icon
            size="small"
            @click="editCar(item)"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            icon
            size="small"
            color="error"
            @click="deleteCar(item)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Delete Confirmation Dialog -->
    <v-dialog
      v-model="deleteDialog"
      max-width="400"
    >
      <v-card>
        <v-card-title>
          Confirmar Exclusão
        </v-card-title>
        <v-card-text>
          Tem certeza que deseja excluir o carro 
          <strong>{{ carToDelete?.brand }} {{ carToDelete?.model }}</strong>?
          Esta ação não pode ser desfeita.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            @click="deleteDialog = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="error"
            @click="confirmDelete"
          >
            Excluir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
const carsStore = useCarsStore()

const loading = ref(false)
const cars = ref([])
const filteredCars = ref([])
const deleteDialog = ref(false)
const carToDelete = ref(null)

// Filters
const filters = ref({
  search: '',
  status: null,
  brand: null
})

const statusOptions = ref([
  { title: 'Disponível', value: 'available' },
  { title: 'Vendido', value: 'sold' },
  { title: 'Reservado', value: 'reserved' }
])

const brands = ref([
  'Audi', 'BMW', 'Chevrolet', 'Fiat', 'Ford', 'Honda', 'Hyundai',
  'Jeep', 'Mercedes-Benz', 'Nissan', 'Peugeot', 'Renault', 'Toyota', 'Volkswagen'
])

const headers = ref([
  { title: 'Imagem', key: 'images', sortable: false, width: '80px' },
  { title: 'Carro', key: 'brand_model', sortable: false },
  { title: 'Preço', key: 'price', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Destaque', key: 'featured', sortable: true },
  { title: 'Ações', key: 'actions', sortable: false, width: '120px' }
])

// Methods
const formatPrice = (price) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price)
}

const getStatusText = (status) => {
  const statuses = {
    available: 'Disponível',
    sold: 'Vendido',
    reserved: 'Reservado'
  }
  return statuses[status] || status
}

const getStatusColor = (status) => {
  const colors = {
    available: 'success',
    sold: 'error',
    reserved: 'warning'
  }
  return colors[status] || 'grey'
}

const debouncedSearch = useDebounceFn(() => {
  applyFilters()
}, 500)

const applyFilters = () => {
  let filtered = [...cars.value]
  
  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    filtered = filtered.filter(car => 
      car.brand.toLowerCase().includes(search) ||
      car.model.toLowerCase().includes(search)
    )
  }
  
  if (filters.value.status) {
    filtered = filtered.filter(car => car.status === filters.value.status)
  }
  
  if (filters.value.brand) {
    filtered = filtered.filter(car => car.brand === filters.value.brand)
  }
  
  filteredCars.value = filtered
}

const clearFilters = () => {
  filters.value = {
    search: '',
    status: null,
    brand: null
  }
  applyFilters()
}

const viewCar = (car) => {
  navigateTo(`/cars/${car.id}`)
}

const editCar = (car) => {
  navigateTo(`/admin/cars/${car.id}`)
}

const deleteCar = (car) => {
  carToDelete.value = car
  deleteDialog.value = true
}

const confirmDelete = async () => {
  if (carToDelete.value) {
    try {
      await carsStore.deleteCar(carToDelete.value.id)
      await loadCars()
      deleteDialog.value = false
      carToDelete.value = null
    } catch (error) {
      console.error('Erro ao excluir carro:', error)
    }
  }
}

const toggleFeatured = async (car) => {
  try {
    await carsStore.updateCar(car.id, { featured: !car.featured })
    await loadCars()
  } catch (error) {
    console.error('Erro ao atualizar destaque:', error)
  }
}

const loadCars = async () => {
  loading.value = true
  try {
    await carsStore.fetchCars()
    cars.value = carsStore.cars
    filteredCars.value = [...cars.value]
  } catch (error) {
    console.error('Erro ao carregar carros:', error)
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadCars()
})

// SEO
useHead({
  title: 'Gerenciar Carros - AutoShow Admin',
  meta: [
    { name: 'description', content: 'Gerencie o estoque de veículos da AutoShow' }
  ]
})
</script>
