<template>
  <v-app-bar
    color="primary"
    dark
    elevation="4"
    fixed
  >
    <v-app-bar-nav-icon
      class="d-md-none"
      @click="drawer = !drawer"
    ></v-app-bar-nav-icon>

    <v-toolbar-title class="d-flex align-center">
      <v-icon class="mr-2">mdi-car</v-icon>
      AutoShow
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <!-- Desktop Navigation -->
    <v-toolbar-items class="d-none d-md-flex">
      <v-btn
        v-for="item in menuItems"
        :key="item.title"
        :to="item.to"
        variant="text"
        class="text-white"
      >
        {{ item.title }}
      </v-btn>
    </v-toolbar-items>

    <!-- Auth Buttons -->
    <div class="d-none d-md-flex align-center ml-4">
      <v-btn
        v-if="!isAuthenticated"
        variant="outlined"
        color="white"
        class="mr-2"
        :to="'/auth/login'"
      >
        Entrar
      </v-btn>
      <v-btn
        v-if="!isAuthenticated"
        color="accent"
        :to="'/auth/register'"
      >
        Cadastrar
      </v-btn>
      <v-menu v-else>
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            variant="text"
            color="white"
            prepend-icon="mdi-account"
          >
            {{ user?.name || 'Usuário' }}
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-if="user?.user_type === 'admin'"
            :to="'/admin'"
            prepend-icon="mdi-cog"
          >
            Painel Admin
          </v-list-item>
          <v-list-item
            @click="logout"
            prepend-icon="mdi-logout"
          >
            Sair
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </v-app-bar>

  <!-- Mobile Navigation Drawer -->
  <v-navigation-drawer
    v-model="drawer"
    temporary
    location="left"
    class="d-md-none"
  >
    <v-list>
      <v-list-item
        v-for="item in menuItems"
        :key="item.title"
        :to="item.to"
        @click="drawer = false"
      >
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list>
      <v-list-item
        v-if="!isAuthenticated"
        :to="'/auth/login'"
        @click="drawer = false"
      >
        <v-list-item-title>Entrar</v-list-item-title>
      </v-list-item>
      <v-list-item
        v-if="!isAuthenticated"
        :to="'/auth/register'"
        @click="drawer = false"
      >
        <v-list-item-title>Cadastrar</v-list-item-title>
      </v-list-item>
      <v-list-item
        v-if="isAuthenticated && user?.user_type === 'admin'"
        :to="'/admin'"
        @click="drawer = false"
      >
        <v-list-item-title>Painel Admin</v-list-item-title>
      </v-list-item>
      <v-list-item
        v-if="isAuthenticated"
        @click="logout; drawer = false"
      >
        <v-list-item-title>Sair</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
const drawer = ref(false)
const authStore = useAuthStore()

const menuItems = [
  { title: 'Início', to: '/' },
  { title: 'Carros', to: '/cars' },
  { title: 'Sobre', to: '/about' },
  { title: 'Contato', to: '/contact' }
]

const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)

const logout = async () => {
  await authStore.logout()
  await navigateTo('/')
}
</script>
