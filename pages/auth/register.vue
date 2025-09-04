<template>
  <v-container class="py-16">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card elevation="4" class="pa-8">
          <div class="text-center mb-8">
            <v-icon size="64" color="primary" class="mb-4">
              mdi-account-plus
            </v-icon>
            <h1 class="text-h4 font-weight-bold mb-2">
              Criar Conta
            </h1>
            <p class="text-body-1 text-grey-darken-1">
              Cadastre-se para acessar recursos exclusivos
            </p>
          </div>

          <v-form
            ref="form"
            v-model="valid"
            @submit.prevent="register"
          >
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.name"
                  label="Nome Completo"
                  prepend-inner-icon="mdi-account"
                  variant="outlined"
                  :rules="nameRules"
                  required
                ></v-text-field>
              </v-col>
              
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.phone"
                  label="Telefone"
                  prepend-inner-icon="mdi-phone"
                  variant="outlined"
                  :rules="phoneRules"
                  v-mask="'(##) #####-####'"
                ></v-text-field>
              </v-col>
            </v-row>

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

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.password"
                  label="Senha"
                  :type="showPassword ? 'text' : 'password'"
                  prepend-inner-icon="mdi-lock"
                  :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  variant="outlined"
                  :rules="passwordRules"
                  required
                  @click:append-inner="showPassword = !showPassword"
                ></v-text-field>
              </v-col>
              
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.confirmPassword"
                  label="Confirmar Senha"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  prepend-inner-icon="mdi-lock-check"
                  :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  variant="outlined"
                  :rules="confirmPasswordRules"
                  required
                  @click:append-inner="showConfirmPassword = !showConfirmPassword"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-checkbox
              v-model="form.acceptTerms"
              color="primary"
              :rules="termsRules"
              required
            >
              <template v-slot:label>
                <span class="text-body-2">
                  Aceito os 
                  <a href="/terms" target="_blank" class="text-primary">Termos de Uso</a>
                  e 
                  <a href="/privacy" target="_blank" class="text-primary">Política de Privacidade</a>
                </span>
              </template>
            </v-checkbox>

            <v-checkbox
              v-model="form.acceptMarketing"
              color="primary"
            >
              <template v-slot:label>
                <span class="text-body-2">
                  Desejo receber ofertas e novidades por email
                </span>
              </template>
            </v-checkbox>

            <v-btn
              type="submit"
              color="primary"
              size="large"
              block
              :loading="loading"
              :disabled="!valid"
              class="mb-4"
            >
              Criar Conta
            </v-btn>

            <v-divider class="my-6"></v-divider>

            <div class="text-center">
              <p class="text-body-2 text-grey-darken-1 mb-4">
                Já tem uma conta?
              </p>
              <v-btn
                variant="outlined"
                color="primary"
                size="large"
                block
                :to="'/auth/login'"
              >
                Fazer Login
              </v-btn>
            </div>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const authStore = useAuthStore()
const router = useRouter()

const form = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
  acceptMarketing: false
})

const valid = ref(false)
const loading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const nameRules = [
  v => !!v || 'Nome é obrigatório',
  v => v.length >= 2 || 'Nome deve ter pelo menos 2 caracteres'
]

const emailRules = [
  v => !!v || 'Email é obrigatório',
  v => /.+@.+\..+/.test(v) || 'Email deve ser válido'
]

const phoneRules = [
  v => !v || v.length === 15 || 'Telefone deve ter 11 dígitos'
]

const passwordRules = [
  v => !!v || 'Senha é obrigatória',
  v => v.length >= 6 || 'Senha deve ter pelo menos 6 caracteres',
  v => /(?=.*[a-z])/.test(v) || 'Senha deve conter pelo menos uma letra minúscula',
  v => /(?=.*[A-Z])/.test(v) || 'Senha deve conter pelo menos uma letra maiúscula',
  v => /(?=.*\d)/.test(v) || 'Senha deve conter pelo menos um número'
]

const confirmPasswordRules = [
  v => !!v || 'Confirmação de senha é obrigatória',
  v => v === form.value.password || 'Senhas não coincidem'
]

const termsRules = [
  v => !!v || 'Você deve aceitar os termos de uso'
]

const register = async () => {
  if (!valid.value) return
  
  loading.value = true
  
  try {
    await authStore.register(form.value)
    await router.push('/')
  } catch (error) {
    console.error('Erro no cadastro:', error)
    // Show error message
  } finally {
    loading.value = false
  }
}

// SEO
useHead({
  title: 'Cadastro - AutoShow',
  meta: [
    { name: 'description', content: 'Crie sua conta na AutoShow e tenha acesso a recursos exclusivos.' }
  ]
})
</script>
