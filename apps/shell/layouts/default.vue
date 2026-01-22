<script setup lang="ts">
const isSidebarCollapsed = ref(false)

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

provide('sidebarCollapsed', isSidebarCollapsed)
provide('toggleSidebar', toggleSidebar)
</script>

<template>
  <div class="shell-flex shell-h-screen shell-bg-gray-100">
    <!-- Sidebar -->
    <AppSidebar :collapsed="isSidebarCollapsed" />

    <!-- Main Content Area -->
    <div class="shell-flex shell-flex-1 shell-flex-col shell-overflow-hidden">
      <!-- Header -->
      <AppHeader @toggle-sidebar="toggleSidebar" />

      <!-- Page Content -->
      <main class="shell-flex-1 shell-overflow-auto shell-p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
