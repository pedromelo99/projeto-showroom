<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      permanent
      @click="rail = false"
    >
      <v-list-item
        prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
        :title="user?.name || 'Admin'"
        subtitle="Administrador"
        nav
      >
        <template v-slot:append>
          <v-btn
            variant="text"
            icon="mdi-chevron-left"
            @click.stop="rail = !rail"
          ></v-btn>
        </template>
      </v-list-item>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          title="Dashboard"
          value="dashboard"
          :to="'/admin'"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-car"
          title="Carros"
          value="cars"
          :to="'/admin/cars'"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-account-group"
          title="Leads"
          value="leads"
          :to="'/admin/leads'"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-chart-line"
          title="Relatórios"
          value="reports"
          :to="'/admin/reports'"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-cog"
          title="Configurações"
          value="settings"
          :to="'/admin/settings'"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Painel Administrativo</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        prepend-icon="mdi-logout"
        variant="text"
        @click="logout"
      >
        Sair
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
const drawer = ref(true)
const rail = ref(false)
const authStore = useAuthStore()

const user = computed(() => authStore.user)

const logout = async () => {
  await authStore.logout()
  await navigateTo('/auth/login')
}
</script>
