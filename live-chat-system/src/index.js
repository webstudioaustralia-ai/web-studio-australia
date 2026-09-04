const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const redis = require('redis');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const logger = require('./utils/logger');
const ChatManager = require('./services/chat-manager');
const AIChatHandler = require('./services/ai-handler');
const MessageStore = require('./services/message-store');

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Initialize services
const chatManager = new ChatManager();
const aiHandler = new AIChatHandler();
const messageStore = new MessageStore();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Live Chat Server' });
});

// Get active conversations
app.get('/conversations', async (req, res) => {
  try {
    const conversations = await chatManager.getConversations();
    res.json({ conversations });
  } catch (error) {
    logger.error('Get conversations error:', error);
    res.status(500).json({ error: 'Failed to retrieve conversations' });
  }
});

// WebSocket connection handling
io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.id}`);

  // Join conversation room
  socket.on('join_conversation', async (data) => {
    try {
      const conversationId = data.conversationId || uuidv4();
      const userId = data.userId;
      const userName = data.userName || 'Guest';

      socket.join(`conversation_${conversationId}`);

      // Store user in conversation
      await chatManager.addUserToConversation(conversationId, {
        userId,
        userName,
        socketId: socket.id,
        joinedAt: new Date()
      });

      // Notify others
      io.to(`conversation_${conversationId}`).emit('user_joined', {
        userId,
        userName,
        timestamp: new Date()
      });

      // Send message history
      const history = await messageStore.getConversationHistory(conversationId);
      socket.emit('message_history', { messages: history });

      // Send active users
      const users = await chatManager.getConversationUsers(conversationId);
      socket.emit('active_users', { users });

      logger.info(`User ${userId} joined conversation ${conversationId}`);
    } catch (error) {
      logger.error('Join conversation error:', error);
      socket.emit('error', { message: 'Failed to join conversation' });
    }
  });

  // Send message
  socket.on('message', async (data) => {
    try {
      const { conversationId, content, userId, userName } = data;

      const message = {
        id: uuidv4(),
        conversationId,
        sender: userId,
        senderName: userName,
        content,
        timestamp: new Date(),
        read: false
      };

      // Store message
      await messageStore.saveMessage(message);

      // Broadcast to all in conversation
      io.to(`conversation_${conversationId}`).emit('message', message);

      logger.info(`Message sent in conversation ${conversationId}`);

      // Check if AI should respond
      if (!userId.startsWith('team')) {
        // AI response
        setTimeout(async () => {
          const aiResponse = await aiHandler.generateResponse(content, conversationId);
          
          const aiMessage = {
            id: uuidv4(),
            conversationId,
            sender: 'ai-agent',
            senderName: 'AI Assistant',
            content: aiResponse,
            timestamp: new Date(),
            read: false
          };

          await messageStore.saveMessage(aiMessage);
          io.to(`conversation_${conversationId}`).emit('message', aiMessage);
        }, 500);
      }
    } catch (error) {
      logger.error('Message error:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Typing indicator
  socket.on('typing', (data) => {
    const { conversationId, userId, userName } = data;
    socket.to(`conversation_${conversationId}`).emit('typing', {
      userId,
      userName,
      timestamp: new Date()
    });
  });

  socket.on('stop_typing', (data) => {
    const { conversationId, userId } = data;
    socket.to(`conversation_${conversationId}`).emit('stop_typing', {
      userId
    });
  });

  // Message read receipt
  socket.on('message_read', async (data) => {
    try {
      const { conversationId, messageId } = data;
      await messageStore.markMessageAsRead(messageId);
      io.to(`conversation_${conversationId}`).emit('message_read', { messageId });
    } catch (error) {
      logger.error('Mark read error:', error);
    }
  });

  // Leave conversation
  socket.on('leave_conversation', async (data) => {
    try {
      const { conversationId, userId } = data;
      socket.leave(`conversation_${conversationId}`);
      await chatManager.removeUserFromConversation(conversationId, userId);

      io.to(`conversation_${conversationId}`).emit('user_left', {
        userId,
        timestamp: new Date()
      });

      logger.info(`User ${userId} left conversation ${conversationId}`);
    } catch (error) {
      logger.error('Leave conversation error:', error);
    }
  });

  // Disconnect
  socket.on('disconnect', async () => {
    logger.info(`User disconnected: ${socket.id}`);
    // Clean up user from all conversations
  });

  // Error handling
  socket.on('error', (error) => {
    logger.error(`Socket error: ${error}`);
  });
});

// Error handling
app.use((err, req, res, next) => {
  logger.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
const PORT = process.env.CHAT_SERVER_PORT || 5001;

server.listen(PORT, () => {
  logger.info(`Live Chat Server running on port ${PORT}`);
});

module.exports = { app, io };
