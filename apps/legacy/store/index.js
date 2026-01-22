export const state = () => ({
  stats: {
    totalBookings: 1247,
    revenue: 89432.50,
    activeUsers: 328,
    pendingApprovals: 23
  },
  bookings: [
    {
      id: 'BK-001',
      traveler: 'John Smith',
      destination: 'New York, USA',
      departureDate: '2024-02-15',
      returnDate: '2024-02-20',
      status: 'confirmed',
      amount: 1250.00,
      createdAt: '2024-01-10'
    },
    {
      id: 'BK-002',
      traveler: 'Sarah Johnson',
      destination: 'London, UK',
      departureDate: '2024-02-18',
      returnDate: '2024-02-25',
      status: 'pending',
      amount: 2340.00,
      createdAt: '2024-01-12'
    },
    {
      id: 'BK-003',
      traveler: 'Michael Chen',
      destination: 'Tokyo, Japan',
      departureDate: '2024-03-01',
      returnDate: '2024-03-10',
      status: 'confirmed',
      amount: 3500.00,
      createdAt: '2024-01-14'
    },
    {
      id: 'BK-004',
      traveler: 'Emily Davis',
      destination: 'Paris, France',
      departureDate: '2024-02-22',
      returnDate: '2024-02-28',
      status: 'cancelled',
      amount: 1890.00,
      createdAt: '2024-01-15'
    },
    {
      id: 'BK-005',
      traveler: 'Robert Wilson',
      destination: 'Singapore',
      departureDate: '2024-03-05',
      returnDate: '2024-03-12',
      status: 'confirmed',
      amount: 2780.00,
      createdAt: '2024-01-16'
    },
    {
      id: 'BK-006',
      traveler: 'Lisa Anderson',
      destination: 'Dubai, UAE',
      departureDate: '2024-02-28',
      returnDate: '2024-03-05',
      status: 'pending',
      amount: 4200.00,
      createdAt: '2024-01-17'
    },
    {
      id: 'BK-007',
      traveler: 'David Martinez',
      destination: 'Sydney, Australia',
      departureDate: '2024-03-15',
      returnDate: '2024-03-25',
      status: 'confirmed',
      amount: 5100.00,
      createdAt: '2024-01-18'
    },
    {
      id: 'BK-008',
      traveler: 'Jennifer Brown',
      destination: 'Berlin, Germany',
      departureDate: '2024-02-20',
      returnDate: '2024-02-24',
      status: 'confirmed',
      amount: 1650.00,
      createdAt: '2024-01-19'
    }
  ],
  recentActivity: [
    { id: 1, action: 'Booking created', user: 'John Smith', time: '2 hours ago' },
    { id: 2, action: 'Payment received', user: 'Sarah Johnson', time: '4 hours ago' },
    { id: 3, action: 'Booking modified', user: 'Michael Chen', time: '6 hours ago' },
    { id: 4, action: 'Booking cancelled', user: 'Emily Davis', time: '1 day ago' }
  ],
  loading: false,
  error: null
})

export const getters = {
  getStats: (state) => state.stats,

  getBookings: (state) => state.bookings,

  getBookingById: (state) => (id) => {
    return state.bookings.find(booking => booking.id === id)
  },

  getBookingsByStatus: (state) => (status) => {
    return state.bookings.filter(booking => booking.status === status)
  },

  getRecentBookings: (state) => (limit = 5) => {
    return [...state.bookings]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit)
  },

  getTotalRevenue: (state) => {
    return state.bookings
      .filter(b => b.status !== 'cancelled')
      .reduce((sum, booking) => sum + booking.amount, 0)
  },

  getRecentActivity: (state) => state.recentActivity,

  isLoading: (state) => state.loading
}

export const mutations = {
  SET_STATS(state, stats) {
    state.stats = { ...state.stats, ...stats }
  },

  SET_BOOKINGS(state, bookings) {
    state.bookings = bookings
  },

  ADD_BOOKING(state, booking) {
    state.bookings.unshift(booking)
  },

  UPDATE_BOOKING(state, updatedBooking) {
    const index = state.bookings.findIndex(b => b.id === updatedBooking.id)
    if (index !== -1) {
      state.bookings.splice(index, 1, updatedBooking)
    }
  },

  DELETE_BOOKING(state, bookingId) {
    state.bookings = state.bookings.filter(b => b.id !== bookingId)
  },

  SET_LOADING(state, loading) {
    state.loading = loading
  },

  SET_ERROR(state, error) {
    state.error = error
  },

  ADD_ACTIVITY(state, activity) {
    state.recentActivity.unshift(activity)
    if (state.recentActivity.length > 10) {
      state.recentActivity.pop()
    }
  }
}

export const actions = {
  async fetchStats({ commit }) {
    commit('SET_LOADING', true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))

      // In a real app, this would be an API call
      commit('SET_STATS', {
        totalBookings: 1247,
        revenue: 89432.50,
        activeUsers: 328,
        pendingApprovals: 23
      })
    } catch (error) {
      commit('SET_ERROR', error.message)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchBookings({ commit }) {
    commit('SET_LOADING', true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))

      // Bookings are already in initial state, but this simulates fetching
      // In a real app, you would fetch from an API
    } catch (error) {
      commit('SET_ERROR', error.message)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async createBooking({ commit }, bookingData) {
    commit('SET_LOADING', true)
    try {
      await new Promise(resolve => setTimeout(resolve, 300))

      const newBooking = {
        id: `BK-${String(Date.now()).slice(-3)}`,
        ...bookingData,
        createdAt: new Date().toISOString().split('T')[0]
      }

      commit('ADD_BOOKING', newBooking)
      commit('ADD_ACTIVITY', {
        id: Date.now(),
        action: 'Booking created',
        user: bookingData.traveler,
        time: 'Just now'
      })

      return newBooking
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async updateBooking({ commit }, { id, data }) {
    commit('SET_LOADING', true)
    try {
      await new Promise(resolve => setTimeout(resolve, 300))

      commit('UPDATE_BOOKING', { id, ...data })
      commit('ADD_ACTIVITY', {
        id: Date.now(),
        action: 'Booking updated',
        user: data.traveler || 'Unknown',
        time: 'Just now'
      })
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async updateBookingStatus({ commit, state }, { id, status }) {
    commit('SET_LOADING', true)
    try {
      await new Promise(resolve => setTimeout(resolve, 300))

      const booking = state.bookings.find(b => b.id === id)
      if (booking) {
        commit('UPDATE_BOOKING', { ...booking, status })
        commit('ADD_ACTIVITY', {
          id: Date.now(),
          action: `Booking ${status}`,
          user: booking.traveler,
          time: 'Just now'
        })
      }
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async deleteBooking({ commit }, bookingId) {
    commit('SET_LOADING', true)
    try {
      await new Promise(resolve => setTimeout(resolve, 300))

      commit('DELETE_BOOKING', bookingId)
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  }
}
