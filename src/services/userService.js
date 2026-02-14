import api from './api';

const userService = {
  // Get current user profile
  getProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/users/profile', profileData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update profile picture
  updateProfilePicture: async (formData) => {
    try {
      const response = await api.post('/users/profile/picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete profile picture
  deleteProfilePicture: async () => {
    try {
      const response = await api.delete('/users/profile/picture');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Submit verification documents (Owner)
  submitVerification: async (formData) => {
    try {
      const response = await api.post('/users/verification', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get verification status
  getVerificationStatus: async () => {
    try {
      const response = await api.get('/users/verification/status');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user notifications
  getNotifications: async () => {
    try {
      const response = await api.get('/users/notifications');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mark notification as read
  markNotificationRead: async (notificationId) => {
    try {
      const response = await api.patch(`/users/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mark all notifications as read
  markAllNotificationsRead: async () => {
    try {
      const response = await api.patch('/users/notifications/read-all');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    try {
      const response = await api.delete(`/users/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user's dashboard stats
  getDashboardStats: async () => {
    try {
      const response = await api.get('/users/dashboard/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update notification settings
  updateNotificationSettings: async (settings) => {
    try {
      const response = await api.put('/users/settings/notifications', settings);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete account
  deleteAccount: async (password) => {
    try {
      const response = await api.post('/users/delete-account', { password });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default userService;