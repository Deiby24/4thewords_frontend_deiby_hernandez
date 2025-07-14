<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
      <h2 class="text-xl font-semibold mb-4">{{ title }}</h2>
      <p class="text-gray-700 mb-6">{{ message }}</p>
      <div class="flex justify-end gap-2">
        <button class="px-4 py-2 bg-gray-200 rounded" @click="$emit('close')">
          {{ cancelText }}
        </button>
        <button class="px-4 py-2 bg-red-600 text-white rounded" @click="$emit('confirm')">
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppModal',
  props: {
    show: Boolean,
    title: String,
    message: String,
    confirmText: String,
    cancelText: String,
  },
}
</script>
