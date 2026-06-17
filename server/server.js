require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const cors    = require('cors');
const http    = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');

connectDB();

const app    = express();
const server = http.createServer(app);

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'https://hostel-link.vercel.app',
  'https://pezahostel.vercel.app',
  'https://pezanyumba.vercel.app',
];

const io = new Server(server, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// ✅ Track online users
const onlineUsers = new Map();

// ✅ Make io and onlineUsers available in all controllers
app.use((req, res, next) => {
  req.io = io;
  req.onlineUsers = onlineUsers;
  next();
});

app.use(cors({
  origin: ALLOWED_ORIGINS,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// ── HEALTH CHECKS ─────────────────────────────────
app.get('/', (req, res) => {
  res.json({ success: true, message: 'PezaNyumba API is running!' });
});
app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'API is working!' });
});

// ── ROUTES ────────────────────────────────────────
const authRoutes         = require('./routes/authRoutes');
const hostelRoutes       = require('./routes/hostelRoutes');
const bookingRoutes      = require('./routes/bookingRoutes');
const paymentRoutes      = require('./routes/paymentRoutes');
const reviewRoutes       = require('./routes/reviewRoutes');
const userRoutes         = require('./routes/userRoutes');
const messageRoutes      = require('./routes/messageRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes        = require('./routes/adminRoutes');

app.use('/api/auth',          authRoutes);
app.use('/api/hostels',       hostelRoutes);
app.use('/api/bookings',      bookingRoutes);
app.use('/api/payments',      paymentRoutes);
app.use('/api/reviews',       reviewRoutes);
app.use('/api/users',         userRoutes);
app.use('/api/messages',      messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin',         adminRoutes);

// ── GLOBAL ERROR HANDLER ──────────────────────────
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

// ── SOCKET.IO ─────────────────────────────────────
io.on('connection', (socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`);

  socket.on('user:join', (userId) => {
    onlineUsers.set(userId, socket.id);
    io.emit('users:online', Array.from(onlineUsers.keys()));
    console.log(`👤 User ${userId} is online`);
  });

  socket.on('conversation:join', (conversationId) => {
    socket.join(conversationId);
  });

  socket.on('conversation:leave', (conversationId) => {
    socket.leave(conversationId);
  });

  socket.on('message:send', (data) => {
    socket.to(data.conversationId).emit('message:receive', data.message);
  });

  socket.on('typing:start', (data) => {
    socket.to(data.conversationId).emit('typing:start', {
      userId: data.userId,
      name:   data.name,
    });
  });

  socket.on('typing:stop', (data) => {
    socket.to(data.conversationId).emit('typing:stop', {
      userId: data.userId,
    });
  });

  socket.on('disconnect', () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        console.log(`👤 User ${userId} went offline`);
        break;
      }
    }
    io.emit('users:online', Array.from(onlineUsers.keys()));
  });
});

// ── START SERVER ──────────────────────────────────
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});