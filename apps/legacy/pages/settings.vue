<template>
  <div class="legacy-min-h-screen legacy-bg-gray-50 legacy-p-6">
    <div class="legacy-max-w-4xl legacy-mx-auto">
      <!-- Header -->
      <div class="legacy-mb-8">
        <h1 class="legacy-text-3xl legacy-font-bold legacy-text-gray-900">Settings</h1>
        <p class="legacy-text-gray-600 legacy-mt-2">Manage your account preferences</p>
      </div>

      <!-- Settings Sections -->
      <div class="legacy-space-y-6">
        <!-- Profile Section -->
        <div class="legacy-bg-white legacy-rounded-lg legacy-shadow legacy-p-6">
          <h2 class="legacy-text-xl legacy-font-semibold legacy-text-gray-800 legacy-mb-4">Profile</h2>
          <div class="legacy-space-y-4">
            <div>
              <label class="legacy-block legacy-text-sm legacy-font-medium legacy-text-gray-700">Display Name</label>
              <input
                v-model="profile.name"
                type="text"
                class="legacy-mt-1 legacy-block legacy-w-full legacy-rounded-md legacy-border-gray-300 legacy-shadow-sm legacy-p-2 legacy-border"
              />
            </div>
            <div>
              <label class="legacy-block legacy-text-sm legacy-font-medium legacy-text-gray-700">Email</label>
              <input
                v-model="profile.email"
                type="email"
                class="legacy-mt-1 legacy-block legacy-w-full legacy-rounded-md legacy-border-gray-300 legacy-shadow-sm legacy-p-2 legacy-border"
              />
            </div>
          </div>
        </div>

        <!-- Notifications Section -->
        <div class="legacy-bg-white legacy-rounded-lg legacy-shadow legacy-p-6">
          <h2 class="legacy-text-xl legacy-font-semibold legacy-text-gray-800 legacy-mb-4">Notifications</h2>
          <div class="legacy-space-y-3">
            <label class="legacy-flex legacy-items-center legacy-space-x-3">
              <input v-model="notifications.email" type="checkbox" class="legacy-rounded legacy-text-blue-600" />
              <span class="legacy-text-gray-700">Email notifications</span>
            </label>
            <label class="legacy-flex legacy-items-center legacy-space-x-3">
              <input v-model="notifications.push" type="checkbox" class="legacy-rounded legacy-text-blue-600" />
              <span class="legacy-text-gray-700">Push notifications</span>
            </label>
            <label class="legacy-flex legacy-items-center legacy-space-x-3">
              <input v-model="notifications.sms" type="checkbox" class="legacy-rounded legacy-text-blue-600" />
              <span class="legacy-text-gray-700">SMS notifications</span>
            </label>
          </div>
        </div>

        <!-- Theme Section (synced with Shell) -->
        <div class="legacy-bg-white legacy-rounded-lg legacy-shadow legacy-p-6">
          <h2 class="legacy-text-xl legacy-font-semibold legacy-text-gray-800 legacy-mb-4">Appearance</h2>
          <p class="legacy-text-sm legacy-text-gray-500 legacy-mb-3">Theme is synced with Shell app</p>
          <div class="legacy-flex legacy-items-center legacy-space-x-4">
            <span class="legacy-text-gray-700">Current theme:</span>
            <span class="legacy-px-3 legacy-py-1 legacy-rounded-full legacy-text-sm legacy-font-medium"
                  :class="sharedTheme === 'dark' ? 'legacy-bg-gray-800 legacy-text-white' : 'legacy-bg-yellow-100 legacy-text-yellow-800'">
              {{ sharedTheme }}
            </span>
          </div>
        </div>

        <!-- Save Button -->
        <div class="legacy-flex legacy-justify-end">
          <button
            @click="saveSettings"
            class="legacy-px-6 legacy-py-2 legacy-bg-blue-600 legacy-text-white legacy-rounded-lg legacy-hover:bg-blue-700 legacy-transition"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SettingsPage',
  props: {
    sharedTheme: {
      type: String,
      default: 'light'
    },
    sharedUser: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      profile: {
        name: '',
        email: ''
      },
      notifications: {
        email: true,
        push: false,
        sms: false
      }
    }
  },
  watch: {
    sharedUser: {
      immediate: true,
      handler(user) {
        if (user) {
          this.profile.name = user.name || ''
          this.profile.email = user.email || ''
        }
      }
    }
  },
  methods: {
    saveSettings() {
      console.log('[Legacy Settings] Saving:', {
        profile: this.profile,
        notifications: this.notifications
      })
      alert('Settings saved! (Check console)')
    }
  }
}
</script>
