// server/utils/logger.js
const fs = require('fs');
const path = require('path');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logFile = path.join(logsDir, 'payment.log');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

const logToFile = (level, message, data = {}) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    data,
    env: process.env.NODE_ENV
  };

  try {
    fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
  } catch (error) {
    console.error('Failed to write to log file:', error);
  }
};

const logger = {
  /**
   * Log payment initiation
   */
  initiatePayment: (data) => {
    const message = `[PAYMENT] Initiate Payment`;
    console.log(`${colors.cyan}${message}${colors.reset}`, data);
    logToFile('INITIATE', message, data);
  },

  /**
   * Log webhook received
   */
  webhookReceived: (data) => {
    const message = `[WEBHOOK] Received`;
    console.log(`${colors.magenta}${message}${colors.reset}`, data);
    logToFile('WEBHOOK_RECEIVED', message, data);
  },

  /**
   * Log webhook success
   */
  webhookSuccess: (data) => {
    const message = `[WEBHOOK] ✅ Success`;
    console.log(`${colors.green}${message}${colors.reset}`, data);
    logToFile('WEBHOOK_SUCCESS', message, data);
  },

  /**
   * Log webhook failure
   */
  webhookError: (error, data) => {
    const message = `[WEBHOOK] ❌ Error`;
    console.error(`${colors.red}${message}${colors.reset}`, error, data);
    logToFile('WEBHOOK_ERROR', message, { error: error.message, ...data });
  },

  /**
   * Log payment verification
   */
  verifyPayment: (data) => {
    const message = `[VERIFY] Payment Verification`;
    console.log(`${colors.blue}${message}${colors.reset}`, data);
    logToFile('VERIFY', message, data);
  },

  /**
   * Log Paychangu API call
   */
  paychanguAPI: (method, endpoint, data) => {
    const message = `[PAYCHANGU API] ${method} ${endpoint}`;
    console.log(`${colors.yellow}${message}${colors.reset}`, data);
    logToFile('PAYCHANGU_API', message, { method, endpoint, data });
  },

  /**
   * Log Paychangu API response
   */
  paychanguResponse: (endpoint, response) => {
    const message = `[PAYCHANGU RESPONSE] ${endpoint}`;
    console.log(`${colors.green}${message}${colors.reset}`, response);
    logToFile('PAYCHANGU_RESPONSE', message, { endpoint, response });
  },

  /**
   * Log Paychangu API error
   */
  paychanguError: (endpoint, error) => {
    const message = `[PAYCHANGU ERROR] ${endpoint}`;
    console.error(`${colors.red}${message}${colors.reset}`, error);
    logToFile('PAYCHANGU_ERROR', message, { endpoint, error: error.message });
  },

  /**
   * Log database update
   */
  databaseUpdate: (model, action, data) => {
    const message = `[DB] ${model} - ${action}`;
    console.log(`${colors.blue}${message}${colors.reset}`, data);
    logToFile('DATABASE', message, { model, action, data });
  },

  /**
   * Log error
   */
  error: (context, error) => {
    const message = `[ERROR] ${context}`;
    console.error(`${colors.red}${message}${colors.reset}`, error.message);
    logToFile('ERROR', message, { context, error: error.message, stack: error.stack });
  },

  /**
   * Log success
   */
  success: (context, data) => {
    const message = `[SUCCESS] ${context}`;
    console.log(`${colors.green}${message}${colors.reset}`, data);
    logToFile('SUCCESS', message, { context, data });
  },

  /**
   * Log info
   */
  info: (context, data) => {
    const message = `[INFO] ${context}`;
    console.log(`${colors.cyan}${message}${colors.reset}`, data);
    logToFile('INFO', message, { context, data });
  },

  /**
   * Log warning
   */
  warn: (context, data) => {
    const message = `[WARN] ${context}`;
    console.warn(`${colors.yellow}${message}${colors.reset}`, data);
    logToFile('WARN', message, { context, data });
  },

  /**
   * View recent logs
   */
  viewRecent: (lines = 50) => {
    try {
      const content = fs.readFileSync(logFile, 'utf8');
      const logLines = content.trim().split('\n').slice(-lines);
      console.log(`\n📋 Last ${lines} log entries:\n`);
      logLines.forEach(line => {
        try {
          const entry = JSON.parse(line);
          console.log(`[${entry.timestamp}] ${entry.level}: ${entry.message}`, entry.data);
        } catch {
          console.log(line);
        }
      });
    } catch (error) {
      console.error('Failed to read logs:', error.message);
    }
  },

  /**
   * Clear logs
   */
  clear: () => {
    try {
      fs.writeFileSync(logFile, '');
      console.log(`${colors.green}✅ Logs cleared${colors.reset}`);
    } catch (error) {
      console.error('Failed to clear logs:', error.message);
    }
  }
};

module.exports = logger;