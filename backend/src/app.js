const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const config = require('./config/config');
const errorHandler = require('./core/middlewares/errorHandler');
const { NotFoundError } = require('./core/errors/AppError');
const { generalLimiter } = require('./core/middlewares/rateLimit');

const app = express();

// 1. Security Headers via Helmet
app.use(
  helmet({
    contentSecurityPolicy: config.isProduction ? undefined : false,
    crossOriginEmbedderPolicy: false,
  })
);

// 2. CORS configuration with credentials allow-list
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or server-to-server)
    if (!origin) return callback(null, true);
    
    // In development, accept localhost origins
    if (!config.isProduction) {
      if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
        return callback(null, true);
      }
    }

    if (origin === config.cors.origin) {
      return callback(null, true);
    }

    return callback(new Error('Blocked by CORS policy'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Disposition'],
};
app.use(cors(corsOptions));

// 3. Request Body & Cookie Parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser(config.cookie.secret));

// 4. Request Logging
if (!config.isProduction) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// 5. Rate Limiting for all API requests
app.use('/api', generalLimiter);

// 6. Root & Health Check Endpoints
app.get('/', (req, res) => {
  res.json({
    name: 'LLC Student Registration System API',
    version: '1.0.0',
    status: 'ONLINE',
    docs: '/api/health',
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: config.env,
  });
});

// 7. Route mounts for feature modules
const authRoutes = require('./modules/auth/auth.routes');
const courseRoutes = require('./modules/courses/course.routes');
const batchRoutes = require('./modules/batches/batch.routes');

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/batches', batchRoutes);
// app.use('/api/registrations', registrationRoutes);
// app.use('/api/students', studentRoutes);
// app.use('/api/admin', adminRoutes);

// 8. 404 Handler for undefined routes
app.use((req, res, next) => {
  next(new NotFoundError(`Cannot ${req.method} ${req.originalUrl}`));
});

// 9. Centralized Error Handling Middleware
app.use(errorHandler);

module.exports = app;
