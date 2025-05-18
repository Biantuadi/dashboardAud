/**
 * Script pour initialiser la table des modules avec la structure actuelle
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
  queueLimit: 0
};

async function initActualModules() {
  let connection;
  
  try {
    console.log('Connexion à la base de données...');
    connection = await mysql.createConnection(dbConfig);
    
    // Lecture du fichier SQL
    console.log('Lecture du fichier SQL...');
    const sqlFilePath = path.join(__dirname, 'sql', 'init_modules_actual_structure.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Diviser le fichier en requêtes individuelles
    const queries = sqlContent
      .split(';')
      .filter(query => query.trim() !== '')
      .map(query => query.trim() + ';');
    
    console.log(`${queries.length} requêtes SQL trouvées.`);
    
    // Exécuter chaque requête
    for (let i = 0; i < queries.length; i++) {
      const query = queries[i];
      console.log(`Exécution de la requête ${i + 1}/${queries.length}...`);
      try {
        await connection.query(query);
        console.log(`Requête ${i + 1} exécutée avec succès.`);
      } catch (error) {
        console.error(`Erreur lors de l'exécution de la requête ${i + 1}:`, error.message);
        console.log('Requête problématique:', query);
      }
    }
    
    console.log('Initialisation des modules terminée avec succès!');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation des modules:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Connexion à la base de données fermée.');
    }
  }
}

// Exécuter le script
initActualModules();
