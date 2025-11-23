// routes/events.js
const express = require('express');
const db = require('../config/db');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware de autenticación (puedes reutilizar el que ya tienes en auth.js)
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Permiso denegado' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido o expirado' });
    req.user = user;
    next();
  });
}

// 📌 Crear evento
router.post('/', authenticateToken, async (req, res) => {
  const { latitude, longitude, title, description, codigo } = req.body;

  try {
    await db.collection('events').doc(codigo).set({
      latitude,
      longitude,
      title,
      description,
      codigo,
      createdBy: req.user.email,
      createdAt: new Date().toISOString()
    });

    res.json({ message: 'Evento creado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al crear evento' });
  }
});

// 📌 Leer todos los eventos
router.get('/', authenticateToken, async (req, res) => {
  try {
    const snapshot = await db.collection('events').get();
    const events = snapshot.docs.map(doc => doc.data());
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener eventos' });
  }
});

// 📌 Leer un evento por código
router.get('/:codigo', authenticateToken, async (req, res) => {
  try {
    const doc = await db.collection('events').doc(req.params.codigo).get();
    if (!doc.exists) return res.status(404).json({ error: 'Evento no encontrado' });
    res.json(doc.data());
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener evento' });
  }
});

// 📌 Actualizar evento
router.put('/:codigo', authenticateToken, async (req, res) => {
  try {
    await db.collection('events').doc(req.params.codigo).update(req.body);
    res.json({ message: 'Evento actualizado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar evento' });
  }
});

// 📌 Eliminar evento
router.delete('/:codigo', authenticateToken, async (req, res) => {
  try {
    await db.collection('events').doc(req.params.codigo).delete();
    res.json({ message: 'Evento eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar evento' });
  }
});

module.exports = router;
