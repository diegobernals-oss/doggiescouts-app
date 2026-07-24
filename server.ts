import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Configuración del pool de MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'u787443602_admin',
  password: process.env.DB_PASSWORD || 'Doggiescouts2026',
  database: process.env.DB_NAME || 'u787443602_doggiescouts',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Inicialización de Google Gen AI
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Endpoint POST para guardar tickets
app.post('/api/tickets', async (req, res) => {
  try {
    const {
      id, code, ownerName, email, ownerPhone, dogName, 
      dogBreed, dogSize, serviceId, serviceName, date, 
      timeSlot, createdAt, status, vaccinesUpToDate, 
      allergies, vetContact, feedingHabits
    } = req.body;

    const query = `
      INSERT INTO vip_tickets (
        id, code, ownerName, email, ownerPhone, dogName, 
        dogBreed, dogSize, serviceId, serviceName, date, 
        timeSlot, createdAt, status, vaccinesUpToDate, 
        allergies, vetContact, feedingHabits
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await pool.execute(query, [
      id, code, ownerName, email, ownerPhone, dogName, 
      dogBreed, dogSize, serviceId, serviceName, date, 
      timeSlot, createdAt, status, vaccinesUpToDate, 
      allergies, vetContact, feedingHabits
    ]);

    res.json({ success: true, message: 'Ticket guardado exitosamente' });
  } catch (error: any) {
    console.error('Error guardando ticket:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint GET para obtener tickets
app.get('/api/tickets', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM vip_tickets');
    res.json(rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Inicio del servidor
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom'
    });
    app.use(vite.middlewares);
  } else {
    // Apuntar directamente al directorio actual en producción donde se empaqueta dist
    app.use(express.static(__dirname));

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
}

startServer();
