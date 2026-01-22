<script setup lang="ts">
/**
 * Demo page showing how to use legacy Vue 2 components in the modern Vue 3 shell
 */

definePageMeta({
  title: 'Component Demo'
})

useHead({
  title: 'Component Demo | Shell App'
})

// Sample data for the stats cards
const stats = [
  { title: 'Total Revenue', value: 125000, change: 12.5, format: 'currency', color: 'green' },
  { title: 'Active Users', value: 8432, change: 5.2, format: 'number', color: 'blue' },
  { title: 'Conversion Rate', value: 3.2, change: -1.8, format: 'percent', color: 'purple' },
  { title: 'Avg. Order Value', value: 89.50, change: 8.1, format: 'currency', color: 'yellow' }
]
</script>

<template>
  <div class="shell-space-y-8">
    <!-- Page Header -->
    <div>
      <h1 class="shell-text-3xl shell-font-bold shell-text-gray-900">Component Demo</h1>
      <p class="shell-text-gray-600 shell-mt-2">
        This page demonstrates using <strong>Vue 2 legacy components</strong> inside the <strong>Vue 3 shell</strong>.
      </p>
    </div>

    <!-- Explanation Box -->
    <div class="shell-bg-blue-50 shell-border shell-border-blue-200 shell-rounded-lg shell-p-4">
      <h2 class="shell-text-lg shell-font-semibold shell-text-blue-800 shell-mb-2">How it works</h2>
      <ul class="shell-text-blue-700 shell-text-sm shell-space-y-1 shell-list-disc shell-list-inside">
        <li>The <code class="shell-bg-blue-100 shell-px-1 shell-rounded">StatsCard</code> component is written in Vue 2</li>
        <li>It's wrapped as a Web Component via Module Federation</li>
        <li>The shell loads it using <code class="shell-bg-blue-100 shell-px-1 shell-rounded">&lt;LegacyComponent&gt;</code></li>
        <li>Props are passed as HTML attributes</li>
      </ul>
    </div>

    <!-- Legacy Components Grid -->
    <div>
      <h2 class="shell-text-xl shell-font-semibold shell-text-gray-800 shell-mb-4">Legacy StatsCard Components</h2>
      <div class="shell-grid shell-grid-cols-1 md:shell-grid-cols-2 lg:shell-grid-cols-4 shell-gap-4">
        <LegacyComponent
          v-for="(stat, index) in stats"
          :key="index"
          component="stats-card"
          :component-props="stat"
        />
      </div>
    </div>

    <!-- Native Shell Component for comparison -->
    <div>
      <h2 class="shell-text-xl shell-font-semibold shell-text-gray-800 shell-mb-4">Native Shell Component (Vue 3)</h2>
      <div class="shell-bg-white shell-rounded-lg shell-shadow shell-p-6">
        <p class="shell-text-gray-600">
          This is a native Vue 3 component for comparison. Notice both render seamlessly together.
        </p>
        <div class="shell-mt-4 shell-flex shell-space-x-4">
          <button class="shell-px-4 shell-py-2 shell-bg-blue-600 shell-text-white shell-rounded shell-hover:bg-blue-700">
            Vue 3 Button
          </button>
          <button class="shell-px-4 shell-py-2 shell-border shell-border-gray-300 shell-rounded shell-hover:bg-gray-50">
            Another Button
          </button>
        </div>
      </div>
    </div>

    <!-- Code Example -->
    <div>
      <h2 class="shell-text-xl shell-font-semibold shell-text-gray-800 shell-mb-4">Usage Example</h2>
      <pre class="shell-bg-gray-900 shell-text-gray-100 shell-p-4 shell-rounded-lg shell-overflow-x-auto shell-text-sm"><code>&lt;LegacyComponent
  component="stats-card"
  :component-props="{
    title: 'Total Revenue',
    value: 125000,
    change: 12.5,
    format: 'currency',
    color: 'green'
  }"
/&gt;</code></pre>
    </div>
  </div>
</template>
