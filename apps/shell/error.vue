<script setup lang="ts">
import { getTopLevelRoutes } from '~/config/legacy-routes'

const props = defineProps<{
  error: {
    statusCode: number
    statusMessage?: string
    message?: string
  }
}>()

const availableRoutes = getTopLevelRoutes()

const handleClearError = () => {
  clearError({ redirect: '/' })
}

useHead({
  title: `${props.error.statusCode} - ${props.error.statusMessage || 'Error'} | Shell App`,
})
</script>

<template>
  <div class="shell-min-h-screen shell-bg-gray-100 shell-flex shell-items-center shell-justify-center shell-p-4">
    <div class="shell-max-w-md shell-w-full shell-text-center">
      <!-- Error Icon -->
      <div class="shell-text-8xl shell-mb-6">
        <template v-if="error.statusCode === 404">🔍</template>
        <template v-else-if="error.statusCode >= 500">💥</template>
        <template v-else>⚠️</template>
      </div>

      <!-- Error Code -->
      <h1 class="shell-text-6xl shell-font-bold shell-text-gray-900 shell-mb-2">
        {{ error.statusCode }}
      </h1>

      <!-- Error Message -->
      <h2 class="shell-text-xl shell-text-gray-600 shell-mb-4">
        {{ error.statusMessage || 'Something went wrong' }}
      </h2>

      <!-- Detail Message -->
      <p v-if="error.message" class="shell-text-gray-500 shell-mb-8">
        {{ error.message }}
      </p>

      <!-- Actions -->
      <div class="shell-flex shell-flex-col shell-items-center shell-gap-4">
        <button
          class="shell-px-6 shell-py-3 shell-bg-blue-600 shell-text-white shell-rounded-lg hover:shell-bg-blue-700 shell-transition shell-font-medium"
          @click="handleClearError"
        >
          Go to Home
        </button>

        <div class="shell-text-sm shell-text-gray-500">
          Or try one of these pages:
        </div>

        <div class="shell-flex shell-gap-3 shell-flex-wrap shell-justify-center">
          <NuxtLink
            to="/about"
            class="shell-px-4 shell-py-2 shell-border shell-border-gray-300 shell-rounded-lg hover:shell-bg-white shell-transition shell-text-gray-700"
            @click="clearError()"
          >
            About
          </NuxtLink>
          <NuxtLink
            v-for="route in availableRoutes"
            :key="route.path"
            :to="`/${route.path}`"
            class="shell-px-4 shell-py-2 shell-border shell-border-orange-300 shell-text-orange-700 shell-rounded-lg hover:shell-bg-orange-50 shell-transition"
            @click="clearError()"
          >
            {{ route.title }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
