<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 flex flex-col">
    <header class="bg-white shadow-sm sticky top-0 z-10">
      <div
        class="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0"
      >
        <div>
          <h1 class="text-4xl font-bold tracking-tight text-gray-900">
            📖 Libro de Leyendas Costarricenses
          </h1>
          <p class="mt-1 text-sm text-gray-600">
            {{ filteredLeyendas.length }} leyenda{{
              filteredLeyendas.length !== 1 ? 's' : ''
            }}
            encontrada{{ filteredLeyendas.length !== 1 ? 's' : '' }}
          </p>
        </div>
        <div class="flex gap-2">
          <AppButton variant="primary" @click="$router.push('/leyendas/crear')">
            ➕ Nueva Leyenda
          </AppButton>
          <AppButton variant="outline" @click="logout"> 🔒 Cerrar Sesión </AppButton>
        </div>
      </div>
    </header>

    <main class="flex-1 max-w-7xl mx-auto px-6 py-10 space-y-8">
      <section class="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
        <FilterBar
          :filters="leyendasStore.filters"
          :categorias="catalogsStore.categorias"
          :provincias="catalogsStore.provincias"
          :cantones="catalogsStore.cantones"
          :distritos="catalogsStore.distritos"
          @update-filter="handleFilterUpdate"
          @clear-filters="handleClearFilters"
          @provincia-change="handleProvinciaChange"
          @canton-change="handleCantonChange"
        />
      </section>

      <div v-if="leyendasStore.loading" class="flex justify-center items-center py-16">
        <div
          class="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
        ></div>
      </div>

      <div
        v-else-if="leyendasStore.error"
        class="bg-red-50 border border-red-200 text-red-800 p-6 rounded-xl shadow-sm"
      >
        <div class="flex items-start gap-4">
          <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h3 class="font-semibold text-base">Error al cargar leyendas</h3>
            <p class="text-sm mt-1 text-balance">{{ leyendasStore.error }}</p>
          </div>
        </div>
      </div>

      <div
        v-else-if="filteredLeyendas.length === 0"
        class="bg-white p-12 rounded-2xl text-center shadow-sm"
      >
        <svg
          class="mx-auto h-14 w-14 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 class="mt-5 text-xl font-semibold text-gray-800">No se encontraron leyendas</h3>
        <p class="mt-2 text-sm text-gray-500">
          Prueba ajustando los filtros o crea una nueva leyenda para comenzar.
        </p>
        <div class="mt-6">
          <AppButton variant="primary" @click="$router.push('/leyendas/crear')">
            Crear primera leyenda
          </AppButton>
        </div>
      </div>

      <section v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <LeyendaCard
          v-for="leyenda in filteredLeyendas"
          :key="leyenda.id"
          :leyenda="leyenda"
          @edit="handleEdit"
          @delete="handleDeleteClick"
        />
      </section>
    </main>

    <AppModal
      :show="showDeleteModal"
      title="Eliminar Leyenda"
      :message="`¿Estás seguro de que quieres eliminar la leyenda '${leyendaToDelete?.nombre}'? Esta acción no se puede deshacer.`"
      confirm-text="Eliminar"
      cancel-text="Cancelar"
      @confirm="confirmDelete"
      @close="cancelDelete"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useLeyendasStore } from '@/stores/leyendas'
import { useCatalogsStore } from '@/stores/catalogs'
import FilterBar from '@/components/FilterBar.vue'
import LeyendaCard from '@/components/LeyendaCard.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppModal from '@/components/ui/AppModal.vue'

export default {
  name: 'LeyendasIndex',
  components: {
    FilterBar,
    LeyendaCard,
    AppButton,
    AppModal,
  },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const leyendasStore = useLeyendasStore()
    const catalogsStore = useCatalogsStore()

    const showDeleteModal = ref(false)
    const leyendaToDelete = ref(null)

    const filteredLeyendas = computed(() => {
      return leyendasStore.filteredLeyendas
    })

    const handleFilterUpdate = (filterType, value) => {
      leyendasStore.setFilter(filterType, value)
    }

    const handleClearFilters = () => {
      leyendasStore.clearFilters()
    }

    const handleProvinciaChange = (provinciaId) => {
      catalogsStore.loadCantonesByProvincia(provinciaId)
      leyendasStore.setFilter('canton', '')
      leyendasStore.setFilter('distrito', '')
    }

    const handleCantonChange = (cantonId) => {
      catalogsStore.loadDistritosByCanton(cantonId)
      leyendasStore.setFilter('distrito', '')
    }

    const handleEdit = (leyenda) => {
      router.push(`/leyendas/editar/${leyenda.id}`)
    }

    const handleDeleteClick = (leyenda) => {
      leyendaToDelete.value = leyenda
      showDeleteModal.value = true
    }

    const confirmDelete = async () => {
      try {
        await leyendasStore.deleteLeyenda(leyendaToDelete.value.id)
        showDeleteModal.value = false
        leyendaToDelete.value = null
      } catch (error) {
        console.error('Error al eliminar la leyenda:', error)
      }
    }

    const cancelDelete = () => {
      showDeleteModal.value = false
      leyendaToDelete.value = null
    }

    const logout = async () => {
      try {
        await authStore.logout()
        router.push('/login')
      } catch (error) {
        console.error('Error al cerrar sesión:', error)
      }
    }

    onMounted(async () => {
      try {
        await Promise.all([
          leyendasStore.loadLeyendas(),
          catalogsStore.loadCategorias(),
          catalogsStore.loadProvincias(),
        ])
      } catch (error) {
        console.error('Error al cargar datos iniciales:', error)
      }
    })

    return {
      leyendasStore,
      catalogsStore,
      showDeleteModal,
      leyendaToDelete,
      filteredLeyendas,
      handleFilterUpdate,
      handleClearFilters,
      handleProvinciaChange,
      handleCantonChange,
      handleEdit,
      handleDeleteClick,
      confirmDelete,
      cancelDelete,
      logout,
    }
  },
}
</script>
