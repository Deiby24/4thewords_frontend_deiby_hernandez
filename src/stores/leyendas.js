import { defineStore } from 'pinia'
import axios from 'axios'

export const useLeyendasStore = defineStore('leyendas', {
  state: () => ({
    leyendas: [],
    loading: false,
    error: null,
    filters: {
      nombre: '',
      categoria: '',
      fecha: '',
      provincia: '',
      canton: '',
      distrito: '',
    },
  }),

  getters: {
    filteredLeyendas: (state) => {
      return state.leyendas.filter((leyenda) => {
        console.log('leyenda.province_id:', leyenda)
        console.log('filter.provincia:', state.filters.provincia)
        const matchesNombre =
          !state.filters.nombre ||
          leyenda.title.toLowerCase().includes(state.filters.nombre.toLowerCase())

        const matchesCategoria =
          !state.filters.categoria || leyenda.category_id === parseInt(state.filters.categoria)

        const matchesProvincia =
          !state.filters.provincia || leyenda.province_id === parseInt(state.filters.provincia)

        const matchesCanton =
          !state.filters.canton || leyenda.canton_id === parseInt(state.filters.canton)

        const matchesDistrito =
          !state.filters.distrito || leyenda.district_id === parseInt(state.filters.distrito)

        const matchesFecha =
          !state.filters.fecha || leyenda.created_at?.includes(state.filters.fecha)

        return (
          matchesNombre &&
          matchesCategoria &&
          matchesProvincia &&
          matchesCanton &&
          matchesDistrito &&
          matchesFecha
        )
      })
    },
  },

  actions: {
    async fetchLeyendas() {
      this.loading = true
      this.error = null

      try {
        console.log('Fetching leyendas...')
        const response = await axios.get('http://localhost:8080/legends')
        console.log('Response data:', response.data)
        this.leyendas = response.data
      } catch (error) {
        this.error = 'Error al cargar las leyendas'
        console.error('Error fetching leyendas:', error)
        console.error('Error details:', error.response?.data)
      } finally {
        this.loading = false
      }
    },

    async deleteLeyenda(id) {
      try {
        await axios.delete(`http://localhost:8080/legends/${id}`)
        this.leyendas = this.leyendas.filter((leyenda) => leyenda.id !== id)
      } catch (error) {
        this.error = 'Error al eliminar la leyenda'
        console.error('Error deleting leyenda:', error)
        throw error
      }
    },

    setFilter(key, value) {
      this.filters[key] = value
    },

    clearFilters() {
      this.filters = {
        nombre: '',
        categoria: '',
        fecha: '',
        provincia: '',
        canton: '',
        distrito: '',
      }
    },

    async loadLeyendas() {
      return await this.fetchLeyendas()
    },
  },
})
