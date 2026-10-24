const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from backend/.env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const config = {
  env: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  port: parseInt(process.env.PORT || '5000', 10),
  
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  },

  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'llc_registration',
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10),
    waitForConnections: true,
    queueLimit: 0,
    timezone: 'Z',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'llc_jwt_default_secret_dev_only',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    cookieName: 'llc_auth_token',
  },

  cookie: {
    secret: process.env.COOKIE_SECRET || 'llc_cookie_default_secret_dev_only',
  },

  adminSeed: {
    name: process.env.ADMIN_NAME || 'LLC Administrator',
    email: process.env.ADMIN_EMAIL || 'admin@llc.edu.lk',
    password: process.env.ADMIN_PASSWORD || 'AdminPass2026!',
  },

  email: {
    smtpHost: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    smtpPort: parseInt(process.env.SMTP_PORT || '2525', 10),
    smtpUser: process.env.SMTP_USER || '',
    smtpPass: process.env.SMTP_PASS || '',
    from: process.env.EMAIL_FROM || 'noreply@llc.edu.lk',
  },
};

module.exports = config;
