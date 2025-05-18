/**
 * Configuration de la connexion à la base de données MongoDB
 */

const mongoose = require('mongoose');
require('dotenv').config();

// URL de connexion à MongoDB (utilise la variable d'environnement ou une URL par défaut)
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/les-audacieuses';

// Options de configuration pour Mongoose
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Fonction pour établir la connexion à MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, options);
    console.log('Connexion à MongoDB établie avec succès');
  } catch (err) {
    console.error('Erreur de connexion à MongoDB:', err.message);
    // En cas d'erreur grave, ferme l'application
    process.exit(1);
  }
};

// Événements de connexion Mongoose
mongoose.connection.on('connected', () => {
  console.log('Mongoose connecté à', mongoURI);
});

mongoose.connection.on('error', (err) => {
  console.error('Erreur de connexion Mongoose:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose déconnecté');
});

// Gestion de la fermeture propre de la connexion
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Connexion à MongoDB fermée suite à l\'arrêt de l\'application');
  process.exit(0);
});

module.exports = connectDB;
