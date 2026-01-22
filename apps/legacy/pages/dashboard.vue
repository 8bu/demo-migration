<template>
  <div class="legacy-min-h-screen" :class="sharedTheme === 'dark' ? 'legacy-bg-gray-900' : 'legacy-bg-gray-100'">
    <!-- Header -->
    <header class="legacy-shadow" :class="sharedTheme === 'dark' ? 'legacy-bg-gray-800' : 'legacy-bg-white'">
      <div class="legacy-mx-auto legacy-max-w-7xl legacy-px-4 legacy-py-6 sm:legacy-px-6 lg:legacy-px-8">
        <div class="legacy-flex legacy-items-center legacy-justify-between">
          <h1 class="legacy-text-3xl legacy-font-bold legacy-tracking-tight" :class="sharedTheme === 'dark' ? 'legacy-text-white' : 'legacy-text-gray-900'">
            Dashboard
          </h1>
          <span class="legacy-rounded-full legacy-bg-yellow-100 legacy-px-3 legacy-py-1 legacy-text-sm legacy-font-medium legacy-text-yellow-800">
            Legacy App (Nuxt 2)
          </span>
        </div>
      </div>
    </header>

    <main class="legacy-mx-auto legacy-max-w-7xl legacy-px-4 legacy-py-8 sm:legacy-px-6 lg:legacy-px-8">
      <!-- ========================================== -->
      <!-- SHARED STATE DEMO PANEL                    -->
      <!-- This shows the state received from Shell   -->
      <!-- ========================================== -->
      <div class="legacy-mb-8 legacy-rounded-lg legacy-border-2 legacy-border-dashed legacy-border-purple-400 legacy-bg-purple-50 legacy-p-6">
        <div class="legacy-flex legacy-items-center legacy-gap-2 legacy-mb-4">
          <div class="legacy-h-3 legacy-w-3 legacy-rounded-full legacy-bg-purple-500 legacy-animate-pulse"></div>
          <h2 class="legacy-text-lg legacy-font-bold legacy-text-purple-800">
            🔗 Shared State from Shell (Vue 3)
          </h2>
        </div>

        <div class="legacy-grid legacy-grid-cols-1 md:legacy-grid-cols-3 legacy-gap-4">
          <!-- User Info -->
          <div class="legacy-rounded-lg legacy-bg-white legacy-p-4 legacy-shadow-sm">
            <h3 class="legacy-text-sm legacy-font-semibold legacy-text-gray-500 legacy-mb-2">
              👤 User from Shell
            </h3>
            <div v-if="isAuthenticated && sharedUser" class="legacy-space-y-1">
              <p class="legacy-text-lg legacy-font-bold legacy-text-gray-900">{{ sharedUser.name }}</p>
              <p class="legacy-text-sm legacy-text-gray-600">{{ sharedUser.email }}</p>
              <span class="legacy-inline-block legacy-rounded-full legacy-bg-green-100 legacy-px-2 legacy-py-0.5 legacy-text-xs legacy-font-medium legacy-text-green-700">
                {{ sharedUser.role }}
              </span>
            </div>
            <div v-else class="legacy-text-gray-400 legacy-italic">
              Not logged in
              <p class="legacy-text-xs legacy-mt-1">(Click "Login" in Shell header)</p>
            </div>
          </div>

          <!-- Theme -->
          <div class="legacy-rounded-lg legacy-bg-white legacy-p-4 legacy-shadow-sm">
            <h3 class="legacy-text-sm legacy-font-semibold legacy-text-gray-500 legacy-mb-2">
              🎨 Theme from Shell
            </h3>
            <div class="legacy-flex legacy-items-center legacy-gap-2">
              <div
                class="legacy-h-8 legacy-w-8 legacy-rounded-full legacy-border-2"
                :class="sharedTheme === 'dark' ? 'legacy-bg-gray-800 legacy-border-gray-600' : 'legacy-bg-yellow-100 legacy-border-yellow-300'"
              ></div>
              <span class="legacy-text-lg legacy-font-bold legacy-capitalize" :class="sharedTheme === 'dark' ? 'legacy-text-gray-700' : 'legacy-text-gray-900'">
                {{ sharedTheme }}
              </span>
            </div>
            <p class="legacy-text-xs legacy-text-gray-500 legacy-mt-2">
              (Toggle theme in Shell header)
            </p>
          </div>

          <!-- Event Log -->
          <div class="legacy-rounded-lg legacy-bg-white legacy-p-4 legacy-shadow-sm">
            <h3 class="legacy-text-sm legacy-font-semibold legacy-text-gray-500 legacy-mb-2">
              📡 Events from Shell
            </h3>
            <div class="legacy-max-h-24 legacy-overflow-y-auto legacy-space-y-1">
              <div
                v-for="event in eventLog"
                :key="event.id"
                class="legacy-flex legacy-items-center legacy-gap-2 legacy-text-xs"
              >
                <span class="legacy-text-gray-400">{{ event.time }}</span>
                <span
                  class="legacy-rounded legacy-px-1"
                  :class="{
                    'legacy-bg-green-100 legacy-text-green-700': event.type === 'login',
                    'legacy-bg-red-100 legacy-text-red-700': event.type === 'logout',
                    'legacy-bg-blue-100 legacy-text-blue-700': event.type === 'theme',
                    'legacy-bg-gray-100 legacy-text-gray-700': event.type === 'sync'
                  }"
                >
                  {{ event.type }}
                </span>
                <span class="legacy-text-gray-600 legacy-truncate">{{ event.message }}</span>
              </div>
              <p v-if="!eventLog || eventLog.length === 0" class="legacy-text-gray-400 legacy-italic legacy-text-xs">
                No events yet
              </p>
            </div>
          </div>
        </div>

        <!-- Send Event to Shell Button -->
        <div class="legacy-mt-4 legacy-pt-4 legacy-border-t legacy-border-purple-200">
          <button
            class="legacy-rounded-lg legacy-bg-purple-600 legacy-px-4 legacy-py-2 legacy-text-sm legacy-font-medium legacy-text-white hover:legacy-bg-purple-700 legacy-transition"
            @click="sendEventToShell"
          >
            📤 Send Event to Shell
          </button>
          <span class="legacy-ml-3 legacy-text-sm legacy-text-purple-600">
            (Check browser console for event)
          </span>
        </div>
      </div>
      <!-- END SHARED STATE DEMO PANEL -->

      <!-- Navigation Links -->
      <nav class="legacy-mb-8 legacy-flex legacy-gap-4">
        <nuxt-link
          to="/dashboard"
          class="legacy-rounded-md legacy-bg-primary-600 legacy-px-4 legacy-py-2 legacy-text-sm legacy-font-medium legacy-text-white hover:legacy-bg-primary-700"
        >
          Dashboard
        </nuxt-link>
        <nuxt-link
          to="/booking"
          class="legacy-rounded-md legacy-border legacy-border-gray-300 legacy-bg-white legacy-px-4 legacy-py-2 legacy-text-sm legacy-font-medium legacy-text-gray-700 hover:legacy-bg-gray-50"
        >
          Bookings
        </nuxt-link>
        <nuxt-link
          to="/reports"
          class="legacy-rounded-md legacy-border legacy-border-gray-300 legacy-bg-white legacy-px-4 legacy-py-2 legacy-text-sm legacy-font-medium legacy-text-gray-700 hover:legacy-bg-gray-50"
        >
          Reports
        </nuxt-link>
      </nav>

      <!-- Stats Grid -->
      <div class="legacy-mb-8 legacy-grid legacy-grid-cols-1 legacy-gap-6 sm:legacy-grid-cols-2 lg:legacy-grid-cols-4">
        <div
          v-for="stat in statsCards"
          :key="stat.title"
          class="legacy-overflow-hidden legacy-rounded-lg legacy-p-6 legacy-shadow-card hover:legacy-shadow-card-hover legacy-transition-shadow"
          :class="sharedTheme === 'dark' ? 'legacy-bg-gray-800' : 'legacy-bg-white'"
        >
          <div class="legacy-flex legacy-items-center">
            <div
              class="legacy-flex legacy-h-12 legacy-w-12 legacy-items-center legacy-justify-center legacy-rounded-lg"
              :class="stat.bgColor"
            >
              <component :is="stat.icon" :class="['legacy-h-6 legacy-w-6', stat.iconColor]" />
            </div>
            <div class="legacy-ml-4">
              <p class="legacy-text-sm legacy-font-medium" :class="sharedTheme === 'dark' ? 'legacy-text-gray-400' : 'legacy-text-gray-500'">
                {{ stat.title }}
              </p>
              <p class="legacy-text-2xl legacy-font-semibold" :class="sharedTheme === 'dark' ? 'legacy-text-white' : 'legacy-text-gray-900'">
                {{ stat.value }}
              </p>
            </div>
          </div>
          <div class="legacy-mt-4">
            <span
              class="legacy-inline-flex legacy-items-center legacy-text-sm"
              :class="stat.changeType === 'increase' ? 'legacy-text-success-600' : 'legacy-text-danger-600'"
            >
              <svg
                v-if="stat.changeType === 'increase'"
                class="legacy-mr-1 legacy-h-4 legacy-w-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
              <svg
                v-else
                class="legacy-mr-1 legacy-h-4 legacy-w-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              {{ stat.change }}
            </span>
            <span class="legacy-ml-2 legacy-text-sm" :class="sharedTheme === 'dark' ? 'legacy-text-gray-400' : 'legacy-text-gray-500'">vs last month</span>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="legacy-grid legacy-grid-cols-1 legacy-gap-8 lg:legacy-grid-cols-3">
        <!-- Recent Bookings Table -->
        <div class="lg:legacy-col-span-2">
          <DataTable
            title="Recent Bookings"
            :columns="bookingColumns"
            :data="recentBookings"
            :loading="isLoading"
            row-key="id"
            clickable-rows
            show-actions
            :dark-mode="sharedTheme === 'dark'"
            @row-click="handleRowClick"
          >
            <template #actions>
              <nuxt-link
                to="/booking"
                class="legacy-text-sm legacy-font-medium legacy-text-primary-600 hover:legacy-text-primary-700"
              >
                View all
              </nuxt-link>
            </template>

            <template #cell-status="{ value }">
              <span
                class="legacy-inline-flex legacy-rounded-full legacy-px-2 legacy-py-1 legacy-text-xs legacy-font-semibold"
                :class="getStatusClass(value)"
              >
                {{ value }}
              </span>
            </template>

            <template #cell-amount="{ value }">
              <span class="legacy-font-medium" :class="sharedTheme === 'dark' ? 'legacy-text-white' : 'legacy-text-gray-900'">
                {{ formatCurrency(value) }}
              </span>
            </template>

            <template #row-actions="{ row }">
              <button
                class="legacy-text-primary-600 hover:legacy-text-primary-900"
                @click.stop="viewBooking(row)"
              >
                View
              </button>
            </template>
          </DataTable>
        </div>

        <!-- Sidebar -->
        <div class="legacy-space-y-6">
          <!-- Recent Activity -->
          <div class="legacy-rounded-lg legacy-p-6 legacy-shadow-card" :class="sharedTheme === 'dark' ? 'legacy-bg-gray-800' : 'legacy-bg-white'">
            <h3 class="legacy-mb-4 legacy-text-lg legacy-font-semibold" :class="sharedTheme === 'dark' ? 'legacy-text-white' : 'legacy-text-gray-900'">
              Recent Activity
            </h3>
            <div class="legacy-space-y-4">
              <div
                v-for="activity in recentActivity"
                :key="activity.id"
                class="legacy-flex legacy-items-start legacy-gap-3"
              >
                <div class="legacy-flex-shrink-0">
                  <div class="legacy-flex legacy-h-8 legacy-w-8 legacy-items-center legacy-justify-center legacy-rounded-full legacy-bg-primary-100">
                    <svg class="legacy-h-4 legacy-w-4 legacy-text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div class="legacy-flex-1 legacy-min-w-0">
                  <p class="legacy-text-sm legacy-font-medium" :class="sharedTheme === 'dark' ? 'legacy-text-white' : 'legacy-text-gray-900'">
                    {{ activity.action }}
                  </p>
                  <p class="legacy-text-sm" :class="sharedTheme === 'dark' ? 'legacy-text-gray-400' : 'legacy-text-gray-500'">
                    {{ activity.user }}
                  </p>
                  <p class="legacy-text-xs" :class="sharedTheme === 'dark' ? 'legacy-text-gray-500' : 'legacy-text-gray-400'">
                    {{ activity.time }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="legacy-rounded-lg legacy-p-6 legacy-shadow-card" :class="sharedTheme === 'dark' ? 'legacy-bg-gray-800' : 'legacy-bg-white'">
            <h3 class="legacy-mb-4 legacy-text-lg legacy-font-semibold" :class="sharedTheme === 'dark' ? 'legacy-text-white' : 'legacy-text-gray-900'">
              Quick Actions
            </h3>
            <div class="legacy-space-y-2">
              <button
                class="legacy-flex legacy-w-full legacy-items-center legacy-gap-3 legacy-rounded-lg legacy-border legacy-p-3 legacy-text-left legacy-transition hover:legacy-bg-gray-50"
                :class="sharedTheme === 'dark' ? 'legacy-border-gray-600 hover:legacy-bg-gray-700' : 'legacy-border-gray-200'"
                @click="createBooking"
              >
                <div class="legacy-flex legacy-h-10 legacy-w-10 legacy-items-center legacy-justify-center legacy-rounded-lg legacy-bg-primary-100">
                  <svg class="legacy-h-5 legacy-w-5 legacy-text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <p class="legacy-text-sm legacy-font-medium" :class="sharedTheme === 'dark' ? 'legacy-text-white' : 'legacy-text-gray-900'">New Booking</p>
                  <p class="legacy-text-xs" :class="sharedTheme === 'dark' ? 'legacy-text-gray-400' : 'legacy-text-gray-500'">Create a new travel booking</p>
                </div>
              </button>
              <button
                class="legacy-flex legacy-w-full legacy-items-center legacy-gap-3 legacy-rounded-lg legacy-border legacy-p-3 legacy-text-left legacy-transition hover:legacy-bg-gray-50"
                :class="sharedTheme === 'dark' ? 'legacy-border-gray-600 hover:legacy-bg-gray-700' : 'legacy-border-gray-200'"
                @click="generateReport"
              >
                <div class="legacy-flex legacy-h-10 legacy-w-10 legacy-items-center legacy-justify-center legacy-rounded-lg legacy-bg-success-100">
                  <svg class="legacy-h-5 legacy-w-5 legacy-text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p class="legacy-text-sm legacy-font-medium" :class="sharedTheme === 'dark' ? 'legacy-text-white' : 'legacy-text-gray-900'">Generate Report</p>
                  <p class="legacy-text-xs" :class="sharedTheme === 'dark' ? 'legacy-text-gray-400' : 'legacy-text-gray-500'">Export monthly analytics</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import DataTable from '~/components/DataTable.vue'

export default {
  name: 'DashboardPage',

  components: {
    DataTable
  },

  // Props received from the Web Component wrapper
  props: {
    sharedUser: {
      type: Object,
      default: null
    },
    sharedTheme: {
      type: String,
      default: 'light'
    },
    isAuthenticated: {
      type: Boolean,
      default: false
    },
    eventLog: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      bookingColumns: [
        { key: 'id', label: 'ID', sortable: true },
        { key: 'traveler', label: 'Traveler', sortable: true },
        { key: 'destination', label: 'Destination', sortable: true },
        { key: 'departureDate', label: 'Departure', format: 'date', sortable: true },
        { key: 'status', label: 'Status' },
        { key: 'amount', label: 'Amount', align: 'right', sortable: true }
      ]
    }
  },

  computed: {
    ...mapState(['stats', 'loading']),
    ...mapGetters(['getRecentBookings', 'getRecentActivity', 'isLoading']),

    recentBookings() {
      return this.getRecentBookings(5)
    },

    recentActivity() {
      return this.getRecentActivity
    },

    statsCards() {
      return [
        {
          title: 'Total Bookings',
          value: this.stats.totalBookings.toLocaleString(),
          change: '12%',
          changeType: 'increase',
          bgColor: 'legacy-bg-primary-100',
          iconColor: 'legacy-text-primary-600',
          icon: 'IconBooking'
        },
        {
          title: 'Revenue',
          value: this.formatCurrency(this.stats.revenue),
          change: '8%',
          changeType: 'increase',
          bgColor: 'legacy-bg-success-100',
          iconColor: 'legacy-text-success-600',
          icon: 'IconRevenue'
        },
        {
          title: 'Active Users',
          value: this.stats.activeUsers.toLocaleString(),
          change: '5%',
          changeType: 'increase',
          bgColor: 'legacy-bg-warning-100',
          iconColor: 'legacy-text-warning-600',
          icon: 'IconUsers'
        },
        {
          title: 'Pending Approvals',
          value: this.stats.pendingApprovals,
          change: '3%',
          changeType: 'decrease',
          bgColor: 'legacy-bg-danger-100',
          iconColor: 'legacy-text-danger-600',
          icon: 'IconPending'
        }
      ]
    }
  },

  async mounted() {
    await this.fetchStats()
    await this.fetchBookings()
  },

  methods: {
    ...mapActions(['fetchStats', 'fetchBookings']),

    formatCurrency(value) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(value)
    },

    getStatusClass(status) {
      const classes = {
        confirmed: 'legacy-bg-success-100 legacy-text-success-700',
        pending: 'legacy-bg-warning-100 legacy-text-warning-700',
        cancelled: 'legacy-bg-danger-100 legacy-text-danger-700'
      }
      return classes[status] || 'legacy-bg-gray-100 legacy-text-gray-700'
    },

    handleRowClick(row) {
      this.$router.push(`/booking/${row.id}`)
    },

    viewBooking(booking) {
      this.$router.push(`/booking/${booking.id}`)
    },

    createBooking() {
      this.$router.push('/booking/new')
    },

    generateReport() {
      this.$router.push('/reports')
    },

    // Send an event back to Shell
    sendEventToShell() {
      if (typeof window !== 'undefined' && window.__MF_EVENT_BUS__) {
        const eventData = {
          source: 'legacy-dashboard',
          action: 'button_clicked',
          timestamp: new Date().toISOString(),
          message: 'Hello from Legacy Vue 2 Dashboard!'
        }
        console.log('[Legacy Dashboard] Sending event to Shell:', eventData)
        window.__MF_EVENT_BUS__.emit('legacy:event', eventData)
        alert('Event sent to Shell! Check browser console.')
      } else {
        alert('Event bus not available - are you running inside the Shell?')
      }
    }
  }
}
</script>
