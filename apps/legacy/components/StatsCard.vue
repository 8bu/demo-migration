<template>
  <div class="legacy-bg-white legacy-rounded-xl legacy-shadow-lg legacy-p-6 legacy-border legacy-border-gray-100">
    <div class="legacy-flex legacy-items-center legacy-justify-between">
      <div>
        <p class="legacy-text-sm legacy-font-medium legacy-text-gray-500 legacy-uppercase legacy-tracking-wide">
          {{ title }}
        </p>
        <p class="legacy-mt-2 legacy-text-3xl legacy-font-bold legacy-text-gray-900">
          {{ formattedValue }}
        </p>
        <div v-if="change !== null" class="legacy-mt-2 legacy-flex legacy-items-center legacy-text-sm">
          <span :class="changeClass">
            <svg v-if="change >= 0" class="legacy-w-4 legacy-h-4 legacy-inline" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
            </svg>
            <svg v-else class="legacy-w-4 legacy-h-4 legacy-inline" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            {{ Math.abs(change) }}%
          </span>
          <span class="legacy-text-gray-500 legacy-ml-2">vs last period</span>
        </div>
      </div>
      <div :class="iconBgClass" class="legacy-p-3 legacy-rounded-full">
        <slot name="icon">
          <svg class="legacy-w-6 legacy-h-6" :class="iconClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
          </svg>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatsCard',
  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      type: [Number, String],
      required: true
    },
    change: {
      type: Number,
      default: null
    },
    format: {
      type: String,
      default: 'number', // 'number', 'currency', 'percent'
      validator: v => ['number', 'currency', 'percent'].includes(v)
    },
    color: {
      type: String,
      default: 'blue', // 'blue', 'green', 'red', 'purple', 'yellow'
      validator: v => ['blue', 'green', 'red', 'purple', 'yellow'].includes(v)
    }
  },
  computed: {
    formattedValue() {
      if (this.format === 'currency') {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(this.value)
      }
      if (this.format === 'percent') {
        return `${this.value}%`
      }
      return new Intl.NumberFormat('en-US').format(this.value)
    },
    changeClass() {
      return this.change >= 0
        ? 'legacy-text-green-600'
        : 'legacy-text-red-600'
    },
    iconBgClass() {
      const colors = {
        blue: 'legacy-bg-blue-100',
        green: 'legacy-bg-green-100',
        red: 'legacy-bg-red-100',
        purple: 'legacy-bg-purple-100',
        yellow: 'legacy-bg-yellow-100'
      }
      return colors[this.color]
    },
    iconClass() {
      const colors = {
        blue: 'legacy-text-blue-600',
        green: 'legacy-text-green-600',
        red: 'legacy-text-red-600',
        purple: 'legacy-text-purple-600',
        yellow: 'legacy-text-yellow-600'
      }
      return colors[this.color]
    }
  }
}
</script>
