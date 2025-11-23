// index.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
app.set('trust proxy', 1);
require('dotenv').config();
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');

app.use(express.json());

const allowedOrigins = [
  'https://localhost:5173',
  'https://geolocalizaci-n-escolar.vercel.app'   
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No accesible'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use('/auth', authRoutes);
app.use('/events', eventRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en purto ${PORT}`);
});
