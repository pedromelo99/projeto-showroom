<template>
  <v-card
    class="h-100"
    elevation="4"
    hover
    @click="$emit('view-details', car.id)"
  >
    <v-img
      :src="car.images?.[0]?.image_url || placeholderImage"
      height="250"
      cover
      class="cursor-pointer"
    >
      <template v-slot:placeholder>
        <div class="d-flex align-center justify-center fill-height">
          <v-icon size="64" color="grey-lighten-2">mdi-car</v-icon>
        </div>
      </template>
      
      <v-chip
        v-if="car.featured"
        color="accent"
        class="ma-2"
        size="small"
      >
        Destaque
      </v-chip>
      
      <v-chip
        :color="getStatusColor(car.status)"
        class="ma-2"
        size="small"
        style="position: absolute; top: 0; right: 0;"
      >
        {{ getStatusText(car.status) }}
      </v-chip>
    </v-img>

    <v-card-title class="text-h6">
      {{ car.brand }} {{ car.model }}
    </v-card-title>

    <v-card-subtitle class="text-body-2">
      {{ car.year }} • {{ formatMileage(car.mileage) }} • {{ getFuelTypeText(car.fuel_type) }}
    </v-card-subtitle>

    <v-card-text>
      <div class="text-h5 font-weight-bold text-primary mb-3">
        {{ formatPrice(car.price) }}
      </div>
      
      <p class="text-body-2 text-grey-darken-1 mb-4">
        {{ car.description || 'Veículo em excelente estado de conservação.' }}
      </p>

      <div class="d-flex flex-wrap gap-2 mb-4">
        <v-chip
          v-for="feature in getCarFeatures(car)"
          :key="feature"
          size="small"
          variant="outlined"
          color="primary"
        >
          {{ feature }}
        </v-chip>
      </div>
    </v-card-text>

    <v-card-actions class="pa-4">
      <v-btn
        color="primary"
        variant="flat"
        block
        @click.stop="$emit('view-details', car.id)"
      >
        Ver Detalhes
      </v-btn>
      <v-btn
        color="primary"
        variant="outlined"
        block
        @click.stop="$emit('contact', car)"
      >
        Falar com Vendedor
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
const props = defineProps({
  car: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['view-details', 'contact'])

const placeholderImage = 'https://via.placeholder.com/400x250/f0f0f0/999999?text=Sem+Imagem'

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
  
  if (car.color) {
    features.push(car.color)
  }
  
  return features
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
