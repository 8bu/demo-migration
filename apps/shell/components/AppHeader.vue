<script setup lang="ts">
/**
 * AppHeader - Shell application header with shared state integration
 *
 * Demonstrates cross-app state sharing:
 * - User info from shared state
 * - Theme toggle that affects legacy apps
 * - Login/logout that legacy apps can react to
 */

const {
  isAuthenticated,
  currentUser,
  theme,
  login,
  logout,
  toggleTheme,
  emitToLegacy
} = useSharedState()

defineEmits<{
  toggleSidebar: []
}>()

const isUserMenuOpen = ref(false)

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

// Demo login with sample user
const handleLogin = () => {
  login(
    {
      id: '1',
      email: 'demo@travelstop.com',
      name: 'Demo User',
      role: 'admin',
    },
    'demo-jwt-token-12345'
  )
  // Notify legacy apps
  emitToLegacy('auth:login', { user: currentUser.value })
  isUserMenuOpen.value = false
}

// Handle logout
const handleLogout = () => {
  logout()
  // Notify legacy apps
  emitToLegacy('auth:logout', { reason: 'user_initiated' })
  isUserMenuOpen.value = false
}

// Handle theme toggle
const handleThemeToggle = () => {
  toggleTheme()
  // Notify legacy apps about theme change
  // theme.value is already updated by toggleTheme(), so emit the current value
  emitToLegacy('theme:changed', { theme: theme.value })
}

// Get user initials for avatar
const userInitials = computed(() => {
  if (!currentUser.value?.name) return '?'
  return currentUser.value.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

// Close menu when clicking outside
const userMenuRef = ref<HTMLElement | null>(null)

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const handleClickOutside = (event: MouseEvent) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    isUserMenuOpen.value = false
  }
}
</script>

<template>
  <header
    class="shell-flex shell-h-16 shell-items-center shell-justify-between shell-border-b shell-border-gray-200 shell-bg-white shell-px-6"
    :class="{ 'shell-bg-gray-800 shell-border-gray-700': theme === 'dark' }"
  >
    <!-- Left side: Menu toggle and Logo -->
    <div class="shell-flex shell-items-center shell-gap-4">
      <!-- Mobile menu toggle -->
      <button
        class="shell-rounded-lg shell-p-2 shell-text-gray-500 hover:shell-bg-gray-100 hover:shell-text-gray-700"
        :class="{ 'shell-text-gray-400 hover:shell-bg-gray-700 hover:shell-text-gray-200': theme === 'dark' }"
        aria-label="Toggle sidebar"
        @click="$emit('toggleSidebar')"
      >
        <svg
          class="shell-h-6 shell-w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <!-- Logo -->
      <NuxtLink
        to="/"
        class="shell-flex shell-items-center shell-gap-2"
      >
        <div
          class="shell-flex shell-h-8 shell-w-8 shell-items-center shell-justify-center shell-rounded-lg shell-bg-primary-600"
        >
          <span class="shell-text-sm shell-font-bold shell-text-white">S</span>
        </div>
        <span
          class="shell-text-xl shell-font-semibold shell-text-gray-900"
          :class="{ 'shell-text-white': theme === 'dark' }"
        >
          Shell
        </span>
      </NuxtLink>

      <!-- Shared State Indicator -->
      <div class="shell-hidden shell-items-center shell-gap-2 shell-rounded-full shell-bg-green-100 shell-px-3 shell-py-1 md:shell-flex">
        <span class="shell-h-2 shell-w-2 shell-rounded-full shell-bg-green-500 shell-animate-pulse" />
        <span class="shell-text-xs shell-font-medium shell-text-green-700">
          State Sharing Active
        </span>
      </div>
    </div>

    <!-- Right side: Theme toggle, Search and User menu -->
    <div class="shell-flex shell-items-center shell-gap-4">
      <!-- Theme toggle button -->
      <button
        class="shell-flex shell-items-center shell-gap-2 shell-rounded-lg shell-border shell-border-gray-300 shell-px-3 shell-py-2 shell-text-sm shell-font-medium shell-transition hover:shell-bg-gray-100"
        :class="{
          'shell-border-gray-600 shell-text-gray-300 hover:shell-bg-gray-700': theme === 'dark',
          'shell-text-gray-700': theme === 'light'
        }"
        @click="handleThemeToggle"
      >
        <!-- Sun icon for light mode -->
        <svg
          v-if="theme === 'light'"
          class="shell-h-4 shell-w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
        <!-- Moon icon for dark mode -->
        <svg
          v-else
          class="shell-h-4 shell-w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
        <span class="shell-hidden sm:shell-inline">
          {{ theme === 'light' ? 'Light' : 'Dark' }}
        </span>
      </button>

      <!-- Search bar -->
      <div class="shell-hidden shell-relative md:shell-block">
        <input
          type="text"
          placeholder="Search..."
          class="shell-w-64 shell-rounded-lg shell-border shell-border-gray-300 shell-bg-gray-50 shell-py-2 shell-pl-10 shell-pr-4 shell-text-sm focus:shell-border-primary-500 focus:shell-outline-none focus:shell-ring-1 focus:shell-ring-primary-500"
          :class="{ 'shell-bg-gray-700 shell-border-gray-600 shell-text-white shell-placeholder-gray-400': theme === 'dark' }"
        >
        <svg
          class="shell-absolute shell-left-3 shell-top-1/2 shell-h-4 shell-w-4 shell--translate-y-1/2 shell-text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <!-- Notifications -->
      <button
        class="shell-relative shell-rounded-lg shell-p-2 shell-text-gray-500 hover:shell-bg-gray-100 hover:shell-text-gray-700"
        :class="{ 'shell-text-gray-400 hover:shell-bg-gray-700 hover:shell-text-gray-200': theme === 'dark' }"
      >
        <svg
          class="shell-h-6 shell-w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        <span
          class="shell-absolute shell-right-1 shell-top-1 shell-h-2 shell-w-2 shell-rounded-full shell-bg-red-500"
        />
      </button>

      <!-- User menu / Login button -->
      <div
        ref="userMenuRef"
        class="shell-relative"
      >
        <!-- Show login button if not authenticated -->
        <button
          v-if="!isAuthenticated"
          class="shell-flex shell-items-center shell-gap-2 shell-rounded-lg shell-bg-primary-600 shell-px-4 shell-py-2 shell-text-sm shell-font-medium shell-text-white hover:shell-bg-primary-700"
          @click="handleLogin"
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
              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
            />
          </svg>
          Login
        </button>

        <!-- Show user menu if authenticated -->
        <template v-else>
          <button
            class="shell-flex shell-items-center shell-gap-2 shell-rounded-lg shell-p-2 hover:shell-bg-gray-100"
            :class="{ 'hover:shell-bg-gray-700': theme === 'dark' }"
            @click="toggleUserMenu"
          >
            <div
              class="shell-flex shell-h-8 shell-w-8 shell-items-center shell-justify-center shell-rounded-full shell-bg-primary-100"
            >
              <span class="shell-text-sm shell-font-medium shell-text-primary-700">
                {{ userInitials }}
              </span>
            </div>
            <span
              class="shell-hidden shell-text-sm shell-font-medium shell-text-gray-700 md:shell-block"
              :class="{ 'shell-text-gray-200': theme === 'dark' }"
            >
              {{ currentUser?.name || 'User' }}
            </span>
            <svg
              class="shell-h-4 shell-w-4 shell-text-gray-500"
              :class="{ 'shell-text-gray-400': theme === 'dark' }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          <!-- Dropdown menu -->
          <Transition
            enter-active-class="shell-transition shell-ease-out shell-duration-100"
            enter-from-class="shell-transform shell-opacity-0 shell-scale-95"
            enter-to-class="shell-transform shell-opacity-100 shell-scale-100"
            leave-active-class="shell-transition shell-ease-in shell-duration-75"
            leave-from-class="shell-transform shell-opacity-100 shell-scale-100"
            leave-to-class="shell-transform shell-opacity-0 shell-scale-95"
          >
            <div
              v-if="isUserMenuOpen"
              class="shell-absolute shell-right-0 shell-mt-2 shell-w-56 shell-origin-top-right shell-rounded-lg shell-bg-white shell-py-1 shell-shadow-lg shell-ring-1 shell-ring-black shell-ring-opacity-5"
              :class="{ 'shell-bg-gray-800 shell-ring-gray-700': theme === 'dark' }"
            >
              <!-- User info -->
              <div class="shell-border-b shell-border-gray-200 shell-px-4 shell-py-3" :class="{ 'shell-border-gray-700': theme === 'dark' }">
                <p class="shell-text-sm shell-font-medium shell-text-gray-900" :class="{ 'shell-text-white': theme === 'dark' }">
                  {{ currentUser?.name }}
                </p>
                <p class="shell-text-xs shell-text-gray-500" :class="{ 'shell-text-gray-400': theme === 'dark' }">
                  {{ currentUser?.email }}
                </p>
                <span class="shell-mt-1 shell-inline-block shell-rounded-full shell-bg-primary-100 shell-px-2 shell-py-0.5 shell-text-xs shell-font-medium shell-text-primary-700">
                  {{ currentUser?.role }}
                </span>
              </div>

              <a
                href="#"
                class="shell-block shell-px-4 shell-py-2 shell-text-sm shell-text-gray-700 hover:shell-bg-gray-100"
                :class="{ 'shell-text-gray-200 hover:shell-bg-gray-700': theme === 'dark' }"
              >
                Your Profile
              </a>
              <a
                href="#"
                class="shell-block shell-px-4 shell-py-2 shell-text-sm shell-text-gray-700 hover:shell-bg-gray-100"
                :class="{ 'shell-text-gray-200 hover:shell-bg-gray-700': theme === 'dark' }"
              >
                Settings
              </a>
              <hr class="shell-my-1 shell-border-gray-200" :class="{ 'shell-border-gray-700': theme === 'dark' }">
              <button
                class="shell-block shell-w-full shell-px-4 shell-py-2 shell-text-left shell-text-sm shell-text-red-600 hover:shell-bg-red-50"
                :class="{ 'hover:shell-bg-red-900/20': theme === 'dark' }"
                @click="handleLogout"
              >
                Sign out
              </button>
            </div>
          </Transition>
        </template>
      </div>
    </div>
  </header>
</template>
