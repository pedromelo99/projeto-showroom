<template>
  <v-container class="py-16">
    <v-row justify="center">
      <v-col cols="12" md="6" lg="4">
        <v-card elevation="4" class="pa-8">
          <div class="text-center mb-8">
            <v-icon size="64" color="primary" class="mb-4">
              mdi-car
            </v-icon>
            <h1 class="text-h4 font-weight-bold mb-2">
              Entrar
            </h1>
            <p class="text-body-1 text-grey-darken-1">
              Acesse sua conta para continuar
            </p>
          </div>

          <v-form
            ref="form"
            v-model="valid"
            @submit.prevent="login"
          >
            <v-text-field
              v-model="form.email"
              label="Email"
              type="email"
              prepend-inner-icon="mdi-email"
              variant="outlined"
              :rules="emailRules"
              required
              class="mb-4"
            ></v-text-field>

            <v-text-field
              v-model="form.password"
              label="Senha"
              :type="showPassword ? 'text' : 'password'"
              prepend-inner-icon="mdi-lock"
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              variant="outlined"
              :rules="passwordRules"
              required
              class="mb-4"
              @click:append-inner="showPassword = !showPassword"
            ></v-text-field>

            <div class="d-flex justify-space-between align-center mb-6">
              <v-checkbox
                v-model="form.remember"
                label="Lembrar de mim"
                color="primary"
                hide-details
              ></v-checkbox>
              
              <v-btn
                variant="text"
                color="primary"
                size="small"
                @click="forgotPassword"
              >
                Esqueci minha senha
              </v-btn>
            </div>

            <v-btn
              type="submit"
              color="primary"
              size="large"
              block
              :loading="loading"
              :disabled="!valid"
              class="mb-4"
            >
              Entrar
            </v-btn>

            <v-divider class="my-6"></v-divider>

            <div class="text-center">
              <p class="text-body-2 text-grey-darken-1 mb-4">
                Não tem uma conta?
              </p>
              <v-btn
                variant="outlined"
                color="primary"
                size="large"
                block
                :to="'/auth/register'"
              >
                Criar Conta
              </v-btn>
            </div>
          </v-form>
        </v-card>

        <!-- Demo Credentials -->
        <v-card elevation="2" class="pa-4 mt-4">
          <h3 class="text-h6 mb-3">Credenciais de Demonstração</h3>
          <v-list density="compact">
            <v-list-item>
              <v-list-item-title class="text-body-2">
                <strong>Cliente:</strong> cliente@demo.com / senha123
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title class="text-body-2">
                <strong>Admin:</strong> admin@demo.com / admin123
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const authStore = useAuthStore()
const router = useRouter()

const form = ref({
  email: '',
  password: '',
  remember: false
})

const valid = ref(false)
const loading = ref(false)
const showPassword = ref(false)

const emailRules = [
  v => !!v || 'Email é obrigatório',
  v => /.+@.+\..+/.test(v) || 'Email deve ser válido'
]

const passwordRules = [
  v => !!v || 'Senha é obrigatória',
  v => v.length >= 6 || 'Senha deve ter pelo menos 6 caracteres'
]

const login = async () => {
  if (!valid.value) return
  
  loading.value = true
  
  try {
    await authStore.login(form.value)
    
    // Redirect based on user type
    if (authStore.user?.user_type === 'admin') {
      await router.push('/admin')
    } else {
      await router.push('/')
    }
  } catch (error) {
    console.error('Erro no login:', error)
    // Show error message
  } finally {
    loading.value = false
  }
}

const forgotPassword = () => {
  // Implement forgot password functionality
  console.log('Forgot password')
}

// SEO
useHead({
  title: 'Login - AutoShow',
  meta: [
    { name: 'description', content: 'Faça login na sua conta AutoShow para acessar recursos exclusivos.' }
  ]
})
</script>
