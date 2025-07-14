<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <input
      type="text"
      placeholder="Buscar por nombre"
      class="input"
      :value="filters.nombre"
      @input="$emit('update-filter', 'nombre', $event.target.value)"
    />

    <select
      :value="filters.categoria"
      @change="$emit('update-filter', 'categoria', $event.target.value)"
    >
      <option value="">Todas las categorías</option>
      <option v-for="cat in categorias" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
    </select>

    <input
      type="date"
      :value="filters.fecha"
      @input="$emit('update-filter', 'fecha', $event.target.value)"
    />

    <select :value="filters.provincia" @change="onProvinciaChange($event)">
      <option value="">Todas las provincias</option>
      <option v-for="prov in provincias" :key="prov.id" :value="prov.id">{{ prov.name }}</option>
    </select>

    <select :value="filters.canton" @change="onCantonChange($event)">
      <option value="">Todos los cantones</option>
      <option v-for="can in cantones" :key="can.id" :value="can.id">{{ can.name }}</option>
    </select>

    <select
      :value="filters.distrito"
      @change="$emit('update-filter', 'distrito', $event.target.value)"
    >
      <option value="">Todos los distritos</option>
      <option v-for="dis in distritos" :key="dis.id" :value="dis.id">{{ dis.name }}</option>
    </select>

    <button class="btn" @click="$emit('clear-filters')">Limpiar filtros</button>
  </div>
</template>

<script setup>
defineProps(['filters', 'categorias', 'provincias', 'cantones', 'distritos'])
const emit = defineEmits(['update-filter', 'clear-filters', 'provincia-change', 'canton-change'])

const onProvinciaChange = (event) => {
  emit('update-filter', 'provincia', event.target.value)
  emit('provincia-change', event.target.value)
}

const onCantonChange = (event) => {
  emit('update-filter', 'canton', event.target.value)
  emit('canton-change', event.target.value)
}
</script>
