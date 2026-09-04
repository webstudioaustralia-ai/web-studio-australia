const redis = require('redis');
const logger = require('../utils/logger');

class MessageStore {
  constructor() {
    this.redisUrl = process.env.REDIS_URL || 'redis://localhost:6379/1';
    this.client = redis.createClient({ url: this.redisUrl });
    this.client.connect().catch(err => logger.error('Redis connection error:', err));
  }

  async saveMessage(message) {
    try {
      const key = `conversation:${message.conversationId}:messages`;
      await this.client.rPush(key, JSON.stringify(message));
      await this.client.expire(key, 2592000); // 30 day expiry
      return true;
    } catch (error) {
      logger.error('Save message error:', error);
      return false;
    }
  }

  async getConversationHistory(conversationId, limit = 50) {
    try {
      const key = `conversation:${conversationId}:messages`;
      const start = Math.max(0, await this.client.lLen(key) - limit);
      const messages = await this.client.lRange(key, start, -1);
      return messages.map(m => JSON.parse(m));
    } catch (error) {
      logger.error('Get history error:', error);
      return [];
    }
  }

  async markMessageAsRead(messageId) {
    try {
      const key = `message:${messageId}:read`;
      await this.client.set(key, 'true', { EX: 86400 });
      return true;
    } catch (error) {
      logger.error('Mark read error:', error);
      return false;
    }
  }

  async deleteConversation(conversationId) {
    try {
      const key = `conversation:${conversationId}:messages`;
      await this.client.del(key);
      return true;
    } catch (error) {
      logger.error('Delete conversation error:', error);
      return false;
    }
  }
}

module.exports = MessageStore;
