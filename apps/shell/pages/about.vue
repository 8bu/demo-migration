<script setup lang="ts">
definePageMeta({
  title: 'About',
})

useHead({
  title: 'About - Shell App',
})

const features = [
  {
    title: 'Modern Architecture',
    description: 'Built with Nuxt 4, Vue 3 Composition API, and Vite for lightning-fast development.',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
  },
  {
    title: 'Micro-Frontend Ready',
    description: 'Designed to host legacy applications through Module Federation and Web Components with Shadow DOM isolation.',
    icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z',
  },
  {
    title: 'Tailwind CSS',
    description: 'Utility-first CSS framework with custom configuration and shell- prefix for isolation.',
    icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01',
  },
  {
    title: 'TypeScript First',
    description: 'Full TypeScript support with strict mode enabled for type-safe development.',
    icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
  },
]

const techStack = [
  { name: 'Nuxt', version: '4.2.x' },
  { name: 'Vue', version: '3.5.x' },
  { name: 'Vite', version: '6.x' },
  { name: 'TypeScript', version: '5.7.x' },
  { name: 'Tailwind CSS', version: '3.x' },
]
</script>

<template>
  <div class="shell-space-y-8">
    <!-- Page Header -->
    <div class="shell-text-center">
      <h1 class="shell-text-3xl shell-font-bold shell-text-gray-900">
        About Shell
      </h1>
      <p class="shell-mx-auto shell-mt-4 shell-max-w-2xl shell-text-lg shell-text-gray-500">
        A modern micro-frontend shell application designed to orchestrate and host both native
        and legacy applications in a unified experience.
      </p>
    </div>

    <!-- Features Grid -->
    <div class="shell-grid shell-grid-cols-1 shell-gap-6 md:shell-grid-cols-2">
      <div
        v-for="feature in features"
        :key="feature.title"
        class="shell-card shell-flex shell-gap-4"
      >
        <div
          class="shell-flex shell-h-12 shell-w-12 shell-flex-shrink-0 shell-items-center shell-justify-center shell-rounded-lg shell-bg-primary-100"
        >
          <svg
            class="shell-h-6 shell-w-6 shell-text-primary-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              :d="feature.icon"
            />
          </svg>
        </div>
        <div>
          <h3 class="shell-text-lg shell-font-semibold shell-text-gray-900">
            {{ feature.title }}
          </h3>
          <p class="shell-mt-1 shell-text-sm shell-text-gray-500">
            {{ feature.description }}
          </p>
        </div>
      </div>
    </div>

    <!-- Tech Stack -->
    <div class="shell-card">
      <h2 class="shell-text-xl shell-font-semibold shell-text-gray-900">
        Technology Stack
      </h2>
      <p class="shell-mt-2 shell-text-sm shell-text-gray-500">
        Built with modern, production-ready technologies
      </p>
      <div class="shell-mt-6 shell-flex shell-flex-wrap shell-gap-3">
        <div
          v-for="tech in techStack"
          :key="tech.name"
          class="shell-flex shell-items-center shell-gap-2 shell-rounded-full shell-bg-gray-100 shell-px-4 shell-py-2"
        >
          <span class="shell-font-medium shell-text-gray-900">{{ tech.name }}</span>
          <span class="shell-text-sm shell-text-gray-500">{{ tech.version }}</span>
        </div>
      </div>
    </div>

    <!-- Architecture Overview -->
    <div class="shell-card">
      <h2 class="shell-text-xl shell-font-semibold shell-text-gray-900">
        Architecture Overview
      </h2>
      <div class="shell-mt-6 shell-rounded-lg shell-border shell-border-gray-200 shell-bg-gray-50 shell-p-6">
        <div class="shell-grid shell-grid-cols-1 shell-gap-4 md:shell-grid-cols-3">
          <!-- Shell App -->
          <div class="shell-rounded-lg shell-border-2 shell-border-primary-500 shell-bg-white shell-p-4 shell-text-center">
            <h4 class="shell-font-semibold shell-text-primary-700">
              Shell (Nuxt 4)
            </h4>
            <p class="shell-mt-1 shell-text-xs shell-text-gray-500">
              Host Application
            </p>
          </div>

          <!-- Legacy Apps -->
          <div class="shell-rounded-lg shell-border shell-border-amber-400 shell-bg-amber-50 shell-p-4 shell-text-center">
            <h4 class="shell-font-semibold shell-text-amber-700">
              Legacy (Vue 2)
            </h4>
            <p class="shell-mt-1 shell-text-xs shell-text-gray-500">
              Web Components (Shadow DOM)
            </p>
          </div>

          <!-- Module Federation -->
          <div class="shell-rounded-lg shell-border shell-border-green-400 shell-bg-green-50 shell-p-4 shell-text-center">
            <h4 class="shell-font-semibold shell-text-green-700">
              Module Federation
            </h4>
            <p class="shell-mt-1 shell-text-xs shell-text-gray-500">
              Webpack 5 Runtime
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Help -->
    <div class="shell-card shell-bg-gradient-to-r shell-from-primary-50 shell-to-blue-50">
      <h2 class="shell-text-xl shell-font-semibold shell-text-gray-900">
        Getting Started
      </h2>
      <p class="shell-mt-2 shell-text-sm shell-text-gray-600">
        Use the sidebar to navigate between native pages and legacy application routes.
      </p>
      <div class="shell-mt-4 shell-flex shell-flex-wrap shell-gap-3">
        <NuxtLink
          to="/"
          class="shell-inline-flex shell-items-center shell-gap-2 shell-rounded-lg shell-bg-primary-600 shell-px-4 shell-py-2 shell-text-sm shell-font-medium shell-text-white shell-transition-colors hover:shell-bg-primary-700"
        >
          <svg
            class="shell-h-4 shell-w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          Go to Home
        </NuxtLink>
        <NuxtLink
          to="/dashboard"
          class="shell-inline-flex shell-items-center shell-gap-2 shell-rounded-lg shell-border shell-border-gray-300 shell-bg-white shell-px-4 shell-py-2 shell-text-sm shell-font-medium shell-text-gray-700 shell-transition-colors hover:shell-bg-gray-50"
        >
          <svg
            class="shell-h-4 shell-w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
            />
          </svg>
          View Legacy Dashboard
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
