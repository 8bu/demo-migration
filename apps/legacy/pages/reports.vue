<template>
  <div class="legacy-min-h-screen legacy-bg-gray-100">
    <!-- Header -->
    <header class="legacy-bg-white legacy-shadow">
      <div class="legacy-mx-auto legacy-max-w-7xl legacy-px-4 legacy-py-6 sm:legacy-px-6 lg:legacy-px-8">
        <div class="legacy-flex legacy-items-center legacy-justify-between">
          <div>
            <h1 class="legacy-text-3xl legacy-font-bold legacy-tracking-tight legacy-text-gray-900">
              Reports
            </h1>
            <p class="legacy-mt-1 legacy-text-sm legacy-text-gray-500">
              Analytics and insights for your travel bookings
            </p>
          </div>
          <span class="legacy-rounded-full legacy-bg-yellow-100 legacy-px-3 legacy-py-1 legacy-text-sm legacy-font-medium legacy-text-yellow-800">
            Legacy App (Nuxt 2)
          </span>
        </div>
      </div>
    </header>

    <main class="legacy-mx-auto legacy-max-w-7xl legacy-px-4 legacy-py-8 sm:legacy-px-6 lg:legacy-px-8">
      <!-- Navigation Links -->
      <nav class="legacy-mb-8 legacy-flex legacy-gap-4">
        <nuxt-link
          to="/dashboard"
          class="legacy-rounded-md legacy-border legacy-border-gray-300 legacy-bg-white legacy-px-4 legacy-py-2 legacy-text-sm legacy-font-medium legacy-text-gray-700 hover:legacy-bg-gray-50"
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
          class="legacy-rounded-md legacy-bg-primary-600 legacy-px-4 legacy-py-2 legacy-text-sm legacy-font-medium legacy-text-white hover:legacy-bg-primary-700"
        >
          Reports
        </nuxt-link>
      </nav>

      <!-- Date Range Selector -->
      <div class="legacy-mb-8 legacy-flex legacy-flex-wrap legacy-items-center legacy-gap-4">
        <div class="legacy-flex legacy-items-center legacy-gap-2">
          <label class="legacy-text-sm legacy-font-medium legacy-text-gray-700">Period:</label>
          <select
            v-model="selectedPeriod"
            class="legacy-rounded-lg legacy-border legacy-border-gray-300 legacy-px-4 legacy-py-2 legacy-text-sm focus:legacy-border-primary-500 focus:legacy-outline-none focus:legacy-ring-1 focus:legacy-ring-primary-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="12m">Last 12 months</option>
          </select>
        </div>

        <button
          class="legacy-inline-flex legacy-items-center legacy-gap-2 legacy-rounded-lg legacy-bg-white legacy-border legacy-border-gray-300 legacy-px-4 legacy-py-2 legacy-text-sm legacy-font-medium legacy-text-gray-700 hover:legacy-bg-gray-50"
          @click="exportReport"
        >
          <svg class="legacy-h-5 legacy-w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Report
        </button>
      </div>

      <!-- Summary Stats -->
      <div class="legacy-mb-8 legacy-grid legacy-grid-cols-1 legacy-gap-6 sm:legacy-grid-cols-2 lg:legacy-grid-cols-4">
        <div class="legacy-rounded-lg legacy-bg-white legacy-p-6 legacy-shadow-card">
          <div class="legacy-flex legacy-items-center legacy-justify-between">
            <div>
              <p class="legacy-text-sm legacy-font-medium legacy-text-gray-500">Total Revenue</p>
              <p class="legacy-mt-1 legacy-text-2xl legacy-font-semibold legacy-text-gray-900">
                {{ formatCurrency(totalRevenue) }}
              </p>
            </div>
            <div class="legacy-rounded-full legacy-bg-success-100 legacy-p-3">
              <svg class="legacy-h-6 legacy-w-6 legacy-text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p class="legacy-mt-2 legacy-text-sm legacy-text-success-600">
            +12.5% from previous period
          </p>
        </div>

        <div class="legacy-rounded-lg legacy-bg-white legacy-p-6 legacy-shadow-card">
          <div class="legacy-flex legacy-items-center legacy-justify-between">
            <div>
              <p class="legacy-text-sm legacy-font-medium legacy-text-gray-500">Total Bookings</p>
              <p class="legacy-mt-1 legacy-text-2xl legacy-font-semibold legacy-text-gray-900">
                {{ stats.totalBookings }}
              </p>
            </div>
            <div class="legacy-rounded-full legacy-bg-primary-100 legacy-p-3">
              <svg class="legacy-h-6 legacy-w-6 legacy-text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <p class="legacy-mt-2 legacy-text-sm legacy-text-primary-600">
            +8.2% from previous period
          </p>
        </div>

        <div class="legacy-rounded-lg legacy-bg-white legacy-p-6 legacy-shadow-card">
          <div class="legacy-flex legacy-items-center legacy-justify-between">
            <div>
              <p class="legacy-text-sm legacy-font-medium legacy-text-gray-500">Avg. Booking Value</p>
              <p class="legacy-mt-1 legacy-text-2xl legacy-font-semibold legacy-text-gray-900">
                {{ formatCurrency(averageBookingValue) }}
              </p>
            </div>
            <div class="legacy-rounded-full legacy-bg-warning-100 legacy-p-3">
              <svg class="legacy-h-6 legacy-w-6 legacy-text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <p class="legacy-mt-2 legacy-text-sm legacy-text-warning-600">
            +3.1% from previous period
          </p>
        </div>

        <div class="legacy-rounded-lg legacy-bg-white legacy-p-6 legacy-shadow-card">
          <div class="legacy-flex legacy-items-center legacy-justify-between">
            <div>
              <p class="legacy-text-sm legacy-font-medium legacy-text-gray-500">Cancellation Rate</p>
              <p class="legacy-mt-1 legacy-text-2xl legacy-font-semibold legacy-text-gray-900">
                {{ cancellationRate }}%
              </p>
            </div>
            <div class="legacy-rounded-full legacy-bg-danger-100 legacy-p-3">
              <svg class="legacy-h-6 legacy-w-6 legacy-text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <p class="legacy-mt-2 legacy-text-sm legacy-text-success-600">
            -2.3% from previous period
          </p>
        </div>
      </div>

      <div class="legacy-grid legacy-grid-cols-1 legacy-gap-8 lg:legacy-grid-cols-2">
        <!-- Revenue by Destination -->
        <div class="legacy-rounded-lg legacy-bg-white legacy-p-6 legacy-shadow-card">
          <h3 class="legacy-mb-6 legacy-text-lg legacy-font-semibold legacy-text-gray-900">
            Revenue by Destination
          </h3>
          <div class="legacy-space-y-4">
            <div
              v-for="dest in topDestinations"
              :key="dest.name"
              class="legacy-flex legacy-items-center"
            >
              <div class="legacy-w-32 legacy-flex-shrink-0 legacy-text-sm legacy-font-medium legacy-text-gray-900">
                {{ dest.name }}
              </div>
              <div class="legacy-flex-1 legacy-mx-4">
                <div class="legacy-h-4 legacy-w-full legacy-rounded-full legacy-bg-gray-200">
                  <div
                    class="legacy-h-4 legacy-rounded-full legacy-bg-primary-500"
                    :style="{ width: `${(dest.revenue / maxDestinationRevenue) * 100}%` }"
                  />
                </div>
              </div>
              <div class="legacy-w-24 legacy-flex-shrink-0 legacy-text-right legacy-text-sm legacy-font-medium legacy-text-gray-900">
                {{ formatCurrency(dest.revenue) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Booking Status Distribution -->
        <div class="legacy-rounded-lg legacy-bg-white legacy-p-6 legacy-shadow-card">
          <h3 class="legacy-mb-6 legacy-text-lg legacy-font-semibold legacy-text-gray-900">
            Booking Status Distribution
          </h3>
          <div class="legacy-flex legacy-items-center legacy-justify-center">
            <div class="legacy-relative legacy-h-48 legacy-w-48">
              <!-- Simple pie chart representation -->
              <svg viewBox="0 0 100 100" class="legacy-h-full legacy-w-full legacy--rotate-90">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#22c55e"
                  stroke-width="20"
                  :stroke-dasharray="`${confirmedPercentage * 2.51} 251`"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#f59e0b"
                  stroke-width="20"
                  :stroke-dasharray="`${pendingPercentage * 2.51} 251`"
                  :stroke-dashoffset="`${-confirmedPercentage * 2.51}`"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#ef4444"
                  stroke-width="20"
                  :stroke-dasharray="`${cancelledPercentage * 2.51} 251`"
                  :stroke-dashoffset="`${-(confirmedPercentage + pendingPercentage) * 2.51}`"
                />
              </svg>
            </div>
          </div>
          <div class="legacy-mt-6 legacy-flex legacy-justify-center legacy-gap-6">
            <div class="legacy-flex legacy-items-center legacy-gap-2">
              <span class="legacy-h-3 legacy-w-3 legacy-rounded-full legacy-bg-success-500" />
              <span class="legacy-text-sm legacy-text-gray-600">Confirmed ({{ confirmedPercentage }}%)</span>
            </div>
            <div class="legacy-flex legacy-items-center legacy-gap-2">
              <span class="legacy-h-3 legacy-w-3 legacy-rounded-full legacy-bg-warning-500" />
              <span class="legacy-text-sm legacy-text-gray-600">Pending ({{ pendingPercentage }}%)</span>
            </div>
            <div class="legacy-flex legacy-items-center legacy-gap-2">
              <span class="legacy-h-3 legacy-w-3 legacy-rounded-full legacy-bg-danger-500" />
              <span class="legacy-text-sm legacy-text-gray-600">Cancelled ({{ cancelledPercentage }}%)</span>
            </div>
          </div>
        </div>

        <!-- Monthly Trend -->
        <div class="legacy-rounded-lg legacy-bg-white legacy-p-6 legacy-shadow-card lg:legacy-col-span-2">
          <h3 class="legacy-mb-6 legacy-text-lg legacy-font-semibold legacy-text-gray-900">
            Monthly Booking Trend
          </h3>
          <div class="legacy-h-64">
            <div class="legacy-flex legacy-h-full legacy-items-end legacy-gap-2">
              <div
                v-for="month in monthlyData"
                :key="month.name"
                class="legacy-flex legacy-flex-1 legacy-flex-col legacy-items-center"
              >
                <div
                  class="legacy-w-full legacy-rounded-t legacy-bg-primary-500 hover:legacy-bg-primary-600 legacy-transition-colors legacy-cursor-pointer"
                  :style="{ height: `${(month.bookings / maxMonthlyBookings) * 100}%` }"
                  :title="`${month.bookings} bookings`"
                />
                <span class="legacy-mt-2 legacy-text-xs legacy-text-gray-500">
                  {{ month.name }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Reports Table -->
      <div class="legacy-mt-8">
        <DataTable
          title="Generated Reports"
          :columns="reportColumns"
          :data="generatedReports"
          row-key="id"
          show-actions
        >
          <template #cell-status="{ value }">
            <span
              class="legacy-inline-flex legacy-rounded-full legacy-px-2 legacy-py-1 legacy-text-xs legacy-font-semibold"
              :class="value === 'completed' ? 'legacy-bg-success-100 legacy-text-success-700' : 'legacy-bg-warning-100 legacy-text-warning-700'"
            >
              {{ value }}
            </span>
          </template>

          <template #row-actions="{ row }">
            <button
              v-if="row.status === 'completed'"
              class="legacy-text-primary-600 hover:legacy-text-primary-900 legacy-text-sm legacy-font-medium"
              @click="downloadReport(row)"
            >
              Download
            </button>
          </template>
        </DataTable>
      </div>
    </main>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import DataTable from '~/components/DataTable.vue'

export default {
  name: 'ReportsPage',

  components: {
    DataTable
  },

  data() {
    return {
      selectedPeriod: '30d',
      reportColumns: [
        { key: 'name', label: 'Report Name', sortable: true },
        { key: 'type', label: 'Type' },
        { key: 'generatedAt', label: 'Generated', format: 'date', sortable: true },
        { key: 'status', label: 'Status' }
      ],
      generatedReports: [
        { id: 1, name: 'Monthly Revenue Report', type: 'Revenue', generatedAt: '2024-01-20', status: 'completed' },
        { id: 2, name: 'Booking Analytics Q4', type: 'Analytics', generatedAt: '2024-01-18', status: 'completed' },
        { id: 3, name: 'Customer Insights', type: 'Insights', generatedAt: '2024-01-15', status: 'completed' },
        { id: 4, name: 'Destination Performance', type: 'Performance', generatedAt: '2024-01-10', status: 'completed' }
      ],
      topDestinations: [
        { name: 'Tokyo, Japan', revenue: 15200 },
        { name: 'New York, USA', revenue: 12800 },
        { name: 'Paris, France', revenue: 11500 },
        { name: 'London, UK', revenue: 9800 },
        { name: 'Dubai, UAE', revenue: 8500 }
      ],
      monthlyData: [
        { name: 'Jul', bookings: 45 },
        { name: 'Aug', bookings: 62 },
        { name: 'Sep', bookings: 58 },
        { name: 'Oct', bookings: 71 },
        { name: 'Nov', bookings: 85 },
        { name: 'Dec', bookings: 92 },
        { name: 'Jan', bookings: 78 }
      ]
    }
  },

  computed: {
    ...mapState(['stats', 'bookings']),
    ...mapGetters(['getTotalRevenue', 'getBookingsByStatus']),

    totalRevenue() {
      return this.getTotalRevenue
    },

    averageBookingValue() {
      const activeBookings = this.bookings.filter(b => b.status !== 'cancelled')
      if (activeBookings.length === 0) return 0
      return this.totalRevenue / activeBookings.length
    },

    cancellationRate() {
      if (this.bookings.length === 0) return 0
      const cancelled = this.getBookingsByStatus('cancelled').length
      return ((cancelled / this.bookings.length) * 100).toFixed(1)
    },

    confirmedPercentage() {
      if (this.bookings.length === 0) return 0
      return Math.round((this.getBookingsByStatus('confirmed').length / this.bookings.length) * 100)
    },

    pendingPercentage() {
      if (this.bookings.length === 0) return 0
      return Math.round((this.getBookingsByStatus('pending').length / this.bookings.length) * 100)
    },

    cancelledPercentage() {
      if (this.bookings.length === 0) return 0
      return Math.round((this.getBookingsByStatus('cancelled').length / this.bookings.length) * 100)
    },

    maxDestinationRevenue() {
      return Math.max(...this.topDestinations.map(d => d.revenue))
    },

    maxMonthlyBookings() {
      return Math.max(...this.monthlyData.map(m => m.bookings))
    }
  },

  methods: {
    formatCurrency(value) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value)
    },

    exportReport() {
      alert('Exporting report for period: ' + this.selectedPeriod)
    },

    downloadReport(report) {
      alert('Downloading report: ' + report.name)
    }
  }
}
</script>
