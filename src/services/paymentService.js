import api from './api';

const paymentService = {
  // ✅ FIXED: send mobileNumber to match backend
  initiatePayment: async (bookingId, paymentMethod, mobileNumber = null) => {
    try {
      const response = await api.post('/payments/initiate', {
        bookingId,
        paymentMethod,
        mobileNumber,   // ✅ backend expects mobileNumber not phoneNumber
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  verifyPayment: async (transactionId) => {
    try {
      const response = await api.get(`/payments/verify/${transactionId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getTransactions: async (options = {}) => {
    try {
      const { status, page = 1, limit = 10 } = options;
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      params.append('page', page);
      params.append('limit', limit);
      const response = await api.get(`/payments/transactions?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  formatCurrency: (amount) => {
    return new Intl.NumberFormat('en-MW', {
      style: 'currency',
      currency: 'MWK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  },

  calculateTotal: (roomRent) => {
    const platformFee  = 2000;
    const totalAmount  = roomRent + platformFee;
    return {
      roomRent,
      platformFee,
      totalAmount,
      breakdown: {
        roomRent:    paymentService.formatCurrency(roomRent),
        platformFee: `${paymentService.formatCurrency(platformFee)} (Platform fee)`,
        total:       paymentService.formatCurrency(totalAmount),
      },
    };
  },
};

export default paymentService;