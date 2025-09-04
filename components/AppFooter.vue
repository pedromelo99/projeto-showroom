<template>
  <v-footer
    color="primary"
    dark
    class="mt-16"
  >
    <v-container>
      <v-row>
        <v-col cols="12" md="4">
          <h3 class="text-h6 mb-4">
            <v-icon class="mr-2">mdi-car</v-icon>
            AutoShow
          </h3>
          <p class="text-body-2">
            Sua concessionária de confiança com mais de 10 anos de experiência no mercado automotivo.
          </p>
          <div class="d-flex mt-4">
            <v-btn
              v-for="social in socialLinks"
              :key="social.name"
              :href="social.url"
              target="_blank"
              icon
              variant="text"
              color="white"
              class="mr-2"
            >
              <v-icon>{{ social.icon }}</v-icon>
            </v-btn>
          </div>
        </v-col>

        <v-col cols="12" md="4">
          <h4 class="text-h6 mb-4">Links Úteis</h4>
          <v-list density="compact" color="transparent">
            <v-list-item
              v-for="link in usefulLinks"
              :key="link.title"
              :to="link.to"
              class="px-0"
            >
              <v-list-item-title class="text-body-2">
                {{ link.title }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-col>

        <v-col cols="12" md="4">
          <h4 class="text-h6 mb-4">Contato</h4>
          <div class="d-flex align-center mb-2">
            <v-icon class="mr-2">mdi-map-marker</v-icon>
            <span class="text-body-2">
              Rua das Flores, 123 - Centro<br>
              São Paulo - SP, 01234-567
            </span>
          </div>
          <div class="d-flex align-center mb-2">
            <v-icon class="mr-2">mdi-phone</v-icon>
            <span class="text-body-2">(11) 99999-9999</span>
          </div>
          <div class="d-flex align-center mb-2">
            <v-icon class="mr-2">mdi-email</v-icon>
            <span class="text-body-2">contato@autoshow.com.br</span>
          </div>
          <div class="d-flex align-center">
            <v-icon class="mr-2">mdi-clock</v-icon>
            <span class="text-body-2">
              Seg - Sex: 8h às 18h<br>
              Sáb: 8h às 12h
            </span>
          </div>
        </v-col>
      </v-row>

      <v-divider class="my-4"></v-divider>

      <v-row align="center" justify="space-between">
        <v-col cols="12" md="6">
          <p class="text-body-2 mb-0">
            &copy; {{ currentYear }} AutoShow. Todos os direitos reservados.
          </p>
        </v-col>
        <v-col cols="12" md="6" class="text-md-right">
          <v-btn
            v-for="legal in legalLinks"
            :key="legal.title"
            :to="legal.to"
            variant="text"
            color="white"
            size="small"
            class="ml-2"
          >
            {{ legal.title }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script setup>
const currentYear = new Date().getFullYear()

const socialLinks = [
  { name: 'Facebook', icon: 'mdi-facebook', url: '#' },
  { name: 'Instagram', icon: 'mdi-instagram', url: '#' },
  { name: 'YouTube', icon: 'mdi-youtube', url: '#' },
  { name: 'WhatsApp', icon: 'mdi-whatsapp', url: '#' }
]

const usefulLinks = [
  { title: 'Política de Privacidade', to: '/privacy' },
  { title: 'Termos de Uso', to: '/terms' },
  { title: 'Financiamento', to: '/financing' },
  { title: 'Garantia', to: '/warranty' },
  { title: 'FAQ', to: '/faq' }
]

const legalLinks = [
  { title: 'Privacidade', to: '/privacy' },
  { title: 'Termos', to: '/terms' },
  { title: 'Cookies', to: '/cookies' }
]
</script>
