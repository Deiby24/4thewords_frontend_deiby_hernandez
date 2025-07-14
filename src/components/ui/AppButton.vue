<template>
  <button
    :type="type"
    :disabled="disabled"
    :aria-disabled="disabled"
    :class="buttonClasses"
    @click="$emit('click')"
  >
    <span v-if="$slots.icon" class="mr-2 flex items-center">
      <slot name="icon" />
    </span>

    <span class="whitespace-nowrap">
      <slot />
    </span>
  </button>
</template>

<script>
export default {
  name: 'AppButton',
  emits: ['click'],
  props: {
    type: {
      type: String,
      default: 'button',
    },
    variant: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary', 'danger', 'outline', 'ghost'].includes(value),
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    buttonClasses() {
      const base =
        'inline-flex items-center justify-center font-medium rounded-xl transition duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-opacity-75'

      const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-400',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
        outline:
          'border border-gray-300 text-gray-800 bg-white hover:bg-gray-50 focus-visible:ring-blue-400',
        ghost: 'text-gray-600 hover:bg-gray-100 focus-visible:ring-gray-300',
      }

      const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-5 py-3 text-base',
      }

      const disabledClasses = this.disabled
        ? 'opacity-50 cursor-not-allowed pointer-events-none'
        : ''

      return [base, variants[this.variant], sizes[this.size], disabledClasses].join(' ')
    },
  },
}
</script>
