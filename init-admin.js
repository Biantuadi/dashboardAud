/**
 * Script d'initialisation pour créer le premier utilisateur administrateur
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');
const connectDB = require('./config/database');

// Fonction principale
const initializeAdmin = async () => {
  try {
    // Connexion à la base de données
    await connectDB();
    
    // Vérifier si un utilisateur administrateur existe déjà
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (adminExists) {
      console.log('Un administrateur existe déjà dans la base de données.');
      process.exit(0);
    }
    
    // Créer un nouvel utilisateur administrateur
    const adminUser = new User({
      firstname: 'Admin',
      lastname: 'Audacieuse',
      email: process.env.ADMIN_EMAIL || 'admin@lesaudacieuses.fr',
      password: 'admin123', // À changer en production !
      role: 'admin'
    });
    
    await adminUser.save();
    
    console.log('Utilisateur administrateur créé avec succès !');
    console.log('Email:', adminUser.email);
    console.log('Mot de passe: admin123 (à changer après la première connexion)');
    
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de l\'initialisation:', error);
    process.exit(1);
  }
};

// Exécution
initializeAdmin();
