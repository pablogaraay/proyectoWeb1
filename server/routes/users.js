// server/routes/users.js
const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /users/me -> devuelve tu perfil
router.get('/me', requireAuth, (req, res) => {
  const sql = `
    SELECT id, email, display_name, avatar_url, created_at
    FROM users
    WHERE id = ?
  `;

  db.get(sql, [req.user.id], (err, row) => {
    if (err) {
      console.error('Error consultando usuario:', err);
      return res.status(500).json({ error: 'Error interno' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(row);
  });
});

// PUT /users/me -> actualizar nombre / avatar
router.put('/me', requireAuth, (req, res) => {
  const { display_name, avatar_url } = req.body;

  const sql = `
    UPDATE users
    SET display_name = ?, avatar_url = ?
    WHERE id = ?
  `;

  db.run(sql, [display_name, avatar_url, req.user.id], function (err) {
    if (err) {
      console.error('Error actualizando usuario:', err);
      return res.status(500).json({ error: 'Error interno' });
    }

    // devolvemos el usuario actualizado
    const sqlSelect = `
      SELECT id, email, display_name, avatar_url, created_at
      FROM users
      WHERE id = ?
    `;
    db.get(sqlSelect, [req.user.id], (err2, row) => {
      if (err2) {
        console.error('Error leyendo usuario actualizado:', err2);
        return res.status(500).json({ error: 'Error interno' });
      }
      res.json(row);
    });
  });
});

// DELETE /users/me -> borrar cuenta
router.delete('/me', requireAuth, (req, res) => {
  const sql = 'DELETE FROM users WHERE id = ?';

  db.run(sql, [req.user.id], function (err) {
    if (err) {
      console.error('Error borrando usuario:', err);
      return res.status(500).json({ error: 'Error interno' });
    }

    res.json({ success: true });
  });
});

module.exports = router;
