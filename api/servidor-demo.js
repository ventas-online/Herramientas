// Esqueleto de servidor para la conexión real con IA.
// IMPORTANTE: este archivo NO contiene ninguna clave de API.
// La variable IA_API_KEY debe configurarse como secreto del servicio donde se despliegue.

import express from 'express';
import multer from 'multer';

const app = express();
const upload = multer({ limits: { fileSize: 8 * 1024 * 1024 } });

app.use(express.json());

app.get('/api/salud', (_req, res) => {
  res.json({ ok: true, servicio: 'Generador de Catálogos' });
});

app.post('/api/analizar-producto', upload.single('imagen'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No se recibió ninguna imagen.' });
  if (!process.env.IA_API_KEY) {
    return res.status(503).json({ error: 'El servicio de IA todavía no está configurado.' });
  }

  // Aquí se conectará el proveedor de IA.
  // La respuesta deberá normalizarse al formato definido en api/README.md.
  return res.status(501).json({
    error: 'Conector de IA pendiente de configuración.',
    archivo: req.file.originalname
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Servidor del Generador de Catálogos iniciado.');
});
