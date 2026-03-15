// server/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
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
const app = express();

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