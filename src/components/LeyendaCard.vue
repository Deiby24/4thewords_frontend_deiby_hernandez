<template>
  <div
    class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100"
  >
    <div class="h-48 bg-gray-200 overflow-hidden">
      <img
        v-if="leyenda.image_url"
        :src="fullImageUrl"
        :alt="leyenda.title || 'Imagen sin título'"
        class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        @error="handleImageError"
      />
      <div v-else class="w-full h-full flex items-center justify-center bg-gray-300">
        <svg class="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    </div>

    <div class="p-5">
      <div class="flex justify-between items-start mb-2">
        <h3 class="text-lg font-semibold text-gray-900 line-clamp-2">
          {{ leyenda.title || 'Sin título' }}
        </h3>
        <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full ml-2 flex-shrink-0">
          {{ leyenda.category_name || 'Sin categoría' }}
        </span>
      </div>

      <p class="text-gray-600 text-sm mb-3 line-clamp-3">
        {{ leyenda.description || 'Sin descripción disponible.' }}
      </p>

      <div class="text-xs text-gray-500 space-y-1 mb-4">
        <div class="flex items-center">
          <svg
            class="w-4 h-4 mr-2 text-black"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17.657 16.657L13.414 12.414a4 4 0 10-5.657 5.657l4.243 4.243a8 8 0 1011.314-11.314l-4.243 4.243z"
            />
          </svg>
          {{ ubicacionCompleta }}
        </div>
        <div class="flex items-center">
          <svg
            class="w-5 h-5 mr-2 text-black"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10m-10 4h6m2 6h2a2 2 0 002-2V7a2 2 0 00-2-2h-2m-4 0H8a2 2 0 00-2 2v12a2 2 0 002 2h2"
            />
          </svg>
          {{ fechaRelativa }}
        </div>
      </div>

      <div class="flex justify-end space-x-2">
        <AppButton variant="outline" size="sm" @click="$emit('edit', leyenda)">Editar</AppButton>
        <AppButton variant="danger" size="sm" @click="$emit('delete', leyenda)">Eliminar</AppButton>
      </div>
    </div>
  </div>
</template>

<script>
import AppButton from './ui/AppButton.vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export default {
  name: 'LeyendaCard',
  components: {
    AppButton,
  },
  emits: ['edit', 'delete'],
  props: {
    leyenda: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ubicacionCompleta() {
      const partes = [
        this.leyenda.district_name,
        this.leyenda.canton_name,
        this.leyenda.province_name,
      ].filter(Boolean)

      return partes.length > 0 ? partes.join(', ') : 'Ubicación no especificada'
    },

    fechaRelativa() {
      if (!this.leyenda.created_at) return 'Fecha no especificada'
      return dayjs(this.leyenda.created_at).fromNow()
    },

    fullImageUrl() {
      const baseUrl = 'http://localhost:8080'
      return this.leyenda.image_url ? `${baseUrl}${this.leyenda.image_url}` : ''
    },
  },
  methods: {
    handleImageError(event) {
      event.target.src = '/img/default-image.png'
    },
  },
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
