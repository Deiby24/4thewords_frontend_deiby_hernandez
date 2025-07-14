<template>
  <div class="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Editar Leyenda</h1>

    <form @submit.prevent="submitForm" class="space-y-6">
      <div v-for="(field, label) in campos" :key="label">
        <label class="block text-sm font-medium text-gray-700 mb-1">{{ label }}</label>

        <template v-if="field.type === 'textarea'">
          <textarea
            v-model="leyenda[field.model]"
            rows="4"
            :placeholder="label"
            class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
        </template>

        <template v-else-if="field.type === 'select'">
          <select
            v-model="leyenda[field.model]"
            :disabled="isSelectDisabled(field.model)"
            class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="" disabled>Seleccione una opción</option>
            <option v-for="opcion in field.options" :key="opcion.id" :value="opcion.id">
              {{ opcion.name }}
            </option>
          </select>
        </template>

        <template v-else>
          <input
            v-model="leyenda[field.model]"
            :type="field.type"
            :placeholder="label"
            class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </template>
      </div>

      <div class="flex justify-end space-x-4">
        <button
          type="button"
          @click="router.push('/leyendas')"
          class="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition"
        >
          Cancelar
        </button>
        <button
          type="submit"
          class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Guardar Cambios
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

const leyenda = ref({
  title: '',
  description: '',
  category_id: '',
  province_id: '',
  canton_id: '',
  district_id: '',
})

const categorias = ref([])
const provincias = ref([])
const cantones = ref([])
const distritos = ref([])

const campos = computed(() => ({
  Título: { model: 'title', type: 'text' },
  Descripción: { model: 'description', type: 'textarea' },
  Categoría: { model: 'category_id', type: 'select', options: categorias.value },
  Provincia: { model: 'province_id', type: 'select', options: provincias.value },
  Cantón: { model: 'canton_id', type: 'select', options: cantones.value },
  Distrito: { model: 'district_id', type: 'select', options: distritos.value },
}))

const isSelectDisabled = (model) => {
  if (model === 'canton_id') return !leyenda.value.province_id
  if (model === 'district_id') return !leyenda.value.canton_id
  return false
}

watch(
  () => leyenda.value.province_id,
  async (newVal) => {
    leyenda.value.canton_id = ''
    leyenda.value.district_id = ''
    cantones.value = []
    distritos.value = []

    if (newVal) {
      try {
        const { data } = await axios.get(`http://localhost:8080/cantons/${newVal}`)
        cantones.value = data
      } catch (err) {
        console.error('Error cargando cantones:', err)
      }
    }
  },
)

watch(
  () => leyenda.value.canton_id,
  async (newVal) => {
    leyenda.value.district_id = ''
    distritos.value = []

    if (newVal) {
      try {
        const { data } = await axios.get(`http://localhost:8080/districts/${newVal}`)
        distritos.value = data
      } catch (err) {
        console.error('Error cargando distritos:', err)
      }
    }
  },
)

onMounted(async () => {
  try {
    const [resCat, resProv] = await Promise.all([
      axios.get('http://localhost:8080/categories'),
      axios.get('http://localhost:8080/provinces'),
    ])
    categorias.value = resCat.data
    provincias.value = resProv.data

    const { data } = await axios.get(`http://localhost:8080/legends/${route.params.id}`)
    leyenda.value = {
      title: data.title || '',
      description: data.description || '',
      category_id: data.category_id || '',
      province_id: data.province_id || '',
      canton_id: data.canton_id || '',
      district_id: data.district_id || '',
    }

    if (leyenda.value.province_id) {
      const { data: cantonesData } = await axios.get(
        `http://localhost:8080/cantons/${leyenda.value.province_id}`,
      )
      cantones.value = cantonesData
    }

    if (leyenda.value.canton_id) {
      const { data: distritosData } = await axios.get(
        `http://localhost:8080/districts/${leyenda.value.canton_id}`,
      )
      distritos.value = distritosData
    }
  } catch (error) {
    console.error('Error al cargar datos:', error)
  }
})

const submitForm = async () => {
  try {
    const cleanData = Object.fromEntries(
      Object.entries(leyenda.value).filter(([_, v]) => v !== null && v !== ''),
    )

    await axios.put(`http://localhost:8080/legends/${route.params.id}`, cleanData)
    router.push('/leyendas')
  } catch (err) {
    console.error('Error al guardar:', err.response?.data || err.message)
  }
}
</script>
