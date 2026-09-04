const express = require('express');
const router = express.Router();
const { query } = require('../db/connection');
const logger = require('../utils/logger');
const { authenticateToken } = require('../middleware/auth');

// Get dashboard analytics
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Get conversation count
    const convCount = await query(
      'SELECT COUNT(*) as total FROM conversations'
    );

    // Get leads count
    const leadsCount = await query(
      'SELECT COUNT(*) as total FROM leads'
    );

    // Get qualified leads
    const qualifiedLeads = await query(
      `SELECT COUNT(*) as total FROM leads 
       WHERE status IN ('qualified', 'contacted', 'won')`
    );

    // Get average response time
    const avgResponse = await query(
      `SELECT AVG(EXTRACT(EPOCH FROM (m2.created_at - m1.created_at))) as avg_seconds
       FROM messages m1
       JOIN messages m2 ON m1.conversation_id = m2.conversation_id
       WHERE m1.sender_type = 'client' AND m2.sender_type = 'team'
       AND m2.created_at > m1.created_at`
    );

    res.json({
      metrics: {
        totalConversations: parseInt(convCount.rows[0].total),
        totalLeads: parseInt(leadsCount.rows[0].total),
        qualifiedLeads: parseInt(qualifiedLeads.rows[0].total),
        conversionRate: parseInt(qualifiedLeads.rows[0].total) / parseInt(leadsCount.rows[0].total) || 0,
        averageResponseTime: avgResponse.rows[0]?.avg_seconds ? `${Math.round(avgResponse.rows[0].avg_seconds / 60)}m` : 'N/A'
      }
    });
  } catch (error) {
    logger.error('Analytics error:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR' } });
  }
});

module.exports = router;
