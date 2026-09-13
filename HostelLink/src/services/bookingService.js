import api from './api';

const bookingService = {
  // Create new booking
  createBooking: async (bookingData) => {
    try {
      const response = await api.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all bookings for current user
  getUserBookings: async () => {
    try {
      const response = await api.get('/bookings/my-bookings');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get single booking by ID
  getBookingById: async (id) => {
    try {
      const response = await api.get(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get bookings for a hostel (Owner only)
  getHostelBookings: async (hostelId) => {
    try {
      const response = await api.get(`/bookings/hostel/${hostelId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update booking status (Owner only)
  updateBookingStatus: async (id, status) => {
    try {
      const response = await api.patch(`/bookings/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cancel booking
  cancelBooking: async (id, reason) => {
    try {
      const response = await api.patch(`/bookings/${id}/cancel`, { reason });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Confirm move-in
  confirmMoveIn: async (id) => {
    try {
      const response = await api.patch(`/bookings/${id}/confirm-move-in`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Complete booking
  completeBooking: async (id) => {
    try {
      const response = await api.patch(`/bookings/${id}/complete`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get booking statistics (Owner only)
  getBookingStats: async (hostelId) => {
    try {
      const response = await api.get(`/bookings/stats/${hostelId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default bookingService;