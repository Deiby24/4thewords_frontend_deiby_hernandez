<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="flex items-center space-x-4">
            <AppButton variant="outline" @click="$router.back()">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Volver
            </AppButton>
            <h1 class="text-2xl font-bold text-gray-900">Crear Nueva Leyenda</h1>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-lg shadow-sm">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">Información de la Leyenda</h2>
          <p class="mt-1 text-sm text-gray-600">
            Completa todos los campos para crear una nueva leyenda
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
          <div v-if="errors.general" class="bg-red-50 border border-red-200 rounded-md p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">Error</h3>
                <div class="mt-2 text-sm text-red-700">
                  {{ errors.general }}
                </div>
              </div>
            </div>
          </div>

          <div>
            <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
              Título de la Leyenda *
            </label>
            <input
              id="title"
              v-model="form.title"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-500': errors.title }"
              placeholder="Ingresa el título de la leyenda"
            />
            <p v-if="errors.title" class="mt-1 text-sm text-red-600">{{ errors.title }}</p>
          </div>

          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
              Descripción *
            </label>
            <textarea
              id="description"
              v-model="form.description"
              rows="4"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-500': errors.description }"
              placeholder="Describe la leyenda..."
            ></textarea>
            <p v-if="errors.description" class="mt-1 text-sm text-red-600">
              {{ errors.description }}
            </p>
          </div>

          <div>
            <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
              Categoría *
            </label>
            <select
              id="category"
              v-model="form.category_id"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-500': errors.category_id }"
            >
              <option value="">Selecciona una categoría</option>
              <option
                v-for="categoria in catalogsStore.categorias"
                :key="categoria.id"
                :value="categoria.id"
              >
                {{ categoria.name }}
              </option>
            </select>
            <p v-if="errors.category_id" class="mt-1 text-sm text-red-600">
              {{ errors.category_id }}
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label for="province" class="block text-sm font-medium text-gray-700 mb-2">
                Provincia *
              </label>
              <select
                id="province"
                v-model="selectedProvincia"
                required
                @change="handleProvinciaChange"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                :class="{ 'border-red-500': errors.provincia }"
              >
                <option value="">Selecciona una provincia</option>
                <option
                  v-for="provincia in catalogsStore.provincias"
                  :key="provincia.id"
                  :value="provincia.id"
                >
                  {{ provincia.name }}
                </option>
              </select>
              <p v-if="errors.provincia" class="mt-1 text-sm text-red-600">
                {{ errors.provincia }}
              </p>
            </div>

            <div>
              <label for="canton" class="block text-sm font-medium text-gray-700 mb-2">
                Cantón *
              </label>
              <select
                id="canton"
                v-model="selectedCanton"
                required
                @change="handleCantonChange"
                :disabled="!selectedProvincia"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                :class="{ 'border-red-500': errors.canton }"
              >
                <option value="">Selecciona un cantón</option>
                <option
                  v-for="canton in catalogsStore.cantones"
                  :key="canton.id"
                  :value="canton.id"
                >
                  {{ canton.name }}
                </option>
              </select>
              <p v-if="errors.canton" class="mt-1 text-sm text-red-600">{{ errors.canton }}</p>
            </div>

            <div>
              <label for="district" class="block text-sm font-medium text-gray-700 mb-2">
                Distrito *
              </label>
              <select
                id="district"
                v-model="form.district_id"
                required
                :disabled="!selectedCanton"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                :class="{ 'border-red-500': errors.district_id }"
              >
                <option value="">Selecciona un distrito</option>
                <option
                  v-for="distrito in catalogsStore.distritos"
                  :key="distrito.id"
                  :value="distrito.id"
                >
                  {{ distrito.name }}
                </option>
              </select>
              <p v-if="errors.district_id" class="mt-1 text-sm text-red-600">
                {{ errors.district_id }}
              </p>
            </div>
          </div>

          <div>
            <label for="image" class="block text-sm font-medium text-gray-700 mb-2">
              Imagen de la Leyenda *
            </label>
            <div class="flex items-center justify-center w-full">
              <label
                for="image"
                class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                :class="{ 'border-red-500': errors.image }"
              >
                <div
                  v-if="!imagePreview"
                  class="flex flex-col items-center justify-center pt-5 pb-6"
                >
                  <svg
                    class="w-10 h-10 mb-3 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p class="mb-2 text-sm text-gray-500">
                    <span class="font-semibold">Click para subir</span> o arrastra y suelta
                  </p>
                  <p class="text-xs text-gray-500">PNG, JPG, JPEG o WEBP (MAX. 10MB)</p>
                </div>
                <div v-else class="relative">
                  <img :src="imagePreview" alt="Preview" class="max-h-60 rounded-lg" />
                  <button
                    type="button"
                    @click.prevent="removeImage"
                    class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <input
                  id="image"
                  type="file"
                  class="hidden"
                  accept=".png,.jpg,.jpeg,.webp"
                  @change="handleImageChange"
                />
              </label>
            </div>
            <p v-if="errors.image" class="mt-1 text-sm text-red-600">{{ errors.image }}</p>
          </div>

          <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <AppButton type="button" variant="outline" @click="$router.back()" :disabled="loading">
              Cancelar
            </AppButton>
            <AppButton type="submit" variant="primary" :disabled="loading">
              <div v-if="loading" class="flex items-center">
                <svg
                  class="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creando...
              </div>
              <span v-else>Crear Leyenda</span>
            </AppButton>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCatalogsStore } from '@/stores/catalogs'
import { useLeyendasStore } from '@/stores/leyendas'
import AppButton from '@/components/ui/AppButton.vue'
import axios from 'axios'

export default {
  name: 'CreateLeyendaView',
  components: {
    AppButton,
  },
  setup() {
    const router = useRouter()
    const catalogsStore = useCatalogsStore()
    const leyendasStore = useLeyendasStore()

    const form = reactive({
      title: '',
      description: '',
      category_id: '',
      district_id: '',
      image: null,
    })
    const selectedProvincia = ref('')
    const selectedCanton = ref('')
    const imagePreview = ref(null)
    const loading = ref(false)
    const errors = reactive({})

    const handleProvinciaChange = async () => {
      selectedCanton.value = ''
      form.district_id = ''
      if (selectedProvincia.value) {
        await catalogsStore.loadCantonesByProvincia(selectedProvincia.value)
      }
    }

    const handleCantonChange = async () => {
      form.district_id = ''
      if (selectedCanton.value) {
        await catalogsStore.loadDistritosByCanton(selectedCanton.value)
      }
    }

    const handleImageChange = (event) => {
      const file = event.target.files[0]
      if (file) {
        const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp']
        if (!allowedTypes.includes(file.type)) {
          errors.image = 'Formato de imagen no permitido. Use PNG, JPG, JPEG o WEBP.'
          return
        }

        if (file.size > 10 * 1024 * 1024) {
          errors.image = 'La imagen es demasiado grande. Máximo 10MB.'
          return
        }

        form.image = file
        errors.image = ''

        const reader = new FileReader()
        reader.onload = (e) => {
          imagePreview.value = e.target.result
        }
        reader.readAsDataURL(file)
      }
    }

    const removeImage = () => {
      form.image = null
      imagePreview.value = null
      errors.image = ''
    }

    const validateForm = () => {
      const newErrors = {}

      if (!form.title.trim()) {
        newErrors.title = 'El título es requerido'
      }

      if (!form.description.trim()) {
        newErrors.description = 'La descripción es requerida'
      }

      if (!form.category_id) {
        newErrors.category_id = 'La categoría es requerida'
      }

      if (!selectedProvincia.value) {
        newErrors.provincia = 'La provincia es requerida'
      }

      if (!selectedCanton.value) {
        newErrors.canton = 'El cantón es requerido'
      }

      if (!form.district_id) {
        newErrors.district_id = 'El distrito es requerido'
      }

      if (!form.image) {
        newErrors.image = 'La imagen es requerida'
      }

      Object.assign(errors, newErrors)
      return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async () => {
      Object.keys(errors).forEach((key) => delete errors[key])

      if (!validateForm()) {
        return
      }

      loading.value = true

      try {
        const formData = new FormData()
        formData.append('title', form.title)
        formData.append('description', form.description)
        formData.append('category_id', form.category_id)
        formData.append('district_id', form.district_id)
        formData.append('image', form.image)

        const response = await axios.post('http://localhost:8080/createLegends/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        await leyendasStore.fetchLeyendas()

        router.push('/leyendas')

        console.log('Leyenda creada exitosamente:', response.data)
      } catch (error) {
        console.error('Error al crear la leyenda:', error)

        if (error.response?.data?.detail) {
          errors.general = error.response.data.detail
        } else {
          errors.general = 'Error al crear la leyenda. Por favor, intente nuevamente.'
        }
      } finally {
        loading.value = false
      }
    }

    onMounted(async () => {
      try {
        await Promise.all([catalogsStore.loadCategorias(), catalogsStore.loadProvincias()])
      } catch (error) {
        console.error('Error al cargar catálogos:', error)
      }
    })

    return {
      catalogsStore,
      leyendasStore,

      form,
      selectedProvincia,
      selectedCanton,
      imagePreview,
      loading,
      errors,

      handleProvinciaChange,
      handleCantonChange,
      handleImageChange,
      removeImage,
      handleSubmit,
    }
  },
}
</script>
