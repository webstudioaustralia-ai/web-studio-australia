const redis = require('redis');
const logger = require('../utils/logger');

class ChatManager {
  constructor() {
    this.redisUrl = process.env.REDIS_URL || 'redis://localhost:6379/1';
    this.client = redis.createClient({ url: this.redisUrl });
    this.client.connect().catch(err => logger.error('Redis connection error:', err));
  }

  async addUserToConversation(conversationId, user) {
    try {
      const key = `conversation:${conversationId}:users`;
      await this.client.hSet(key, user.userId, JSON.stringify(user));
      await this.client.expire(key, 86400); // 24 hour expiry
      return true;
    } catch (error) {
      logger.error('Add user error:', error);
      return false;
    }
  }

  async removeUserFromConversation(conversationId, userId) {
    try {
      const key = `conversation:${conversationId}:users`;
      await this.client.hDel(key, userId);
      return true;
    } catch (error) {
      logger.error('Remove user error:', error);
      return false;
    }
  }

  async getConversationUsers(conversationId) {
    try {
      const key = `conversation:${conversationId}:users`;
      const users = await this.client.hGetAll(key);
      return Object.values(users).map(u => JSON.parse(u));
    } catch (error) {
      logger.error('Get users error:', error);
      return [];
    }
  }

  async getConversations() {
    try {
      const keys = await this.client.keys('conversation:*:users');
      const conversations = [];
      for (const key of keys) {
        const conversationId = key.split(':')[1];
        const users = await this.getConversationUsers(conversationId);
        conversations.push({
          id: conversationId,
          userCount: users.length,
          users
        });
      }
      return conversations;
    } catch (error) {
      logger.error('Get conversations error:', error);
      return [];
    }
  }
}

module.exports = ChatManager;
