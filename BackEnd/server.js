// server.js
// Punto de entrada del servidor TECSOMAC
// Inicializa Express, Socket.IO y las rutas de la API REST

const express    = require('express');
const http       = require('http');
const { Server } = require('socket.io');
const cors       = require('cors');
require('dotenv').config();

console.log('JWT_SECRET:', process.env.JWT_SECRET);

const { verificarConexion }   = require('./config/database');
const { inicializarSocket }   = require('./config/socket');
const authRoutes              = require('./routes/authRoutes');
const usuarioRoutes           = require('./routes/usuarioRoutes');
const maquinaRoutes           = require('./routes/maquinaRoutes');
const registroRoutes          = require('./routes/registroRoutes');

// ── Configuración de Express ───────────────────────────────────────────────
const app    = express();
const server = http.createServer(app);
const io     = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

// Hacer disponible la instancia de io en los controladores
app.set('io', io);

// ── Middlewares globales ───────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Rutas API REST ─────────────────────────────────────────────────────────
app.use('/api/auth',      authRoutes);
app.use('/api/usuarios',  usuarioRoutes);
app.use('/api/maquinas',  maquinaRoutes);
app.use('/api/registros', registroRoutes);

// Ruta de salud del servidor
app.get('/api/health', (req, res) => {
  res.status(200).json({ estado: 'TECSOMAC backend activo', timestamp: new Date() });
});

// ── Socket.IO ──────────────────────────────────────────────────────────────
inicializarSocket(io);

// ── Inicio del servidor ────────────────────────────────────────────────────
const PUERTO = process.env.PORT || 3000;

async function iniciarServidor() {
  await verificarConexion();
  server.listen(PUERTO, () => {
    console.log(`🚀 Servidor TECSOMAC corriendo en http://localhost:${PUERTO}`);
    console.log(`📡 Socket.IO listo para conexiones de clientes C#`);
  });
}

iniciarServidor();
