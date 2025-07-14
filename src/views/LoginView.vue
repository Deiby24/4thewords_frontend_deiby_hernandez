<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-200 via-purple-200 to-pink-100 px-4 py-12"
  >
    <div
      class="w-full max-w-md bg-white/60 backdrop-blur-md shadow-xl rounded-2xl p-8 border border-white/30"
    >
      <div class="text-center">
        <h2 class="text-4xl font-bold text-gray-800 drop-shadow-sm">
          Libro de Leyendas Costarricenses
        </h2>
        <p class="mt-2 text-gray-600 text-sm">Inicia sesión para continuar</p>
      </div>

      <form @submit.prevent="handleLogin" class="mt-6 space-y-5">
        <AppInput
          id="email"
          label="Correo electrónico"
          type="email"
          v-model="form.email"
          placeholder="tu@email.com"
          required
          :error="errors.email"
        />

        <AppInput
          id="password"
          label="Contraseña"
          type="password"
          v-model="form.password"
          placeholder="••••••••"
          required
          :error="errors.password"
        />

        <div v-if="generalError" class="text-sm text-red-600">
          {{ generalError }}
        </div>

        <AppButton
          type="submit"
          variant="primary"
          class="w-full mt-2 transition-transform transform hover:scale-[1.02]"
          :disabled="loading"
        >
          {{ loading ? 'Iniciando sesión...' : 'Iniciar sesión' }}
        </AppButton>
      </form>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'

export default {
  name: 'LoginView',
  components: {
    AppButton,
    AppInput,
  },
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
      errors: {},
      generalError: '',
      loading: false,
    }
  },
  methods: {
    async handleLogin() {
      this.loading = true
      this.errors = {}
      this.generalError = ''

      try {
        const authStore = useAuthStore()
        await authStore.login(this.form)

        this.$router.push('/leyendas')
      } catch (error) {
        if (error.response?.data?.detail) {
          this.generalError = error.response.data.detail
        } else {
          this.generalError = 'Error al iniciar sesión. Intenta nuevamente.'
        }
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
