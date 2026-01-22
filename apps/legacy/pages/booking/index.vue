<template>
  <div class="legacy-min-h-screen legacy-bg-gray-100">
    <!-- Header -->
    <header class="legacy-bg-white legacy-shadow">
      <div class="legacy-mx-auto legacy-max-w-7xl legacy-px-4 legacy-py-6 sm:legacy-px-6 lg:legacy-px-8">
        <div class="legacy-flex legacy-items-center legacy-justify-between">
          <div>
            <h1 class="legacy-text-3xl legacy-font-bold legacy-tracking-tight legacy-text-gray-900">
              Bookings
            </h1>
            <p class="legacy-mt-1 legacy-text-sm legacy-text-gray-500">
              Manage all travel bookings
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
          class="legacy-rounded-md legacy-bg-primary-600 legacy-px-4 legacy-py-2 legacy-text-sm legacy-font-medium legacy-text-white hover:legacy-bg-primary-700"
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

      <!-- Filters and Actions -->
      <div class="legacy-mb-6 legacy-flex legacy-flex-col legacy-gap-4 sm:legacy-flex-row sm:legacy-items-center sm:legacy-justify-between">
        <div class="legacy-flex legacy-flex-wrap legacy-gap-3">
          <!-- Search -->
          <div class="legacy-relative">
            <svg
              class="legacy-absolute legacy-left-3 legacy-top-1/2 legacy-h-5 legacy-w-5 legacy--translate-y-1/2 legacy-text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search bookings..."
              class="legacy-rounded-lg legacy-border legacy-border-gray-300 legacy-py-2 legacy-pl-10 legacy-pr-4 legacy-text-sm focus:legacy-border-primary-500 focus:legacy-outline-none focus:legacy-ring-1 focus:legacy-ring-primary-500"
            >
          </div>

          <!-- Status Filter -->
          <select
            v-model="statusFilter"
            class="legacy-rounded-lg legacy-border legacy-border-gray-300 legacy-px-4 legacy-py-2 legacy-text-sm focus:legacy-border-primary-500 focus:legacy-outline-none focus:legacy-ring-1 focus:legacy-ring-primary-500"
          >
            <option value="">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <button
          class="legacy-inline-flex legacy-items-center legacy-gap-2 legacy-rounded-lg legacy-bg-primary-600 legacy-px-4 legacy-py-2 legacy-text-sm legacy-font-medium legacy-text-white hover:legacy-bg-primary-700 legacy-transition"
          @click="showCreateModal = true"
        >
          <svg class="legacy-h-5 legacy-w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          New Booking
        </button>
      </div>

      <!-- Bookings Table -->
      <DataTable
        :columns="columns"
        :data="filteredBookings"
        :loading="isLoading"
        row-key="id"
        show-actions
        :pagination="true"
        :current-page="currentPage"
        :items-per-page="itemsPerPage"
        :total-items="filteredBookings.length"
        @page-change="currentPage = $event"
        @sort="handleSort"
      >
        <template #cell-traveler="{ row }">
          <div class="legacy-flex legacy-items-center legacy-gap-3">
            <div class="legacy-flex legacy-h-10 legacy-w-10 legacy-items-center legacy-justify-center legacy-rounded-full legacy-bg-primary-100 legacy-text-sm legacy-font-medium legacy-text-primary-700">
              {{ getInitials(row.traveler) }}
            </div>
            <div>
              <p class="legacy-font-medium legacy-text-gray-900">{{ row.traveler }}</p>
              <p class="legacy-text-sm legacy-text-gray-500">{{ row.id }}</p>
            </div>
          </div>
        </template>

        <template #cell-destination="{ row }">
          <div>
            <p class="legacy-font-medium legacy-text-gray-900">{{ row.destination }}</p>
            <p class="legacy-text-sm legacy-text-gray-500">
              {{ formatDate(row.departureDate) }} - {{ formatDate(row.returnDate) }}
            </p>
          </div>
        </template>

        <template #cell-status="{ value }">
          <span
            class="legacy-inline-flex legacy-items-center legacy-gap-1 legacy-rounded-full legacy-px-2.5 legacy-py-0.5 legacy-text-xs legacy-font-semibold"
            :class="getStatusClass(value)"
          >
            <span
              class="legacy-h-1.5 legacy-w-1.5 legacy-rounded-full"
              :class="getStatusDotClass(value)"
            />
            {{ capitalizeFirst(value) }}
          </span>
        </template>

        <template #cell-amount="{ value }">
          <span class="legacy-font-semibold legacy-text-gray-900">
            {{ formatCurrency(value) }}
          </span>
        </template>

        <template #cell-createdAt="{ value }">
          <span class="legacy-text-sm legacy-text-gray-500">
            {{ formatDate(value) }}
          </span>
        </template>

        <template #row-actions="{ row }">
          <div class="legacy-flex legacy-items-center legacy-gap-2">
            <button
              class="legacy-rounded legacy-p-1 legacy-text-gray-400 hover:legacy-bg-gray-100 hover:legacy-text-gray-600"
              title="View"
              @click.stop="viewBooking(row)"
            >
              <svg class="legacy-h-5 legacy-w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <button
              class="legacy-rounded legacy-p-1 legacy-text-gray-400 hover:legacy-bg-gray-100 hover:legacy-text-primary-600"
              title="Edit"
              @click.stop="editBooking(row)"
            >
              <svg class="legacy-h-5 legacy-w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              v-if="row.status !== 'cancelled'"
              class="legacy-rounded legacy-p-1 legacy-text-gray-400 hover:legacy-bg-gray-100 hover:legacy-text-danger-600"
              title="Cancel"
              @click.stop="cancelBooking(row)"
            >
              <svg class="legacy-h-5 legacy-w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </template>
      </DataTable>

      <!-- Summary Cards -->
      <div class="legacy-mt-8 legacy-grid legacy-grid-cols-1 legacy-gap-4 sm:legacy-grid-cols-3">
        <div class="legacy-rounded-lg legacy-bg-white legacy-p-4 legacy-shadow-card">
          <div class="legacy-flex legacy-items-center legacy-justify-between">
            <div>
              <p class="legacy-text-sm legacy-text-gray-500">Confirmed</p>
              <p class="legacy-text-2xl legacy-font-semibold legacy-text-success-600">
                {{ confirmedCount }}
              </p>
            </div>
            <div class="legacy-rounded-full legacy-bg-success-100 legacy-p-3">
              <svg class="legacy-h-6 legacy-w-6 legacy-text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        <div class="legacy-rounded-lg legacy-bg-white legacy-p-4 legacy-shadow-card">
          <div class="legacy-flex legacy-items-center legacy-justify-between">
            <div>
              <p class="legacy-text-sm legacy-text-gray-500">Pending</p>
              <p class="legacy-text-2xl legacy-font-semibold legacy-text-warning-600">
                {{ pendingCount }}
              </p>
            </div>
            <div class="legacy-rounded-full legacy-bg-warning-100 legacy-p-3">
              <svg class="legacy-h-6 legacy-w-6 legacy-text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="legacy-rounded-lg legacy-bg-white legacy-p-4 legacy-shadow-card">
          <div class="legacy-flex legacy-items-center legacy-justify-between">
            <div>
              <p class="legacy-text-sm legacy-text-gray-500">Cancelled</p>
              <p class="legacy-text-2xl legacy-font-semibold legacy-text-danger-600">
                {{ cancelledCount }}
              </p>
            </div>
            <div class="legacy-rounded-full legacy-bg-danger-100 legacy-p-3">
              <svg class="legacy-h-6 legacy-w-6 legacy-text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
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
  name: 'BookingListPage',

  components: {
    DataTable
  },

  data() {
    return {
      searchQuery: '',
      statusFilter: '',
      currentPage: 1,
      itemsPerPage: 10,
      showCreateModal: false,
      columns: [
        { key: 'traveler', label: 'Traveler', sortable: true },
        { key: 'destination', label: 'Trip Details', sortable: true },
        { key: 'status', label: 'Status' },
        { key: 'amount', label: 'Amount', align: 'right', sortable: true },
        { key: 'createdAt', label: 'Created', sortable: true }
      ]
    }
  },

  computed: {
    ...mapState(['bookings']),
    ...mapGetters(['getBookings', 'getBookingsByStatus', 'isLoading']),

    filteredBookings() {
      let result = this.bookings

      // Filter by search query
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        result = result.filter(booking =>
          booking.traveler.toLowerCase().includes(query) ||
          booking.destination.toLowerCase().includes(query) ||
          booking.id.toLowerCase().includes(query)
        )
      }

      // Filter by status
      if (this.statusFilter) {
        result = result.filter(booking => booking.status === this.statusFilter)
      }

      return result
    },

    confirmedCount() {
      return this.getBookingsByStatus('confirmed').length
    },

    pendingCount() {
      return this.getBookingsByStatus('pending').length
    },

    cancelledCount() {
      return this.getBookingsByStatus('cancelled').length
    }
  },

  async mounted() {
    await this.fetchBookings()
  },

  methods: {
    ...mapActions(['fetchBookings', 'updateBookingStatus', 'deleteBooking']),

    formatCurrency(value) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(value)
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },

    getInitials(name) {
      return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    },

    capitalizeFirst(str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    },

    getStatusClass(status) {
      const classes = {
        confirmed: 'legacy-bg-success-100 legacy-text-success-700',
        pending: 'legacy-bg-warning-100 legacy-text-warning-700',
        cancelled: 'legacy-bg-danger-100 legacy-text-danger-700'
      }
      return classes[status] || 'legacy-bg-gray-100 legacy-text-gray-700'
    },

    getStatusDotClass(status) {
      const classes = {
        confirmed: 'legacy-bg-success-500',
        pending: 'legacy-bg-warning-500',
        cancelled: 'legacy-bg-danger-500'
      }
      return classes[status] || 'legacy-bg-gray-500'
    },

    handleSort({ key, order }) {
      console.log('Sort by:', key, order)
    },

    viewBooking(booking) {
      // In a real app, navigate to booking detail page
      console.log('View booking:', booking.id)
      alert(`View booking: ${booking.id}`)
    },

    editBooking(booking) {
      console.log('Edit booking:', booking.id)
      alert(`Edit booking: ${booking.id}`)
    },

    async cancelBooking(booking) {
      if (confirm(`Are you sure you want to cancel booking ${booking.id}?`)) {
        try {
          await this.updateBookingStatus({
            id: booking.id,
            status: 'cancelled'
          })
        } catch (error) {
          console.error('Failed to cancel booking:', error)
        }
      }
    }
  }
}
</script>
