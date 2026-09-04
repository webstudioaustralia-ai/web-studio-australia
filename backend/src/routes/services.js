const express = require('express');
const router = express.Router();
const { query } = require('../db/connection');
const logger = require('../utils/logger');

// Get services
router.get('/', async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM services WHERE is_active = true ORDER BY order_index ASC'
    );

    res.json({ services: result.rows });
  } catch (error) {
    logger.error('Get services error:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR' } });
  }
});

// Get portfolio
router.get('/portfolio', async (req, res) => {
  try {
    const { category, featured } = req.query;

    let sql = 'SELECT * FROM portfolio_projects WHERE 1=1';
    const params = [];

    if (category) {
      params.push(category);
      sql += ` AND category = $${params.length}`;
    }
    if (featured === 'true') {
      sql += ` AND is_featured = true`;
    }

    sql += ' ORDER BY created_at DESC';

    const result = await query(sql, params);

    res.json({ projects: result.rows });
  } catch (error) {
    logger.error('Get portfolio error:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR' } });
  }
});

module.module = router;
