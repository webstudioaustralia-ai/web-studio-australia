const express = require('express');
const router = express.Router();
const { query } = require('../db/connection');
const logger = require('../utils/logger');

// Create lead
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, company, message, source, budget } = req.body;

    const result = await query(
      `INSERT INTO leads (name, email, phone, company, message, source, budget, status, score)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'new', 50)
       RETURNING *`,
      [name, email, phone, company, message, source, budget]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    logger.error('Create lead error:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR' } });
  }
});

// Get leads
router.get('/', async (req, res) => {
  try {
    const { status, source, limit = 50, offset = 0 } = req.query;

    let sql = 'SELECT * FROM leads WHERE 1=1';
    const params = [];

    if (status) {
      params.push(status);
      sql += ` AND status = $${params.length}`;
    }
    if (source) {
      params.push(source);
      sql += ` AND source = $${params.length}`;
    }

    sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await query(sql, params);

    res.json({
      leads: result.rows,
      total: result.rowCount
    });
  } catch (error) {
    logger.error('Get leads error:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR' } });
  }
});

// Update lead
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const result = await query(
      `UPDATE leads SET status = COALESCE($1, status), updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: { code: 'NOT_FOUND' } });
    }

    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Update lead error:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR' } });
  }
});

module.exports = router;
