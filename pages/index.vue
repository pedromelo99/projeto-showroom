<template>
  <div>
    <!-- Hero Section -->
    <v-container fluid class="pa-0">
      <v-row no-gutters>
        <v-col cols="12">
          <v-img
            src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            height="600"
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
                    <h1 class="text-h2 text-md-h1 font-weight-bold text-white mb-4">
                      Encontre o Carro dos Seus Sonhos
                    </h1>
                    <p class="text-h6 text-md-h5 text-white mb-8">
                      Descubra nossa seleção premium de veículos novos e seminovos. 
                      Qualidade, confiança e excelência em cada detalhe.
                    </p>
                    <v-btn
                      color="accent"
                      size="x-large"
                      class="mr-4"
                      :to="'/cars'"
                    >
                      Ver Carros
                    </v-btn>
                    <v-btn
                      variant="outlined"
                      color="white"
                      size="x-large"
                      :to="'/contact'"
                    >
                      Contato
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-overlay>
          </v-img>
        </v-col>
      </v-row>
    </v-container>

    <!-- Features Section -->
    <v-container class="py-16">
      <v-row>
        <v-col cols="12" class="text-center mb-12">
          <h2 class="text-h3 text-md-h2 font-weight-bold mb-4">
            Por Que Escolher a AutoShow?
          </h2>
          <p class="text-h6 text-grey-darken-1">
            Oferecemos os melhores serviços e condições para sua compra
          </p>
        </v-col>
      </v-row>

      <v-row>
        <v-col
          v-for="feature in features"
          :key="feature.title"
          cols="12"
          md="4"
          class="mb-6"
        >
          <v-card
            class="h-100 text-center pa-6"
            elevation="4"
            hover
          >
            <v-icon
              :color="feature.color"
              size="64"
              class="mb-4"
            >
              {{ feature.icon }}
            </v-icon>
            <h3 class="text-h5 font-weight-bold mb-4">
              {{ feature.title }}
            </h3>
            <p class="text-body-1 text-grey-darken-1">
              {{ feature.description }}
            </p>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Featured Cars Section -->
    <v-container fluid class="py-16 bg-grey-lighten-5">
      <v-container>
        <v-row>
          <v-col cols="12" class="text-center mb-12">
            <h2 class="text-h3 text-md-h2 font-weight-bold mb-4">
              Carros em Destaque
            </h2>
            <p class="text-h6 text-grey-darken-1">
              Confira nossa seleção especial de veículos
            </p>
          </v-col>
        </v-row>

        <v-row v-if="loading">
          <v-col
            v-for="n in 3"
            :key="n"
            cols="12"
            md="4"
          >
            <v-skeleton-loader
              type="card"
              height="400"
            ></v-skeleton-loader>
          </v-col>
        </v-row>

        <v-row v-else>
          <v-col
            v-for="car in featuredCars"
            :key="car.id"
            cols="12"
            md="4"
          >
            <CarCard
              :car="car"
              @view-details="viewCarDetails"
              @contact="contactAboutCar"
            />
          </v-col>
        </v-row>

        <v-row v-if="!loading">
          <v-col cols="12" class="text-center mt-8">
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
    </v-container>

    <!-- Stats Section -->
    <v-container class="py-16">
      <v-row>
        <v-col
          v-for="stat in stats"
          :key="stat.title"
          cols="6"
          md="3"
          class="text-center"
        >
          <div class="mb-4">
            <v-icon
              :color="stat.color"
              size="48"
            >
              {{ stat.icon }}
            </v-icon>
          </div>
          <h3 class="text-h3 font-weight-bold mb-2">
            {{ stat.value }}
          </h3>
          <p class="text-body-1 text-grey-darken-1">
            {{ stat.title }}
          </p>
        </v-col>
      </v-row>
    </v-container>

    <!-- CTA Section -->
    <v-container fluid class="py-16 bg-primary">
      <v-container>
        <v-row justify="center">
          <v-col cols="12" md="8" class="text-center">
            <h2 class="text-h3 text-md-h2 font-weight-bold text-white mb-4">
              Pronto para Encontrar Seu Próximo Carro?
            </h2>
            <p class="text-h6 text-white mb-8">
              Entre em contato conosco e descubra as melhores condições do mercado
            </p>
            <v-btn
              color="accent"
              size="x-large"
              class="mr-4"
              :to="'/cars'"
            >
              Ver Carros
            </v-btn>
            <v-btn
              variant="outlined"
              color="white"
              size="x-large"
              :to="'/contact'"
            >
              Falar com Vendedor
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-container>
  </div>
</template>

<script setup>
const carsStore = useCarsStore()

const loading = ref(true)
const featuredCars = ref([])

const features = [
  {
    title: 'Garantia Total',
    description: 'Oferecemos garantia estendida em todos os nossos veículos, garantindo sua tranquilidade e satisfação.',
    icon: 'mdi-shield-check',
    color: 'success'
  },
  {
    title: 'Manutenção Especializada',
    description: 'Nossa equipe técnica especializada oferece serviços de manutenção de alta qualidade para seu veículo.',
    icon: 'mdi-wrench',
    color: 'info'
  },
  {
    title: 'Financiamento Flexível',
    description: 'Condições especiais de financiamento com as melhores taxas do mercado para facilitar sua compra.',
    icon: 'mdi-credit-card',
    color: 'warning'
  }
]

const stats = [
  { title: 'Carros Vendidos', value: '500+', icon: 'mdi-car', color: 'primary' },
  { title: 'Clientes Satisfeitos', value: '1000+', icon: 'mdi-account-heart', color: 'success' },
  { title: 'Anos de Experiência', value: '10+', icon: 'mdi-calendar', color: 'info' },
  { title: 'Marcas Parceiras', value: '20+', icon: 'mdi-star', color: 'warning' }
]

const viewCarDetails = (carId) => {
  navigateTo(`/cars/${carId}`)
}

const contactAboutCar = (carName) => {
  navigateTo(`/contact?car=${encodeURIComponent(carName)}`)
}

onMounted(async () => {
  try {
    await carsStore.fetchFeaturedCars()
    featuredCars.value = carsStore.featuredCars
  } catch (error) {
    console.error('Erro ao carregar carros em destaque:', error)
  } finally {
    loading.value = false
  }
})

// SEO
useHead({
  title: 'AutoShow - Showroom de Carros Premium',
  meta: [
    { name: 'description', content: 'Encontre o carro dos seus sonhos no AutoShow. Carros novos e seminovos com garantia total e financiamento flexível.' },
    { name: 'keywords', content: 'carros, automóveis, showroom, concessionária, veículos, compra, venda' }
  ]
})
</script>
