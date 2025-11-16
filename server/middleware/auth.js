// server/middleware/auth.js
const jwt = require('jsonwebtoken');

// IMPORTANTE: esta clave DEBE ser EXACTAMENTE la misma que en routes/auth.js
const JWT_SECRET = 'supersecreto_relojes_2025';

function requireAuth(req, res, next) {
  // 1. Leemos la cabecera Authorization
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json({ error: 'Falta cabecera Authorization (Bearer token)' });
  }

  // 2. Esperamos algo como: "Bearer asdf1234..."
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Formato de token inválido' });
  }

  try {
    // 3. Verificamos el token
    const payload = jwt.verify(token, JWT_SECRET);
    // payload es lo que pusimos en el login: { id, email }

    // 4. Guardamos info del usuario en la request para usarla en las rutas
    req.user = payload; // req.user.id, req.user.email

    // 5. Pasamos al siguiente middleware / ruta
    next();
  } catch (err) {
    console.error('Error verificando JWT:', err.message);
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

module.exports = { requireAuth };
