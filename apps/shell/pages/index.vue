<script setup lang="ts">
definePageMeta({
  title: 'Home',
})

useHead({
  title: 'Home - Shell App',
})

const stats = [
  { label: 'Total Users', value: '2,345', change: '+12%', trend: 'up' },
  { label: 'Active Sessions', value: '1,234', change: '+5%', trend: 'up' },
  { label: 'Revenue', value: '$45,678', change: '+8%', trend: 'up' },
  { label: 'Conversion Rate', value: '3.2%', change: '-2%', trend: 'down' },
]

const recentActivity = [
  { id: 1, action: 'New user registered', user: 'Alice Johnson', time: '2 minutes ago' },
  { id: 2, action: 'Booking confirmed', user: 'Bob Smith', time: '15 minutes ago' },
  { id: 3, action: 'Report generated', user: 'Charlie Brown', time: '1 hour ago' },
  { id: 4, action: 'Payment received', user: 'Diana Prince', time: '2 hours ago' },
]
</script>

<template>
  <div class="shell-space-y-6">
    <!-- Page Header -->
    <div>
      <h1 class="shell-text-2xl shell-font-bold shell-text-gray-900">
        Welcome to Shell
      </h1>
      <p class="shell-mt-1 shell-text-sm shell-text-gray-500">
        Your modern dashboard for managing applications
      </p>
    </div>

    <!-- Stats Grid -->
    <div class="shell-grid shell-grid-cols-1 shell-gap-6 sm:shell-grid-cols-2 lg:shell-grid-cols-4">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="shell-card"
      >
        <p class="shell-text-sm shell-font-medium shell-text-gray-500">
          {{ stat.label }}
        </p>
        <div class="shell-mt-2 shell-flex shell-items-baseline shell-gap-2">
          <p class="shell-text-3xl shell-font-semibold shell-text-gray-900">
            {{ stat.value }}
          </p>
          <span
            class="shell-text-sm shell-font-medium"
            :class="stat.trend === 'up' ? 'shell-text-green-600' : 'shell-text-red-600'"
          >
            {{ stat.change }}
          </span>
        </div>
      </div>
    </div>

    <!-- Content Grid -->
    <div class="shell-grid shell-grid-cols-1 shell-gap-6 lg:shell-grid-cols-2">
      <!-- Recent Activity -->
      <div class="shell-card">
        <h2 class="shell-text-lg shell-font-semibold shell-text-gray-900">
          Recent Activity
        </h2>
        <div class="shell-mt-4 shell-space-y-4">
          <div
            v-for="activity in recentActivity"
            :key="activity.id"
            class="shell-flex shell-items-start shell-gap-4 shell-rounded-lg shell-p-3 hover:shell-bg-gray-50"
          >
            <div
              class="shell-flex shell-h-10 shell-w-10 shell-flex-shrink-0 shell-items-center shell-justify-center shell-rounded-full shell-bg-primary-100"
            >
              <span class="shell-text-sm shell-font-medium shell-text-primary-700">
                {{ activity.user.charAt(0) }}
              </span>
            </div>
            <div class="shell-flex-1 shell-min-w-0">
              <p class="shell-text-sm shell-font-medium shell-text-gray-900">
                {{ activity.action }}
              </p>
              <p class="shell-text-sm shell-text-gray-500">
                {{ activity.user }}
              </p>
            </div>
            <span class="shell-text-xs shell-text-gray-400">{{ activity.time }}</span>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="shell-card">
        <h2 class="shell-text-lg shell-font-semibold shell-text-gray-900">
          Quick Actions
        </h2>
        <div class="shell-mt-4 shell-grid shell-grid-cols-2 shell-gap-4">
          <NuxtLink
            to="/dashboard"
            class="shell-flex shell-flex-col shell-items-center shell-gap-2 shell-rounded-lg shell-border shell-border-gray-200 shell-p-4 shell-transition-colors hover:shell-border-primary-500 hover:shell-bg-primary-50"
          >
            <svg
              class="shell-h-8 shell-w-8 shell-text-primary-600"
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
            <span class="shell-text-sm shell-font-medium shell-text-gray-700">Dashboard</span>
          </NuxtLink>

          <NuxtLink
            to="/booking"
            class="shell-flex shell-flex-col shell-items-center shell-gap-2 shell-rounded-lg shell-border shell-border-gray-200 shell-p-4 shell-transition-colors hover:shell-border-primary-500 hover:shell-bg-primary-50"
          >
            <svg
              class="shell-h-8 shell-w-8 shell-text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span class="shell-text-sm shell-font-medium shell-text-gray-700">Booking</span>
          </NuxtLink>

          <NuxtLink
            to="/reports"
            class="shell-flex shell-flex-col shell-items-center shell-gap-2 shell-rounded-lg shell-border shell-border-gray-200 shell-p-4 shell-transition-colors hover:shell-border-primary-500 hover:shell-bg-primary-50"
          >
            <svg
              class="shell-h-8 shell-w-8 shell-text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <span class="shell-text-sm shell-font-medium shell-text-gray-700">Reports</span>
          </NuxtLink>

          <NuxtLink
            to="/about"
            class="shell-flex shell-flex-col shell-items-center shell-gap-2 shell-rounded-lg shell-border shell-border-gray-200 shell-p-4 shell-transition-colors hover:shell-border-primary-500 hover:shell-bg-primary-50"
          >
            <svg
              class="shell-h-8 shell-w-8 shell-text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span class="shell-text-sm shell-font-medium shell-text-gray-700">About</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
