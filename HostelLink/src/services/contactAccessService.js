import api from './api';

const contactAccessService = {
  getSettings: async () => {
    const response = await api.get('/contact-access/settings');
    return response.data;
  },

  initiate: async (hostelId, payerPhone) => {
    const response = await api.post('/contact-access/initiate', { hostelId, payerPhone });
    return response.data;
  },

  verify: async (transactionId) => {
    const response = await api.get(`/contact-access/verify/${transactionId}`);
    return response.data;
  },

  reveal: async (hostelId, transactionId) => {
    const response = await api.get(`/contact-access/reveal/${hostelId}`, { params: { transactionId } });
    return response.data;
  },
};

export default contactAccessService;
