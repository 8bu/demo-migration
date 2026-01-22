<template>
  <div class="legacy-overflow-hidden legacy-rounded-lg legacy-border legacy-border-gray-200 legacy-bg-white legacy-shadow-card">
    <!-- Table Header -->
    <div
      v-if="title || $slots.actions"
      class="legacy-flex legacy-items-center legacy-justify-between legacy-border-b legacy-border-gray-200 legacy-bg-gray-50 legacy-px-6 legacy-py-4"
    >
      <h3 v-if="title" class="legacy-text-lg legacy-font-semibold legacy-text-gray-900">
        {{ title }}
      </h3>
      <div v-if="$slots.actions">
        <slot name="actions" />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="legacy-flex legacy-items-center legacy-justify-center legacy-py-12">
      <div class="legacy-flex legacy-flex-col legacy-items-center legacy-gap-3">
        <svg
          class="legacy-h-8 legacy-w-8 legacy-animate-spin legacy-text-primary-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="legacy-opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="legacy-opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <span class="legacy-text-sm legacy-text-gray-500">Loading...</span>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="!data || data.length === 0"
      class="legacy-flex legacy-flex-col legacy-items-center legacy-justify-center legacy-py-12"
    >
      <svg
        class="legacy-h-12 legacy-w-12 legacy-text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <p class="legacy-mt-2 legacy-text-sm legacy-text-gray-500">
        {{ emptyMessage }}
      </p>
    </div>

    <!-- Table Content -->
    <div v-else class="legacy-overflow-x-auto">
      <table class="legacy-min-w-full legacy-divide-y legacy-divide-gray-200">
        <thead class="legacy-bg-gray-50">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              scope="col"
              class="legacy-px-6 legacy-py-3 legacy-text-left legacy-text-xs legacy-font-medium legacy-uppercase legacy-tracking-wider legacy-text-gray-500"
              :class="[
                column.align === 'center' && 'legacy-text-center',
                column.align === 'right' && 'legacy-text-right',
                column.sortable && 'legacy-cursor-pointer hover:legacy-bg-gray-100'
              ]"
              @click="column.sortable && handleSort(column.key)"
            >
              <div class="legacy-flex legacy-items-center legacy-gap-1">
                {{ column.label }}
                <template v-if="column.sortable">
                  <svg
                    v-if="sortKey === column.key"
                    class="legacy-h-4 legacy-w-4"
                    :class="{ 'legacy-rotate-180': sortOrder === 'desc' }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                  </svg>
                  <svg
                    v-else
                    class="legacy-h-4 legacy-w-4 legacy-text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </template>
              </div>
            </th>
            <th v-if="$slots.actions || showActions" scope="col" class="legacy-relative legacy-px-6 legacy-py-3">
              <span class="legacy-sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody class="legacy-divide-y legacy-divide-gray-200 legacy-bg-white">
          <tr
            v-for="(row, rowIndex) in sortedData"
            :key="row[rowKey] || rowIndex"
            class="hover:legacy-bg-gray-50 legacy-transition-colors"
            :class="{ 'legacy-cursor-pointer': clickableRows }"
            @click="clickableRows && $emit('row-click', row)"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              class="legacy-whitespace-nowrap legacy-px-6 legacy-py-4"
              :class="[
                column.align === 'center' && 'legacy-text-center',
                column.align === 'right' && 'legacy-text-right'
              ]"
            >
              <slot :name="`cell-${column.key}`" :row="row" :value="getNestedValue(row, column.key)">
                <span class="legacy-text-sm legacy-text-gray-900">
                  {{ formatValue(getNestedValue(row, column.key), column) }}
                </span>
              </slot>
            </td>
            <td v-if="$slots['row-actions'] || showActions" class="legacy-whitespace-nowrap legacy-px-6 legacy-py-4 legacy-text-right legacy-text-sm legacy-font-medium">
              <slot name="row-actions" :row="row" :index="rowIndex" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div
      v-if="pagination && totalPages > 1"
      class="legacy-flex legacy-items-center legacy-justify-between legacy-border-t legacy-border-gray-200 legacy-bg-white legacy-px-6 legacy-py-3"
    >
      <div class="legacy-flex legacy-flex-1 legacy-justify-between sm:legacy-hidden">
        <button
          :disabled="currentPage === 1"
          class="legacy-relative legacy-inline-flex legacy-items-center legacy-rounded-md legacy-border legacy-border-gray-300 legacy-bg-white legacy-px-4 legacy-py-2 legacy-text-sm legacy-font-medium legacy-text-gray-700 hover:legacy-bg-gray-50 disabled:legacy-cursor-not-allowed disabled:legacy-opacity-50"
          @click="$emit('page-change', currentPage - 1)"
        >
          Previous
        </button>
        <button
          :disabled="currentPage === totalPages"
          class="legacy-relative legacy-ml-3 legacy-inline-flex legacy-items-center legacy-rounded-md legacy-border legacy-border-gray-300 legacy-bg-white legacy-px-4 legacy-py-2 legacy-text-sm legacy-font-medium legacy-text-gray-700 hover:legacy-bg-gray-50 disabled:legacy-cursor-not-allowed disabled:legacy-opacity-50"
          @click="$emit('page-change', currentPage + 1)"
        >
          Next
        </button>
      </div>
      <div class="legacy-hidden sm:legacy-flex sm:legacy-flex-1 sm:legacy-items-center sm:legacy-justify-between">
        <div>
          <p class="legacy-text-sm legacy-text-gray-700">
            Showing
            <span class="legacy-font-medium">{{ startItem }}</span>
            to
            <span class="legacy-font-medium">{{ endItem }}</span>
            of
            <span class="legacy-font-medium">{{ totalItems }}</span>
            results
          </p>
        </div>
        <div>
          <nav class="legacy-relative legacy-z-0 legacy-inline-flex legacy--space-x-px legacy-rounded-md legacy-shadow-sm" aria-label="Pagination">
            <button
              :disabled="currentPage === 1"
              class="legacy-relative legacy-inline-flex legacy-items-center legacy-rounded-l-md legacy-border legacy-border-gray-300 legacy-bg-white legacy-px-2 legacy-py-2 legacy-text-sm legacy-font-medium legacy-text-gray-500 hover:legacy-bg-gray-50 disabled:legacy-cursor-not-allowed disabled:legacy-opacity-50"
              @click="$emit('page-change', currentPage - 1)"
            >
              <span class="legacy-sr-only">Previous</span>
              <svg class="legacy-h-5 legacy-w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
            <button
              v-for="page in visiblePages"
              :key="page"
              :class="[
                'legacy-relative legacy-inline-flex legacy-items-center legacy-border legacy-px-4 legacy-py-2 legacy-text-sm legacy-font-medium',
                page === currentPage
                  ? 'legacy-z-10 legacy-border-primary-500 legacy-bg-primary-50 legacy-text-primary-600'
                  : 'legacy-border-gray-300 legacy-bg-white legacy-text-gray-500 hover:legacy-bg-gray-50'
              ]"
              @click="$emit('page-change', page)"
            >
              {{ page }}
            </button>
            <button
              :disabled="currentPage === totalPages"
              class="legacy-relative legacy-inline-flex legacy-items-center legacy-rounded-r-md legacy-border legacy-border-gray-300 legacy-bg-white legacy-px-2 legacy-py-2 legacy-text-sm legacy-font-medium legacy-text-gray-500 hover:legacy-bg-gray-50 disabled:legacy-cursor-not-allowed disabled:legacy-opacity-50"
              @click="$emit('page-change', currentPage + 1)"
            >
              <span class="legacy-sr-only">Next</span>
              <svg class="legacy-h-5 legacy-w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataTable',

  props: {
    title: {
      type: String,
      default: ''
    },
    columns: {
      type: Array,
      required: true,
      validator: (columns) => columns.every(col => col.key && col.label)
    },
    data: {
      type: Array,
      default: () => []
    },
    rowKey: {
      type: String,
      default: 'id'
    },
    loading: {
      type: Boolean,
      default: false
    },
    emptyMessage: {
      type: String,
      default: 'No data available'
    },
    clickableRows: {
      type: Boolean,
      default: false
    },
    showActions: {
      type: Boolean,
      default: false
    },
    pagination: {
      type: Boolean,
      default: false
    },
    currentPage: {
      type: Number,
      default: 1
    },
    itemsPerPage: {
      type: Number,
      default: 10
    },
    totalItems: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      sortKey: '',
      sortOrder: 'asc'
    }
  },

  computed: {
    sortedData() {
      if (!this.sortKey) {
        return this.data
      }

      return [...this.data].sort((a, b) => {
        const aValue = this.getNestedValue(a, this.sortKey)
        const bValue = this.getNestedValue(b, this.sortKey)

        if (aValue < bValue) return this.sortOrder === 'asc' ? -1 : 1
        if (aValue > bValue) return this.sortOrder === 'asc' ? 1 : -1
        return 0
      })
    },

    totalPages() {
      return Math.ceil(this.totalItems / this.itemsPerPage)
    },

    startItem() {
      return (this.currentPage - 1) * this.itemsPerPage + 1
    },

    endItem() {
      return Math.min(this.currentPage * this.itemsPerPage, this.totalItems)
    },

    visiblePages() {
      const pages = []
      const maxVisiblePages = 5
      let start = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2))
      const end = Math.min(this.totalPages, start + maxVisiblePages - 1)

      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1)
      }

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      return pages
    }
  },

  methods: {
    getNestedValue(obj, path) {
      return path.split('.').reduce((acc, part) => acc && acc[part], obj)
    },

    formatValue(value, column) {
      if (value === null || value === undefined) {
        return '-'
      }

      if (column.format === 'currency') {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(value)
      }

      if (column.format === 'date') {
        return new Date(value).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      }

      if (column.format === 'number') {
        return new Intl.NumberFormat('en-US').format(value)
      }

      return value
    },

    handleSort(key) {
      if (this.sortKey === key) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortKey = key
        this.sortOrder = 'asc'
      }

      this.$emit('sort', { key: this.sortKey, order: this.sortOrder })
    }
  }
}
</script>
