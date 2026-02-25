import api from './api';

const paymentService = {
  /**
   * Initiate payment for a booking
   * @param {string} bookingId - Booking ID
   * @param {string} paymentMethod - Payment method (mobile_money, bank_transfer, card)
   * @param {string} phoneNumber - Phone number for mobile money (optional)
   * @returns {Promise} Payment initialization response with payment URL
   */
  initiatePayment: async (bookingId, paymentMethod, phoneNumber = null) => {
    try {
      const payload = {
        bookingId,
        paymentMethod,
        phoneNumber
      };

      const response = await api.post('/payments/initiate', payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Verify payment status after callback
   * @param {string} transactionId - Transaction ID from payment response
   * @returns {Promise} Payment verification details
   */
  verifyPayment: async (transactionId) => {
    try {
      const response = await api.get(`/payments/verify/${transactionId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get all transactions for current user
   * @param {object} options - Filter and pagination options
   * @returns {Promise} List of transactions with pagination
   */
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

  /**
   * Get completed transactions (for receipt/invoice)
   * @returns {Promise} List of completed transactions
   */
  getCompletedTransactions: async () => {
    try {
      return await paymentService.getTransactions({ status: 'completed' });
    } catch (error) {
      throw error;
    }
  },

  /**
   * Format currency (MWK)
   * @param {number} amount - Amount in MWK
   * @returns {string} Formatted amount
   */
  formatCurrency: (amount) => {
    return new Intl.NumberFormat('en-MW', {
      style: 'currency',
      currency: 'MWK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  },

  /**
   * Calculate total with platform fee
   * @param {number} roomRent - Room rent amount
   * @returns {object} Breakdown with platform fee
   */
  calculateTotal: (roomRent) => {
    const platformFee = 2000; // Fixed 2000 MWK
    const totalAmount = roomRent + platformFee;

    return {
      roomRent,
      platformFee,
      totalAmount,
      breakdown: {
        roomRent: `${paymentService.formatCurrency(roomRent)}`,
        platformFee: `${paymentService.formatCurrency(platformFee)} (Platform fee)`,
        total: `${paymentService.formatCurrency(totalAmount)}`
      }
    };
  }
};

export default paymentService;