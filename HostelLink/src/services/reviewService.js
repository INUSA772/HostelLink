import api from './api';

const reviewService = {
  // Create a review
  createReview: async (hostelId, reviewData) => {
    try {
      const response = await api.post(`/reviews/hostel/${hostelId}`, reviewData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get reviews for a hostel
  getHostelReviews: async (hostelId, page = 1, limit = 10) => {
    try {
      const response = await api.get(`/reviews/hostel/${hostelId}`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user's reviews
  getUserReviews: async () => {
    try {
      const response = await api.get('/reviews/my-reviews');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update a review
  updateReview: async (reviewId, reviewData) => {
    try {
      const response = await api.put(`/reviews/${reviewId}`, reviewData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete a review
  deleteReview: async (reviewId) => {
    try {
      const response = await api.delete(`/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Reply to a review (Owner only)
  replyToReview: async (reviewId, reply) => {
    try {
      const response = await api.post(`/reviews/${reviewId}/reply`, { reply });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Report a review
  reportReview: async (reviewId, reason) => {
    try {
      const response = await api.post(`/reviews/${reviewId}/report`, { reason });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Like a review
  likeReview: async (reviewId) => {
    try {
      const response = await api.post(`/reviews/${reviewId}/like`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Unlike a review
  unlikeReview: async (reviewId) => {
    try {
      const response = await api.delete(`/reviews/${reviewId}/like`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get review statistics for a hostel
  getReviewStats: async (hostelId) => {
    try {
      const response = await api.get(`/reviews/hostel/${hostelId}/stats`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default reviewService;