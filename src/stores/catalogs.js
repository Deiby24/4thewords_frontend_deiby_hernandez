import { defineStore } from 'pinia'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080'

export const useCatalogsStore = defineStore('catalogs', {
  state: () => ({
    categorias: [],
    categoriasLoading: false,
    categoriasError: null,

    provincias: [],
    provinciasLoading: false,
    provinciasError: null,

    cantones: [],
    cantonesLoading: false,
    cantonesError: null,

    distritos: [],
    distritosLoading: false,
    distritosError: null,

    isLoading: false,
    error: null,
  }),

  actions: {
    async fetchCategorias() {
      try {
        const response = await axios.get('http://localhost:8080/categorias')
        this.categorias = response.data
      } catch (error) {
        console.error('Error fetching categorias:', error)
      }
    },

    async fetchProvincias() {
      try {
        const response = await axios.get('http://localhost:8080/provincias')
        this.provincias = response.data
      } catch (error) {
        console.error('Error fetching provincias:', error)
      }
    },

    async fetchCantones(provinciaId = null) {
      try {
        const url = provinciaId
          ? `http://localhost:8080/cantones?provincia_id=${provinciaId}`
          : 'http://localhost:8080/cantones'
        const response = await axios.get(url)
        this.cantones = response.data
      } catch (error) {
        console.error('Error fetching cantones:', error)
      }
    },

    async fetchDistritos(cantonId = null) {
      try {
        const url = cantonId
          ? `http://localhost:8080/distritos?canton_id=${cantonId}`
          : 'http://localhost:8080/distritos'
        const response = await axios.get(url)
        this.distritos = response.data
      } catch (error) {
        console.error('Error fetching distritos:', error)
      }
    },

    async fetchAllCatalogs() {
      this.loading = true
      await Promise.all([
        this.fetchCategorias(),
        this.fetchProvincias(),
        this.fetchCantones(),
        this.fetchDistritos(),
      ])
      this.loading = false
    },
    clearErrors() {
      this.categoriasError = null
      this.provinciasError = null
      this.cantonesError = null
      this.distritosError = null
      this.error = null
    },

    clearCantones() {
      this.cantones = []
      this.cantonesError = null
    },

    clearDistritos() {
      this.distritos = []
      this.distritosError = null
    },

    async loadCategorias() {
      if (this.categoriasLoading) return

      this.categoriasLoading = true
      this.categoriasError = null

      try {
        const response = await axios.get(`${API_BASE_URL}/categories`)
        this.categorias = response.data
      } catch (error) {
        console.error('Error al cargar categorías:', error)
        this.categoriasError = error.response?.data?.detail || 'Error al cargar las categorías'
        throw error
      } finally {
        this.categoriasLoading = false
      }
    },

    async createCategory(categoryName) {
      this.isLoading = true
      this.error = null

      try {
        const formData = new FormData()
        formData.append('category', categoryName)

        const response = await axios.post(`${API_BASE_URL}/categoriesCreated`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        this.categorias.push(response.data)
        return response.data
      } catch (error) {
        console.error('Error al crear categoría:', error)
        this.error = error.response?.data?.detail || 'Error al crear la categoría'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async loadProvincias() {
      if (this.provinciasLoading) return

      this.provinciasLoading = true
      this.provinciasError = null

      try {
        const response = await axios.get(`${API_BASE_URL}/provinces`)
        this.provincias = response.data
      } catch (error) {
        console.error('Error al cargar provincias:', error)
        this.provinciasError = error.response?.data?.detail || 'Error al cargar las provincias'
        throw error
      } finally {
        this.provinciasLoading = false
      }
    },

    async createProvincia(provinceName) {
      this.isLoading = true
      this.error = null

      try {
        const formData = new FormData()
        formData.append('province', provinceName)

        const response = await axios.post(`${API_BASE_URL}/provincesCreated`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        this.provincias.push(response.data)
        return response.data
      } catch (error) {
        console.error('Error al crear provincia:', error)
        this.error = error.response?.data?.detail || 'Error al crear la provincia'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async loadCantonesByProvincia(provinciaId) {
      if (this.cantonesLoading) return

      this.cantonesLoading = true
      this.cantonesError = null

      this.clearCantones()
      this.clearDistritos()

      try {
        const response = await axios.get(`${API_BASE_URL}/cantons/${provinciaId}`)
        this.cantones = response.data
      } catch (error) {
        console.error('Error al cargar cantones:', error)
        this.cantonesError = error.response?.data?.detail || 'Error al cargar los cantones'
        throw error
      } finally {
        this.cantonesLoading = false
      }
    },

    async createCanton(cantonName, provinciaId) {
      this.isLoading = true
      this.error = null

      try {
        const formData = new FormData()
        formData.append('canton', cantonName)
        formData.append('province_id', provinciaId)

        const response = await axios.post(`${API_BASE_URL}/cantonsCreated`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        this.cantones.push(response.data)
        return response.data
      } catch (error) {
        console.error('Error al crear cantón:', error)
        this.error = error.response?.data?.detail || 'Error al crear el cantón'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async loadDistritosByCanton(cantonId) {
      if (this.distritosLoading) return

      this.distritosLoading = true
      this.distritosError = null

      this.clearDistritos()

      try {
        const response = await axios.get(`${API_BASE_URL}/districts/${cantonId}`)
        this.distritos = response.data
      } catch (error) {
        console.error('Error al cargar distritos:', error)
        this.distritosError = error.response?.data?.detail || 'Error al cargar los distritos'
        throw error
      } finally {
        this.distritosLoading = false
      }
    },

    async initializeCatalogs() {
      try {
        await Promise.all([this.loadCategorias(), this.loadProvincias()])
      } catch (error) {
        console.error('Error al inicializar catálogos:', error)
        throw error
      }
    },

    resetAll() {
      this.categorias = []
      this.provincias = []
      this.cantones = []
      this.distritos = []
      this.clearErrors()
    },

    getFullLocation(districtId) {
      const distrito = this.getDistritoById(districtId)
      if (!distrito) return ''

      const canton = this.getCantonById(distrito.canton_id)
      if (!canton) return distrito.name

      const provincia = this.getProvinciaById(canton.province_id)
      if (!provincia) return `${distrito.name}, ${canton.name}`

      return `${distrito.name}, ${canton.name}, ${provincia.name}`
    },
  },

  getters: {
    hasCategories: (state) => state.categorias.length > 0,
    hasProvincias: (state) => state.provincias.length > 0,
    hasCantonesForCurrentProvincia: (state) => state.cantones.length > 0,
    hasDistritosForCurrentCanton: (state) => state.distritos.length > 0,

    getCategoryById: (state) => (id) => {
      return state.categorias.find((cat) => cat.id === id)
    },
    getProvinciaById: (state) => (id) => {
      return state.provincias.find((prov) => prov.id === id)
    },
    getCantonById: (state) => (id) => {
      return state.cantones.find((cant) => cant.id === id)
    },
    getDistritoById: (state) => (id) => {
      return state.distritos.find((dist) => dist.id === id)
    },

    hasErrors: (state) => {
      return (
        state.categoriasError ||
        state.provinciasError ||
        state.cantonesError ||
        state.distritosError ||
        state.error
      )
    },

    isAnyLoading: (state) => {
      return (
        state.categoriasLoading ||
        state.provinciasLoading ||
        state.cantonesLoading ||
        state.distritosLoading ||
        state.isLoading
      )
    },
  },
})
