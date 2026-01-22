<template>
  <div class="legacy-flex legacy-min-h-screen legacy-items-center legacy-justify-center legacy-bg-gray-100">
    <div class="legacy-text-center">
      <h1 class="legacy-text-2xl legacy-font-bold legacy-text-gray-900 legacy-mb-4">
        Legacy Nuxt 2 App
      </h1>
      <p class="legacy-text-gray-600 legacy-mb-6">Redirecting to dashboard...</p>
      <nuxt-link
        to="/dashboard"
        class="legacy-inline-flex legacy-items-center legacy-gap-2 legacy-rounded-lg legacy-bg-primary-600 legacy-px-6 legacy-py-3 legacy-text-sm legacy-font-medium legacy-text-white hover:legacy-bg-primary-700"
      >
        Go to Dashboard
        <svg class="legacy-h-5 legacy-w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',

  mounted() {
    // Auto-redirect to dashboard after a short delay
    setTimeout(() => {
      this.$router.push('/dashboard')
    }, 1000)
  }
}
</script>
