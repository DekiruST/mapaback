// config/db.js
const admin = require('firebase-admin');

// Descarga tu archivo de credenciales desde Firebase Console
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = db;
