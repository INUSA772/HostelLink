import api from './api';

const paymentService = {
  // Initiate payment
  initiatePayment: async (paymentData) => {
    try {
      const response = await api.post('/payments/initiate', paymentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Verify payment
  verifyPayment: async (paymentId, transactionId) => {
    try {
      const response = await api.post('/payments/verify', {
        paymentId,
        transactionId
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get payment by ID
  getPaymentById: async (id) => {
    try {
      const response = await api.get(`/payments/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user's payment history
  getPaymentHistory: async () => {
    try {
      const response = await api.get('/payments/my-payments');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get payments for a hostel (Owner only)
  getHostelPayments: async (hostelId) => {
    try {
      const response = await api.get(`/payments/hostel/${hostelId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Request refund
  requestRefund: async (paymentId, reason) => {
    try {
      const response = await api.post(`/payments/${paymentId}/refund`, {
        reason
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Process refund (Admin only)
  processRefund: async (paymentId) => {
    try {
      const response = await api.post(`/payments/${paymentId}/process-refund`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get payment statistics (Owner only)
  getPaymentStats: async (hostelId) => {
    try {
      const response = await api.get(`/payments/stats/${hostelId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default paymentService;