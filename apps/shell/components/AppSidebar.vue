<script setup lang="ts">
interface NavItem {
  name: string
  path: string
  icon: string
  isLegacy?: boolean
}

defineProps<{
  collapsed: boolean
}>()

const route = useRoute()

const navItems: NavItem[] = [
  {
    name: 'Home',
    path: '/',
    icon: 'home',
  },
  {
    name: 'About',
    path: '/about',
    icon: 'info',
  },
  {
    name: 'Demo',
    path: '/demo',
    icon: 'cube',
  },
]

// Legacy routes - no /legacy prefix, handled by catch-all [...slug].vue
const legacyNavItems: NavItem[] = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: 'dashboard',
    isLegacy: true,
  },
  {
    name: 'Booking',
    path: '/booking',
    icon: 'calendar',
    isLegacy: true,
  },
  {
    name: 'Reports',
    path: '/reports',
    icon: 'chart',
    isLegacy: true,
  },
  {
    name: 'Settings',
    path: '/settings',
    icon: 'cog',
    isLegacy: true,
  },
]

const isActive = (path: string) => {
  return route.path === path
}

const getIcon = (icon: string) => {
  const icons: Record<string, string> = {
    home: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    dashboard:
      'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z',
    calendar:
      'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    chart:
      'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    cog: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    cube: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
  }
  return icons[icon] || icons.home
}
</script>

<template>
  <aside
    class="shell-flex shell-flex-col shell-bg-sidebar-bg shell-transition-all shell-duration-300"
    :class="collapsed ? 'shell-w-20' : 'shell-w-64'"
  >
    <!-- Navigation -->
    <nav class="shell-flex-1 shell-space-y-1 shell-px-3 shell-py-4">
      <!-- Main Navigation -->
      <div class="shell-mb-6">
        <p
          v-if="!collapsed"
          class="shell-mb-2 shell-px-4 shell-text-xs shell-font-semibold shell-uppercase shell-tracking-wider shell-text-gray-400"
        >
          Main
        </p>
        <NuxtLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="shell-nav-link"
          :class="{ active: isActive(item.path) }"
          :title="collapsed ? item.name : undefined"
        >
          <svg
            class="shell-h-5 shell-w-5 shell-flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              :d="getIcon(item.icon)"
            />
          </svg>
          <span
            v-if="!collapsed"
            class="shell-truncate"
          >{{ item.name }}</span>
        </NuxtLink>
      </div>

      <!-- Legacy Navigation -->
      <div>
        <p
          v-if="!collapsed"
          class="shell-mb-2 shell-px-4 shell-text-xs shell-font-semibold shell-uppercase shell-tracking-wider shell-text-gray-400"
        >
          Legacy
        </p>
        <div
          v-else
          class="shell-my-2 shell-border-t shell-border-gray-600"
        />
        <NuxtLink
          v-for="item in legacyNavItems"
          :key="item.path"
          :to="item.path"
          class="shell-nav-link"
          :class="{ active: isActive(item.path) }"
          :title="collapsed ? item.name : undefined"
        >
          <svg
            class="shell-h-5 shell-w-5 shell-flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              :d="getIcon(item.icon)"
            />
          </svg>
          <span
            v-if="!collapsed"
            class="shell-truncate"
          >{{ item.name }}</span>
          <span
            v-if="!collapsed && item.isLegacy"
            class="shell-ml-auto shell-rounded shell-bg-amber-500/20 shell-px-2 shell-py-0.5 shell-text-xs shell-text-amber-400"
          >
            Legacy
          </span>
        </NuxtLink>
      </div>
    </nav>

    <!-- Bottom section -->
    <div class="shell-border-t shell-border-gray-700 shell-p-4">
      <div
        v-if="!collapsed"
        class="shell-flex shell-items-center shell-gap-3 shell-rounded-lg shell-bg-gray-800 shell-p-3"
      >
        <div
          class="shell-flex shell-h-10 shell-w-10 shell-items-center shell-justify-center shell-rounded-full shell-bg-primary-600"
        >
          <span class="shell-text-sm shell-font-bold shell-text-white">JD</span>
        </div>
        <div class="shell-flex-1 shell-min-w-0">
          <p class="shell-truncate shell-text-sm shell-font-medium shell-text-white">
            John Doe
          </p>
          <p class="shell-truncate shell-text-xs shell-text-gray-400">
            john@example.com
          </p>
        </div>
      </div>
      <div
        v-else
        class="shell-flex shell-justify-center"
      >
        <div
          class="shell-flex shell-h-10 shell-w-10 shell-items-center shell-justify-center shell-rounded-full shell-bg-primary-600"
        >
          <span class="shell-text-sm shell-font-bold shell-text-white">JD</span>
        </div>
      </div>
    </div>
  </aside>
</template>
