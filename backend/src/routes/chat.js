const express = require('express');
const router = express.Router();
const { query } = require('../db/connection');
const logger = require('../utils/logger');
const { authenticateToken } = require('../middleware/auth');

// Get conversations
router.get('/conversations', authenticateToken, async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    const result = await query(
      `SELECT c.*, u.name, u.email, u.avatar_url,
              (SELECT content FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message
       FROM conversations c
       LEFT JOIN users u ON c.participant_id = u.id
       ORDER BY c.updated_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    res.json({
      conversations: result.rows,
      total: result.rowCount
    });
  } catch (error) {
    logger.error('Get conversations error:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR' } });
  }
});

// Get conversation with messages
router.get('/conversations/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    // Get conversation
    const convResult = await query(
      'SELECT * FROM conversations WHERE id = $1',
      [id]
    );

    if (convResult.rows.length === 0) {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Conversation not found' }
      });
    }

    // Get messages
    const msgResult = await query(
      `SELECT m.*, u.name, u.avatar_url
       FROM messages m
       LEFT JOIN users u ON m.sender_id = u.id
       WHERE m.conversation_id = $1
       ORDER BY m.created_at DESC
       LIMIT $2 OFFSET $3`,
      [id, limit, offset]
    );

    res.json({
      conversation: convResult.rows[0],
      messages: msgResult.rows.reverse(),
      total: msgResult.rowCount
    });
  } catch (error) {
    logger.error('Get conversation error:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR' } });
  }
});

// Send message
router.post('/conversations/:id/messages', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content) {
      return res.status(400).json({
        error: { code: 'INVALID_REQUEST', message: 'Message content required' }
      });
    }

    const result = await query(
      `INSERT INTO messages (conversation_id, sender_id, content, sender_type)
       VALUES ($1, $2, $3, 'team')
       RETURNING *`,
      [id, userId, content]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    logger.error('Send message error:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR' } });
  }
});

module.exports = router;
