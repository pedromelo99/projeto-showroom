<template>
  <div v-if="!loading">
    <!-- Car Details -->
    <v-container v-if="car" class="py-8">
      <v-row>
        <v-col cols="12" md="8">
          <!-- Image Gallery -->
          <v-card elevation="2" class="mb-6">
            <CarGallery :images="car.images" :car-name="`${car.brand} ${car.model}`" />
          </v-card>

          <!-- Car Information -->
          <v-card elevation="2" class="pa-6">
            <h1 class="text-h4 font-weight-bold mb-2">
              {{ car.brand }} {{ car.model }}
            </h1>
            
            <div class="d-flex flex-wrap gap-4 mb-4">
              <v-chip
                v-for="feature in getCarFeatures(car)"
                :key="feature"
                color="primary"
                variant="outlined"
              >
                {{ feature }}
              </v-chip>
            </div>

            <v-divider class="my-6"></v-divider>

            <h2 class="text-h5 font-weight-bold mb-4">Informações Técnicas</h2>
            
            <v-row>
              <v-col cols="12" md="6">
                <v-list density="compact">
                  <v-list-item>
                    <v-list-item-title>Ano</v-list-item-title>
                    <v-list-item-subtitle>{{ car.year }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Quilometragem</v-list-item-title>
                    <v-list-item-subtitle>{{ formatMileage(car.mileage) }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Combustível</v-list-item-title>
                    <v-list-item-subtitle>{{ getFuelTypeText(car.fuel_type) }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Câmbio</v-list-item-title>
                    <v-list-item-subtitle>{{ getTransmissionText(car.transmission) }}</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-col>
              
              <v-col cols="12" md="6">
                <v-list density="compact">
                  <v-list-item>
                    <v-list-item-title>Tipo</v-list-item-title>
                    <v-list-item-subtitle>{{ getBodyTypeText(car.body_type) }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Cor</v-list-item-title>
                    <v-list-item-subtitle>{{ car.color || 'N/A' }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Status</v-list-item-title>
                    <v-list-item-subtitle>
                      <v-chip
                        :color="getStatusColor(car.status)"
                        size="small"
                      >
                        {{ getStatusText(car.status) }}
                      </v-chip>
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>

            <v-divider class="my-6"></v-divider>

            <h2 class="text-h5 font-weight-bold mb-4">Descrição</h2>
            <p class="text-body-1">
              {{ car.description || 'Veículo em excelente estado de conservação, com manutenção em dia e documentação regularizada. Ideal para quem busca conforto, economia e confiabilidade.' }}
            </p>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <!-- Price Card -->
          <v-card elevation="4" class="pa-6 mb-6 sticky-card">
            <div class="text-center mb-6">
              <div class="text-h3 font-weight-bold text-primary mb-2">
                {{ formatPrice(car.price) }}
              </div>
              <p class="text-body-2 text-grey-darken-1">
                Preço à vista ou consulte condições de financiamento
              </p>
            </div>

            <v-btn
              color="primary"
              size="large"
              block
              class="mb-4"
              @click="contactAboutCar"
            >
              <v-icon class="mr-2">mdi-phone</v-icon>
              Falar com Vendedor
            </v-btn>

            <v-btn
              color="success"
              size="large"
              block
              class="mb-4"
              @click="simulateFinancing"
            >
              <v-icon class="mr-2">mdi-calculator</v-icon>
              Simular Financiamento
            </v-btn>

            <v-btn
              color="info"
              size="large"
              block
              variant="outlined"
              @click="scheduleTestDrive"
            >
              <v-icon class="mr-2">mdi-car-side</v-icon>
              Agendar Test Drive
            </v-btn>

            <v-divider class="my-6"></v-divider>

            <h3 class="text-h6 font-weight-bold mb-4">Por que comprar conosco?</h3>
            <v-list density="compact">
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="success" size="small">mdi-check</v-icon>
                </template>
                <v-list-item-title class="text-body-2">
                  Garantia de 12 meses
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="success" size="small">mdi-check</v-icon>
                </template>
                <v-list-item-title class="text-body-2">
                  Documentação regularizada
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="success" size="small">mdi-check</v-icon>
                </template>
                <v-list-item-title class="text-body-2">
                  Financiamento facilitado
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="success" size="small">mdi-check</v-icon>
                </template>
                <v-list-item-title class="text-body-2">
                  Suporte pós-venda
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>

          <!-- Contact Info -->
          <v-card elevation="2" class="pa-6">
            <h3 class="text-h6 font-weight-bold mb-4">Informações de Contato</h3>
            
            <div class="d-flex align-center mb-3">
              <v-icon class="mr-3" color="primary">mdi-phone</v-icon>
              <div>
                <div class="text-body-2 font-weight-bold">Telefone</div>
                <div class="text-body-2">(11) 99999-9999</div>
              </div>
            </div>
            
            <div class="d-flex align-center mb-3">
              <v-icon class="mr-3" color="primary">mdi-whatsapp</v-icon>
              <div>
                <div class="text-body-2 font-weight-bold">WhatsApp</div>
                <div class="text-body-2">(11) 99999-9999</div>
              </div>
            </div>
            
            <div class="d-flex align-center mb-3">
              <v-icon class="mr-3" color="primary">mdi-email</v-icon>
              <div>
                <div class="text-body-2 font-weight-bold">Email</div>
                <div class="text-body-2">contato@autoshow.com.br</div>
              </div>
            </div>
            
            <div class="d-flex align-center">
              <v-icon class="mr-3" color="primary">mdi-clock</v-icon>
              <div>
                <div class="text-body-2 font-weight-bold">Horário</div>
                <div class="text-body-2">Seg - Sex: 8h às 18h</div>
                <div class="text-body-2">Sáb: 8h às 12h</div>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Car Not Found -->
    <v-container v-else class="py-16">
      <v-row justify="center">
        <v-col cols="12" md="6" class="text-center">
          <v-icon size="64" color="grey-lighten-2" class="mb-4">
            mdi-car-off
          </v-icon>
          <h1 class="text-h4 mb-4">Carro não encontrado</h1>
          <p class="text-body-1 text-grey-darken-1 mb-6">
            O carro que você está procurando não foi encontrado ou pode ter sido removido.
          </p>
          <v-btn
            color="primary"
            size="large"
            :to="'/cars'"
          >
            Ver Todos os Carros
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>

  <!-- Loading State -->
  <v-container v-else class="py-16">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-skeleton-loader
          type="card"
          height="600"
        ></v-skeleton-loader>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const route = useRoute()
const carsStore = useCarsStore()

const loading = ref(true)
const car = ref(null)

// Methods
const formatPrice = (price) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price)
}

const formatMileage = (mileage) => {
  if (!mileage) return 'N/A'
  return `${mileage.toLocaleString('pt-BR')} km`
}

const getFuelTypeText = (fuelType) => {
  const fuelTypes = {
    gasoline: 'Gasolina',
    ethanol: 'Álcool',
    flex: 'Flex',
    diesel: 'Diesel',
    electric: 'Elétrico',
    hybrid: 'Híbrido'
  }
  return fuelTypes[fuelType] || fuelType
}

const getTransmissionText = (transmission) => {
  const transmissions = {
    manual: 'Manual',
    automatic: 'Automático',
    cvt: 'CVT'
  }
  return transmissions[transmission] || transmission
}

const getBodyTypeText = (bodyType) => {
  const bodyTypes = {
    sedan: 'Sedan',
    hatchback: 'Hatchback',
    suv: 'SUV',
    coupe: 'Cupê',
    convertible: 'Conversível',
    pickup: 'Pickup'
  }
  return bodyTypes[bodyType] || bodyType
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

const getCarFeatures = (car) => {
  const features = []
  
  if (car.transmission) {
    features.push(getTransmissionText(car.transmission))
  }
  
  if (car.body_type) {
    features.push(getBodyTypeText(car.body_type))
  }
  
  if (car.fuel_type) {
    features.push(getFuelTypeText(car.fuel_type))
  }
  
  if (car.color) {
    features.push(car.color)
  }
  
  return features
}

const contactAboutCar = () => {
  const carName = `${car.value.brand} ${car.value.model}`
  navigateTo(`/contact?car=${encodeURIComponent(carName)}`)
}

const simulateFinancing = () => {
  // Implementar modal de simulação de financiamento
  console.log('Simular financiamento para:', car.value.id)
}

const scheduleTestDrive = () => {
  // Implementar modal de agendamento de test drive
  console.log('Agendar test drive para:', car.value.id)
}

// Lifecycle
onMounted(async () => {
  try {
    const carId = route.params.id
    await carsStore.fetchCarById(carId)
    car.value = carsStore.currentCar
  } catch (error) {
    console.error('Erro ao carregar carro:', error)
  } finally {
    loading.value = false
  }
})

// SEO
useHead(() => ({
  title: car.value ? `${car.value.brand} ${car.value.model} - AutoShow` : 'Carro não encontrado - AutoShow',
  meta: [
    { 
      name: 'description', 
      content: car.value 
        ? `Confira o ${car.value.brand} ${car.value.model} ${car.value.year} por ${formatPrice(car.value.price)}. Veículo em excelente estado.` 
        : 'Carro não encontrado'
    }
  ]
}))
</script>

<style scoped>
.sticky-card {
  position: sticky;
  top: 100px;
}
</style>
