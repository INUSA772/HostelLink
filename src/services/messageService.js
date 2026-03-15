import api from './api';

const messageService = {
  getOrCreateConversation: async (hostelId, ownerId) => {
    const response = await api.post('/messages/conversation', { hostelId, ownerId });
    return response.data;
  },

  getConversations: async () => {
    const response = await api.get('/messages/conversations');
    return response.data;
  },

  getMessages: async (conversationId, page = 1) => {
    const response = await api.get(`/messages/${conversationId}?page=${page}`);
    return response.data;
  },

  sendMessage: async (conversationId, text) => {
    const response = await api.post(`/messages/${conversationId}`, { text });
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await api.get('/messages/unread-count');
    return response.data;
  },

  deleteConversation: async (conversationId) => {
    const response = await api.delete(`/messages/conversation/${conversationId}`);
    return response.data;
  },
};

export default messageService;