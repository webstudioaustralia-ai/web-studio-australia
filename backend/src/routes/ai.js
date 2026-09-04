const express = require('express');
const router = express.Router();
const axios = require('axios');
const logger = require('../utils/logger');

// Query AI agent
router.post('/query', async (req, res) => {
  try {
    const { message, conversationId, context } = req.body;

    if (!message) {
      return res.status(400).json({
        error: { code: 'INVALID_REQUEST', message: 'Message required' }
      });
    }

    // Call Python AI agent
    const response = await axios.post('http://ai-agent:8000/query', {
      message,
      conversationId,
      context
    });

    res.json(response.data);
  } catch (error) {
    logger.error('AI query error:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR' } });
  }
});

// Get intents
router.get('/intents', async (req, res) => {
  try {
    const response = await axios.get('http://ai-agent:8000/intents');
    res.json(response.data);
  } catch (error) {
    logger.error('Get intents error:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR' } });
  }
});

module.exports = router;
