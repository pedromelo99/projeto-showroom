<template>
  <div>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold mb-6">
          Dashboard Administrativo
        </h1>
      </v-col>
    </v-row>

    <!-- Stats Cards -->
    <v-row class="mb-8">
      <v-col
        v-for="stat in stats"
        :key="stat.title"
        cols="12"
        sm="6"
        md="3"
      >
        <v-card
          :color="stat.color"
          dark
          elevation="4"
        >
          <v-card-text class="d-flex align-center">
            <v-icon
              :icon="stat.icon"
              size="48"
              class="mr-4"
            ></v-icon>
            <div>
              <div class="text-h4 font-weight-bold">
                {{ stat.value }}
              </div>
              <div class="text-body-2">
                {{ stat.title }}
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Quick Actions -->
    <v-row class="mb-8">
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title>
            <v-icon class="mr-2">mdi-lightning-bolt</v-icon>
            Ações Rápidas
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col
                v-for="action in quickActions"
                :key="action.title"
                cols="12"
                sm="6"
                md="3"
              >
                <v-btn
                  :color="action.color"
                  :to="action.to"
                  size="large"
                  block
                  class="mb-2"
                >
                  <v-icon class="mr-2">{{ action.icon }}</v-icon>
                  {{ action.title }}
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Recent Activity -->
    <v-row>
      <v-col cols="12" md="8">
        <v-card elevation="2">
          <v-card-title>
            <v-icon class="mr-2">mdi-clock-outline</v-icon>
            Atividade Recente
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="activity in recentActivity"
                :key="activity.id"
                class="px-0"
              >
                <template v-slot:prepend>
                  <v-avatar
                    :color="activity.color"
                    size="40"
                  >
                    <v-icon color="white">{{ activity.icon }}</v-icon>
                  </v-avatar>
                </template>
                
                <v-list-item-title>{{ activity.title }}</v-list-item-title>
                <v-list-item-subtitle>{{ activity.description }}</v-list-item-subtitle>
                
                <template v-slot:append>
                  <div class="text-caption text-grey-darken-1">
                    {{ formatTime(activity.time) }}
                  </div>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card elevation="2">
          <v-card-title>
            <v-icon class="mr-2">mdi-chart-pie</v-icon>
            Carros por Status
          </v-card-title>
          <v-card-text>
            <div
              v-for="status in carStatusStats"
              :key="status.name"
              class="d-flex justify-space-between align-center mb-3"
            >
              <div class="d-flex align-center">
                <v-icon
                  :color="status.color"
                  class="mr-2"
                >
                  {{ status.icon }}
                </v-icon>
                <span>{{ status.name }}</span>
              </div>
              <v-chip
                :color="status.color"
                size="small"
              >
                {{ status.count }}
              </v-chip>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Recent Leads -->
    <v-row class="mt-6">
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title class="d-flex justify-space-between align-center">
            <div>
              <v-icon class="mr-2">mdi-account-group</v-icon>
              Leads Recentes
            </div>
            <v-btn
              color="primary"
              variant="outlined"
              :to="'/admin/leads'"
            >
              Ver Todos
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="leadHeaders"
              :items="recentLeads"
              :loading="loadingLeads"
              hide-default-footer
            >
              <template v-slot:item.status="{ item }">
                <v-chip
                  :color="getLeadStatusColor(item.status)"
                  size="small"
                >
                  {{ getLeadStatusText(item.status) }}
                </v-chip>
              </template>
              
              <template v-slot:item.created_at="{ item }">
                {{ formatDate(item.created_at) }}
              </template>
              
              <template v-slot:item.actions="{ item }">
                <v-btn
                  icon
                  size="small"
                  @click="viewLead(item)"
                >
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
const carsStore = useCarsStore()
const leadsStore = useLeadsStore()

const loadingLeads = ref(false)

// Stats data
const stats = ref([
  {
    title: 'Total de Carros',
    value: '156',
    icon: 'mdi-car',
    color: 'primary'
  },
  {
    title: 'Carros Disponíveis',
    value: '142',
    icon: 'mdi-car-side',
    color: 'success'
  },
  {
    title: 'Leads do Mês',
    value: '89',
    icon: 'mdi-account-group',
    color: 'info'
  },
  {
    title: 'Vendas do Mês',
    value: '23',
    icon: 'mdi-currency-usd',
    color: 'warning'
  }
])

const quickActions = ref([
  {
    title: 'Adicionar Carro',
    icon: 'mdi-plus',
    color: 'primary',
    to: '/admin/cars/new'
  },
  {
    title: 'Gerenciar Carros',
    icon: 'mdi-car-multiple',
    color: 'info',
    to: '/admin/cars'
  },
  {
    title: 'Ver Leads',
    icon: 'mdi-account-group',
    color: 'success',
    to: '/admin/leads'
  },
  {
    title: 'Relatórios',
    icon: 'mdi-chart-line',
    color: 'warning',
    to: '/admin/reports'
  }
])

const recentActivity = ref([
  {
    id: 1,
    title: 'Novo carro adicionado',
    description: 'BMW 320i 2023 foi adicionado ao estoque',
    icon: 'mdi-car-plus',
    color: 'success',
    time: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
  },
  {
    id: 2,
    title: 'Lead convertido',
    description: 'João Silva demonstrou interesse no Audi Q5',
    icon: 'mdi-account-check',
    color: 'info',
    time: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
  },
  {
    id: 3,
    title: 'Carro vendido',
    description: 'Volkswagen Golf foi vendido para Maria Santos',
    icon: 'mdi-currency-usd',
    color: 'warning',
    time: new Date(Date.now() - 1000 * 60 * 60 * 4) // 4 hours ago
  },
  {
    id: 4,
    title: 'Imagem atualizada',
    description: 'Fotos do Mercedes-Benz C200 foram atualizadas',
    icon: 'mdi-image-edit',
    color: 'primary',
    time: new Date(Date.now() - 1000 * 60 * 60 * 6) // 6 hours ago
  }
])

const carStatusStats = ref([
  { name: 'Disponível', count: 142, color: 'success', icon: 'mdi-check-circle' },
  { name: 'Vendido', count: 12, color: 'error', icon: 'mdi-close-circle' },
  { name: 'Reservado', count: 2, color: 'warning', icon: 'mdi-clock' }
])

const leadHeaders = ref([
  { title: 'Nome', key: 'name' },
  { title: 'Email', key: 'email' },
  { title: 'Carro de Interesse', key: 'car_name' },
  { title: 'Status', key: 'status' },
  { title: 'Data', key: 'created_at' },
  { title: 'Ações', key: 'actions', sortable: false }
])

const recentLeads = ref([])

// Methods
const formatTime = (date) => {
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 60) {
    return `${minutes} min atrás`
  } else if (hours < 24) {
    return `${hours}h atrás`
  } else {
    return `${days} dias atrás`
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('pt-BR')
}

const getLeadStatusText = (status) => {
  const statuses = {
    new: 'Novo',
    contacted: 'Contatado',
    interested: 'Interessado',
    not_interested: 'Não Interessado'
  }
  return statuses[status] || status
}

const getLeadStatusColor = (status) => {
  const colors = {
    new: 'primary',
    contacted: 'info',
    interested: 'success',
    not_interested: 'error'
  }
  return colors[status] || 'grey'
}

const viewLead = (lead) => {
  // Navigate to lead details
  console.log('View lead:', lead)
}

// Lifecycle
onMounted(async () => {
  loadingLeads.value = true
  try {
    await leadsStore.fetchLeads()
    recentLeads.value = leadsStore.leads.slice(0, 5)
  } catch (error) {
    console.error('Erro ao carregar leads:', error)
  } finally {
    loadingLeads.value = false
  }
})

// SEO
useHead({
  title: 'Dashboard - AutoShow Admin',
  meta: [
    { name: 'description', content: 'Painel administrativo da AutoShow' }
  ]
})
</script>
