const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

router.get('/', requireAuth, (req, res) => {
    const userId = req.user.id;

    const sql = `
    SELECT p.*
    FROM favorites f
    JOIN products p ON p.id = f.product_id
    WHERE f.user_id = ?
    ORDER BY f.created_at DESC
  `;

    db.all(sql, [userId], (err, rows) => {
        if (err) {
            console.error('Error obteniendo favoritos:', err);
            return res.status(500).json({ error: 'Error interno' });
        }
        res.json(rows);
    });
});

module.exports = router;
