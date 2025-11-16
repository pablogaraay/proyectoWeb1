// server/index.js
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'supersecreto-para-el-proyecto'; // para práctica vale

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// ========================
// Validaciones servidor
// ========================

function validarEmail(email) {
  return typeof email === 'string' && email.includes('@') && email.length <= 100;
}

function validarPassword(pass) {
  return typeof pass === 'string' && pass.length >= 6 && pass.length <= 100;
}

// ========================
// Rutas de autenticación
// ========================

// POST /api/auth/register
app.post('/api/auth/register', (req, res) => {
  const { email, password } = req.body;

  // Validación en servidor
  if (!validarEmail(email) || !validarPassword(password)) {
    return res.status(400).json({ error: 'Datos inválidos' });
  }

  const passwordHash = bcrypt.hashSync(password, 10);

  const sql = 'INSERT INTO users (email, password_hash) VALUES (?, ?)';
  db.run(sql, [email, passwordHash], function (err) {
    if (err) {
      if (err.message.includes('UNIQUE')) {
        return res.status(409).json({ error: 'El email ya está registrado' });
      }
      console.error(err);
      return res.status(500).json({ error: 'Error al crear el usuario' });
    }

    // Generar token de sesión
    const token = jwt.sign({ id: this.lastID, email }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({
      message: 'Usuario registrado correctamente',
      token,
      user: { id: this.lastID, email },
    });
  });
});

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!validarEmail(email) || !validarPassword(password)) {
    return res.status(400).json({ error: 'Datos inválidos' });
  }

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.get(sql, [email], (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    if (!user) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const ok = bcrypt.compareSync(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login correcto',
      token,
      user: { id: user.id, email: user.email },
    });
  });
});

// Middleware para proteger rutas privadas
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

// Ejemplo de ruta protegida (para tu /account, por ejemplo)
app.get('/api/profile', authMiddleware, (req, res) => {
  res.json({
    id: req.user.id,
    email: req.user.email,
  });
});

// Manejo básico de errores (para requisito de “capturar excepciones”)
app.use((err, req, res, next) => {
  console.error('Error inesperado:', err);
  res.status(500).json({ error: 'Error inesperado en el servidor' });
});

app.listen(PORT, () => {
  console.log(`✅ Backend escuchando en http://localhost:${PORT}`);
});
