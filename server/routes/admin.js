// server/routes/admin.js
const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { requireAuth, requireSupport } = require('../middleware/auth');

const router = express.Router();

// Todas las rutas requieren autenticación + rol support
router.use(requireAuth, requireSupport);

// GET /admin/users - Listar todos los usuarios
router.get('/users', (req, res) => {
  const sql = `
    SELECT id, email, display_name, avatar_url, role, created_at
    FROM users
    ORDER BY created_at DESC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error listando usuarios:', err);
      return res.status(500).json({ error: 'Error interno' });
    }
    res.json(rows);
  });
});

// GET /admin/users/:id - Obtener un usuario específico
router.get('/users/:id', (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT id, email, display_name, avatar_url, role, created_at
    FROM users
    WHERE id = ?
  `;

  db.get(sql, [id], (err, row) => {
    if (err) {
      console.error('Error obteniendo usuario:', err);
      return res.status(500).json({ error: 'Error interno' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(row);
  });
});

// PUT /admin/users/:id - Actualizar usuario (rol, nombre, avatar)
router.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { display_name, avatar_url, role } = req.body;

  // Validar rol
  if (role && !['client', 'support'].includes(role)) {
    return res.status(400).json({ error: 'Rol inválido. Debe ser "client" o "support"' });
  }

  const sql = `
    UPDATE users
    SET display_name = COALESCE(?, display_name),
        avatar_url = COALESCE(?, avatar_url),
        role = COALESCE(?, role)
    WHERE id = ?
  `;

  db.run(sql, [display_name, avatar_url, role, id], function (err) {
    if (err) {
      console.error('Error actualizando usuario:', err);
      return res.status(500).json({ error: 'Error interno' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Devolver usuario actualizado
    const sqlSelect = `
      SELECT id, email, display_name, avatar_url, role, created_at
      FROM users
      WHERE id = ?
    `;
    db.get(sqlSelect, [id], (err2, row) => {
      if (err2) {
        console.error('Error leyendo usuario actualizado:', err2);
        return res.status(500).json({ error: 'Error interno' });
      }
      res.json(row);
    });
  });
});

// PUT /admin/users/:id/password - Cambiar contraseña de un usuario
router.put('/users/:id/password', (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
  }

  bcrypt.hash(newPassword, 10, (errHash, hash) => {
    if (errHash) {
      console.error('Error haciendo hash:', errHash);
      return res.status(500).json({ error: 'Error interno' });
    }

    const sql = 'UPDATE users SET password_hash = ? WHERE id = ?';
    db.run(sql, [hash, id], function (err) {
      if (err) {
        console.error('Error actualizando contraseña:', err);
        return res.status(500).json({ error: 'Error interno' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      res.json({ success: true, message: 'Contraseña actualizada correctamente' });
    });
  });
});

// DELETE /admin/users/:id - Eliminar usuario
router.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  // No permitir que un admin se elimine a sí mismo
  if (parseInt(id) === req.user.id) {
    return res.status(400).json({ error: 'No puedes eliminar tu propia cuenta desde el panel de admin' });
  }

  const sql = 'DELETE FROM users WHERE id = ?';
  db.run(sql, [id], function (err) {
    if (err) {
      console.error('Error eliminando usuario:', err);
      return res.status(500).json({ error: 'Error interno' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ success: true, message: 'Usuario eliminado correctamente' });
  });
});

// GET /admin/stats - Estadísticas generales
router.get('/stats', (req, res) => {
  const queries = {
    totalUsers: 'SELECT COUNT(*) as count FROM users',
    totalClients: "SELECT COUNT(*) as count FROM users WHERE role = 'client'",
    totalSupport: "SELECT COUNT(*) as count FROM users WHERE role = 'support'",
    totalChats: 'SELECT COUNT(*) as count FROM support_chats',
    pendingChats: "SELECT COUNT(*) as count FROM support_chats WHERE status = 'pending'",
    avgRating: 'SELECT AVG(rating) as avg FROM support_chats WHERE rating IS NOT NULL'
  };

  const stats = {};
  let completed = 0;
  const total = Object.keys(queries).length;

  Object.entries(queries).forEach(([key, sql]) => {
    db.get(sql, [], (err, row) => {
      if (err) {
        console.error(`Error en stats ${key}:`, err);
        stats[key] = 0;
      } else {
        stats[key] = row.count || row.avg || 0;
      }

      completed++;
      if (completed === total) {
        res.json(stats);
      }
    });
  });
});

module.exports = router;
