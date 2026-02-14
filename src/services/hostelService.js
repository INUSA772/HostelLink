import api from './api';

const hostelService = {
  // Get all hostels with filters
  getAllHostels: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      // Add filters to query params
      if (filters.search) params.append('search', filters.search);
      if (filters.type) params.append('type', filters.type);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.gender) params.append('gender', filters.gender);
      if (filters.amenities && filters.amenities.length > 0) {
        params.append('amenities', filters.amenities.join(','));
      }
      if (filters.distance) params.append('distance', filters.distance);
      if (filters.sort) params.append('sort', filters.sort);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      
      const response = await api.get(`/hostels?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get single hostel by ID
  getHostelById: async (id) => {
    try {
      const response = await api.get(`/hostels/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new hostel (Owner only)
  createHostel: async (hostelData) => {
    try {
      const response = await api.post('/hostels', hostelData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update hostel (Owner only)
  updateHostel: async (id, hostelData) => {
    try {
      const response = await api.put(`/hostels/${id}`, hostelData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete hostel (Owner only)
  deleteHostel: async (id) => {
    try {
      const response = await api.delete(`/hostels/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get hostels by owner
  getOwnerHostels: async () => {
    try {
      const response = await api.get('/hostels/owner/my-hostels');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get nearby hostels
  getNearbyHostels: async (lat, lng, radius = 5) => {
    try {
      const response = await api.get('/hostels/nearby', {
        params: { lat, lng, radius }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default hostelService;