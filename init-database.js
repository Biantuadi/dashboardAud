/**
 * Script pour initialiser complètement la base de données
 * Ce script va supprimer toutes les tables existantes et recréer la structure complète
 */

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuration de la base de données
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true // Important pour exécuter plusieurs requêtes en une fois
};

async function initDatabase() {
  let connection;
  
  try {
    console.log('Connexion à la base de données...');
    connection = await mysql.createConnection(dbConfig);
    
    // Lecture du fichier SQL
    console.log('Lecture du fichier SQL...');
    const sqlFilePath = path.join(__dirname, 'sql', 'database_complete.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Exécution du script SQL complet
    console.log('Exécution du script SQL...');
    const [results] = await connection.query(sqlContent);
    
    console.log('Initialisation de la base de données terminée avec succès !');
    console.log('Résumé:');
    console.log('- 1 compte psychologue créé (admin@lesaudacieuses.fr / admin123)');
    console.log('- 3 catégories de modules créées');
    console.log('- 3 modules créés avec leur contenu');
    console.log('- 2 utilisatrices de test créées');
    console.log('- Modules assignés aux utilisatrices');
    console.log('- 2 rendez-vous de test créés');
    
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Connexion à la base de données fermée.');
    }
  }
}

// Avertissement avant l'exécution
console.log('\x1b[31m%s\x1b[0m', '!!! ATTENTION !!!');
console.log('\x1b[33m%s\x1b[0m', 'Ce script va supprimer toutes les tables existantes et recréer la structure complète.');
console.log('\x1b[33m%s\x1b[0m', 'Toutes les données actuelles seront perdues.');
console.log('\x1b[33m%s\x1b[0m', 'Appuyez sur Ctrl+C pour annuler ou attendez 5 secondes pour continuer...');

// Attendre 5 secondes avant de poursuivre
setTimeout(() => {
  console.log('Initialisation de la base de données...');
  initDatabase();
}, 5000);
