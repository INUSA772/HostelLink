import api from './api';

const hostelService = {
  getAllHostels: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
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

  getHostelById: async (id) => {
    try {
      const response = await api.get(`/hostels/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createHostel: async (hostelData) => {
    try {
      const response = await api.post('/hostels', hostelData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateHostel: async (id, hostelData) => {
    try {
      const response = await api.put(`/hostels/${id}`, hostelData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteHostel: async (id) => {
    try {
      const response = await api.delete(`/hostels/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ✅ FIXED: correct endpoint
  getOwnerHostels: async () => {
    try {
      const response = await api.get('/hostels/my-hostels');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

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