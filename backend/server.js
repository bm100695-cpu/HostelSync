require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// API Routes
app.use('/api', apiRoutes);

// Health Check
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    system: 'HostelSync Core API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth/login',
      passes: '/api/passes',
      complaints: '/api/complaints',
      mess: '/api/mess',
      notices: '/api/notices',
      securityScan: '/api/security/scan',
      analytics: '/api/admin/analytics',
      aiChat: '/api/ai/chat'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 HostelSync Backend Server running on port ${PORT}`);
  console.log(`📡 REST API endpoint ready at http://localhost:${PORT}/api`);
});
