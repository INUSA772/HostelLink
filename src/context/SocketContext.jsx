import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') 
  || 'http://localhost:5000';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const socketRef = useRef(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      setConnected(true);
      socket.emit('user:join', user._id);
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socket.on('users:online', (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated, user]);

  const joinConversation   = (id) => socketRef.current?.emit('conversation:join', id);
  const leaveConversation  = (id) => socketRef.current?.emit('conversation:leave', id);
  const sendSocketMessage  = (conversationId, message) =>
    socketRef.current?.emit('message:send', { conversationId, message });
  const startTyping = (conversationId) =>
    socketRef.current?.emit('typing:start', {
      conversationId, userId: user?._id, name: user?.firstName,
    });
  const stopTyping = (conversationId) =>
    socketRef.current?.emit('typing:stop', {
      conversationId, userId: user?._id,
    });
  const isUserOnline = (userId) => onlineUsers.includes(userId);

  return (
    <SocketContext.Provider value={{
      socket: socketRef.current,
      connected,
      onlineUsers,
      joinConversation,
      leaveConversation,
      sendSocketMessage,
      startTyping,
      stopTyping,
      isUserOnline,
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocket must be used within SocketProvider');
  return context;
};

export default SocketContext;