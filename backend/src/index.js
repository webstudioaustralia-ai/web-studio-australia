const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const logger = require('./utils/logger');
const { connectDatabase } = require('./db/connection');

// Import routes
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const aiRoutes = require('./routes/ai');
const leadsRoutes = require('./routes/leads');
const servicesRoutes = require('./routes/services');
const analyticsRoutes = require('./routes/analytics');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 1000 // limit each IP to 1000 requests per windowMs
});
app.use(limiter);

// Body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/analytics', analyticsRoutes);

// WebSocket connection for live chat
io.on('connection', (socket) => {
  logger.info(`New client connected: ${socket.id}`);

  socket.on('join_conversation', (data) => {
    socket.join(`conversation_${data.conversationId}`);
    logger.info(`User joined conversation: ${data.conversationId}`);
  });

  socket.on('leave_conversation', (data) => {
    socket.leave(`conversation_${data.conversationId}`);
    logger.info(`User left conversation: ${data.conversationId}`);
  });

  socket.on('message', (data) => {
    io.to(`conversation_${data.conversationId}`).emit('message', data);
    logger.info(`Message sent in conversation: ${data.conversationId}`);
  });

  socket.on('typing', (data) => {
    socket.to(`conversation_${data.conversationId}`).emit('typing', {
      userId: data.userId,
      userName: data.userName
    });
  });

  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Error handling
app.use((err, req, res, next) => {
  logger.error('Error:', err);
  res.status(err.status || 500).json({
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'An internal error occurred'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: 'Endpoint not found'
    }
  });
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDatabase();
    logger.info('Database connected');

    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = { app, io };
