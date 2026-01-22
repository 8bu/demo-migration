<script setup lang="ts">
/**
 * Catch-all route for Legacy pages
 *
 * This route handles any path that doesn't match a Shell page.
 * It checks if the path exists in legacy-routes.ts and renders
 * the corresponding Legacy Web Component, otherwise throws 404.
 *
 * Route priority:
 * 1. Shell pages (index.vue, about.vue, etc.) - handled by Nuxt automatically
 * 2. Legacy routes (defined in legacy-routes.ts) - handled here
 * 3. 404 - thrown to Nuxt's error.vue
 */
import { findLegacyRoute, type LegacyRoute } from '~/config/legacy-routes'

definePageMeta({
  layout: 'default',
})

const route = useRoute()

// Get the full path from route params
const slugPath = computed(() => {
  const slugParam = route.params.slug
  if (Array.isArray(slugParam)) {
    return slugParam.join('/')
  }
  return slugParam || ''
})

// Find the matching legacy route
const legacyRoute = computed<LegacyRoute | undefined>(() => {
  if (!slugPath.value) return undefined
  return findLegacyRoute(slugPath.value)
})

// Throw 404 if not a valid legacy route
if (!legacyRoute.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page Not Found',
    message: `The page "/${slugPath.value}" doesn't exist.`
  })
}

// Get module name for LegacyLoader
const moduleName = computed(() => legacyRoute.value?.module || '')

// Page title
const pageTitle = computed(() => legacyRoute.value?.title || 'Legacy Page')

useHead({
  title: () => `${pageTitle.value} | Shell App`,
})
</script>

<template>
  <div class="shell-page-container">
    <!-- Page Header -->
    <div class="shell-mb-6">
      <div class="shell-flex shell-items-center shell-gap-2 shell-text-sm shell-text-gray-500 shell-mb-2">
        <NuxtLink to="/" class="hover:shell-text-blue-600">Home</NuxtLink>
        <span>/</span>
        <span class="shell-text-gray-700">{{ pageTitle }}</span>
      </div>
      <h1 class="shell-text-2xl shell-font-bold shell-text-gray-900">
        {{ pageTitle }}
        <span class="shell-text-sm shell-font-normal shell-text-orange-600 shell-ml-2">
          (Vue 2 Legacy)
        </span>
      </h1>
    </div>

    <!-- Legacy Module Loader -->
    <div class="shell-bg-white shell-rounded-lg shell-shadow-sm shell-border shell-border-gray-200 shell-overflow-hidden">
      <LegacyLoader :module="moduleName" />
    </div>
  </div>
</template>

<style scoped>
.shell-page-container {
  width: 100%;
}
</style>
