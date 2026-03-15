// server/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
<<<<<<< HEAD
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');

const connectDB = require('./db/connectDB');
const logger = require('./utils/logger');

// ═══════════════════════════════════════════════════════════════════════════
// DATABASE CONNECTION
// ═══════════════════════════════════════════════════════════════════════════
connectDB();

// ═══════════════════════════════════════════════════════════════════════════
// EXPRESS APP INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════
=======
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/database');

connectDB();

>>>>>>> b58c1592af02064fbd8848ccc82e179f0aa458a4
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:5173',
      'https://hostel-link.vercel.app',
      'https://pezahostel.vercel.app',
    ],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// ✅ Track online users globally
const onlineUsers = new Map();

// ✅ Make io and onlineUsers available in all controllers
app.use((req, res, next) => {
  req.io = io;
  req.onlineUsers = onlineUsers;
  next();
});

<<<<<<< HEAD
// ═══════════════════════════════════════════════════════════════════════════
// SECURITY MIDDLEWARE
// ═══════════════════════════════════════════════════════════════════════════

// Helmet - Set security HTTP headers
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: false
}));

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Rate limiting - Prevent brute force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Payment endpoints have stricter rate limiting
const paymentLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 requests per minute
  message: 'Too many payment requests, please try again later.'
});
app.use('/api/payments/initiate', paymentLimiter);

// ═══════════════════════════════════════════════════════════════════════════
// CORS CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════
const corsOptions = {
  origin: (process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:5173').split(','),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// ═══════════════════════════════════════════════════════════════════════════
// BODY PARSING MIDDLEWARE
// ═══════════════════════════════════════════════════════════════════════════
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ═══════════════════════════════════════════════════════════════════════════
// LOGGING MIDDLEWARE
// ═══════════════════════════════════════════════════════════════════════════
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Custom request logging for debugging
app.use((req, res, next) => {
  const startTime = Date.now();
  
  // Log request
  logger.info(`${req.method} ${req.path}`, {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.headers['user-agent']
  });

  // Log response time
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info(`Response - ${req.method} ${req.path}`, {
      statusCode: res.statusCode,
      duration: `${duration}ms`
    });
  });

  next();
});

// ═══════════════════════════════════════════════════════════════════════════
// ROUTES
// ═══════════════════════════════════════════════════════════════════════════

// ✅ Health check endpoints
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    mongoConnected: require('mongoose').connection.readyState === 1
  });
});

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🏠 HostelLink API Server',
    version: '1.0.0',
    environment: process.env.NODE_ENV,
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      hostels: '/api/hostels',
      bookings: '/api/bookings',
      payments: '/api/payments',
      health: '/api/health'
    }
  });
});

// ✅ API Routes
try {
  app.use('/api/auth', require('./routes/authRoutes'));
  app.use('/api/users', require('./routes/userRoutes'));
  app.use('/api/hostels', require('./routes/hostelRoutes'));
  app.use('/api/bookings', require('./routes/bookingRoutes'));
  app.use('/api/payments', require('./routes/paymentRoutes'));
  
  logger.success('Routes Loaded', {
    auth: '/api/auth',
    users: '/api/users',
    hostels: '/api/hostels',
    bookings: '/api/bookings',
    payments: '/api/payments'
  });
} catch (error) {
  logger.error('Route Loading Error', error);
}

// ═══════════════════════════════════════════════════════════════════════════
// 404 HANDLER
// ═══════════════════════════════════════════════════════════════════════════
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// GLOBAL ERROR HANDLER
// ═══════════════════════════════════════════════════════════════════════════
app.use((error, req, res, next) => {
  const statusCode = error.statusCode || error.status || 500;
  const message = error.message || 'Internal Server Error';

  logger.error('Global Error Handler', error);

  // Don't expose sensitive error details in production
  const response = {
    success: false,
    message: message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack,
      details: error
    })
  };

  res.status(statusCode).json(response);
});

// ═══════════════════════════════════════════════════════════════════════════
// HANDLE UNHANDLED PROMISE REJECTIONS
// ═══════════════════════════════════════════════════════════════════════════
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', new Error(reason));
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', error);
  console.error('Uncaught Exception:', error);
  // Exit process to avoid inconsistent state
  process.exit(1);
});

// ═══════════════════════════════════════════════════════════════════════════
// START SERVER
// ═══════════════════════════════════════════════════════════════════════════
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const server = app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║         🏠 HostelLink API Server - Ready to Serve            ║
║                                                               ║
║  Environment: ${NODE_ENV.padEnd(52)} ║
║  Port: ${String(PORT).padEnd(59)} ║
║  URL: http://localhost:${PORT.toString().padEnd(44)} ║
║                                                               ║
║  ✅ Database: ${require('mongoose').connection.readyState === 1 ? 'Connected' : 'Connecting...'.padEnd(45)} ║
║  ✅ Paychangu Keys: ${process.env.PAYCHANGU_SECRET_KEY ? 'Loaded' : 'Not configured'.padEnd(46)} ║
║                                                               ║
║  📋 API Endpoints:                                           ║
║    - GET  http://localhost:${PORT}/api/health                  ║
║    - POST http://localhost:${PORT}/api/auth/register          ║
║    - POST http://localhost:${PORT}/api/auth/login             ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
  `);

  logger.success('Server Started', {
    port: PORT,
    environment: NODE_ENV,
    nodeVersion: process.version,
    uptime: process.uptime()
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// GRACEFUL SHUTDOWN
// ═══════════════════════════════════════════════════════════════════════════
const gracefulShutdown = async (signal) => {
  console.log(`\n${signal} received, shutting down gracefully...`);
  logger.info('Graceful Shutdown', { signal });

  // Close server
  server.close(async () => {
    console.log('✅ Server closed');

    // Close database connection
    try {
      await require('mongoose').connection.close();
      console.log('✅ MongoDB connection closed');
      logger.success('Shutdown Complete', {});
    } catch (error) {
      logger.error('Database Shutdown Error', error);
    }

    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('❌ Force shutting down...');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

module.exports = app;
=======
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://hostel-link.vercel.app',
    'https://pezahostel.vercel.app',
  ],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Health checks
app.get('/', (req, res) => {
  res.json({ success: true, message: 'PezaHostel API is running!' });
});
app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'API is working!' });
});

// Routes
const authRoutes         = require('./routes/authRoutes');
const hostelRoutes       = require('./routes/hostelRoutes');
const bookingRoutes      = require('./routes/bookingRoutes');
const paymentRoutes      = require('./routes/paymentRoutes');
const reviewRoutes       = require('./routes/reviewRoutes');
const userRoutes         = require('./routes/userRoutes');
const messageRoutes      = require('./routes/messageRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

app.use('/api/auth',          authRoutes);
app.use('/api/hostels',       hostelRoutes);
app.use('/api/bookings',      bookingRoutes);
app.use('/api/payments',      paymentRoutes);
app.use('/api/reviews',       reviewRoutes);
app.use('/api/users',         userRoutes);
app.use('/api/messages',      messageRoutes);
app.use('/api/notifications', notificationRoutes);

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

// ── Socket.io ──────────────────────────────────────
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
      name: data.name,
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

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
>>>>>>> b58c1592af02064fbd8848ccc82e179f0aa458a4
