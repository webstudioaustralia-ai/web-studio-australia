const axios = require('axios');
const logger = require('../utils/logger');

class AIChatHandler {
  constructor() {
    this.apiUrl = process.env.API_URL || 'http://localhost:5000/api';
  }

  async generateResponse(message, conversationId) {
    try {
      const response = await axios.post(`${this.apiUrl}/ai/query`, {
        message,
        conversationId,
        context: {
          source: 'live_chat'
        }
      });

      return response.data.message || 'Thank you for your message. Our team will review it shortly.';
    } catch (error) {
      logger.error('AI response generation error:', error);
      return 'Thank you for reaching out. Our team will get back to you soon.';
    }
  }
}

module.exports = AIChatHandler;
