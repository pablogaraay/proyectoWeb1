// server/index.js
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const path = require('path');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const adminRouter = require('./routes/admin');
const productsRouter = require('./routes/products');
const favoritesRouter = require('./routes/favorites');
const setupChatHandlers = require('./socket/chatHandler');

const app = express();
const PORT = 3000;

// Crear servidor HTTP para Socket.IO
const server = http.createServer(app);

// Configurar Socket.IO
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Inicializar manejadores de chat
setupChatHandlers(io);

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Servir archivos estáticos (imágenes subidas)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas nuevas
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/admin', adminRouter);
app.use('/api/products', productsRouter);
app.use('/api/favorites', favoritesRouter);

// Manejo básico de errores
app.use((err, req, res, next) => {
  console.error('Error inesperado:', err);
  res.status(500).json({ error: 'Error inesperado en el servidor' });
});

server.listen(PORT, () => {
  console.log(`✅ Backend escuchando en http://localhost:${PORT}`);
  console.log(`🔌 Socket.IO habilitado para chat de soporte`);
});
