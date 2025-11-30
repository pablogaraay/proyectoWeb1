// server/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();

// ⚙️ CLAVE JWT (en serio, para el trabajo vale así; en real → .env)
const JWT_SECRET = 'supersecreto_relojes_2025';
const JWT_EXPIRES_IN = '2h';

// POST /auth/register
router.post('/register', (req, res) => {
  const { email, password, display_name } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
  }

  const sqlCheck = 'SELECT id FROM users WHERE email = ?';
  db.get(sqlCheck, [email], (err, row) => {
    if (err) {
      console.error('Error comprobando usuario:', err);
      return res.status(500).json({ error: 'Error interno' });
    }
    if (row) {
      return res.status(409).json({ error: 'Correo ya registrado' });
    }

    // Hash de la contraseña
    bcrypt.hash(password, 10, (errHash, hash) => {
      if (errHash) {
        console.error('Error haciendo hash:', errHash);
        return res.status(500).json({ error: 'Error interno' });
      }

      const sqlInsert = `
        INSERT INTO users (email, password_hash, display_name)
        VALUES (?, ?, ?)
      `;
      db.run(sqlInsert, [email, hash, display_name || null], function (errInsert) {
        if (errInsert) {
          console.error('Error insertando usuario:', errInsert);
          return res.status(500).json({ error: 'Error interno' });
        }

        // Emitimos token
        const user = {
          id: this.lastID,
          email,
          display_name: display_name || null,
          avatar_url: null,
        };

        const token = jwt.sign(
          { id: user.id, email: user.email },
          JWT_SECRET,
          { expiresIn: JWT_EXPIRES_IN }
        );

        res.status(201).json({ user, token });
      });
    });
  });
});

// POST /auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
  }

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.get(sql, [email], (err, user) => {
    if (err) {
      console.error('Error buscando usuario:', err);
      return res.status(500).json({ error: 'Error interno' });
    }
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    bcrypt.compare(password, user.password_hash, (errCompare, ok) => {
      if (errCompare) {
        console.error('Error comparando contraseña:', errCompare);
        return res.status(500).json({ error: 'Error interno' });
      }
      if (!ok) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      const payload = { id: user.id, email: user.email, role: user.role || 'client' };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          display_name: user.display_name,
          avatar_url: user.avatar_url,
          role: user.role || 'client',
        },
      });
    });
  });
});

module.exports = router;
