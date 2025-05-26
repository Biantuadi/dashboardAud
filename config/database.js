/**
 * Configuration de la connexion à la base de données MySQL
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuration de la connexion MySQL
const dbConfig = {
  host: process.env.DB_HOST || 'mysql-beni.alwaysdata.net',
  user: process.env.DB_USER || 'beni',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'beni_mds_e-commerce',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 60000, // 60 secondes
  acquireTimeout: 60000, // 60 secondes
  timeout: 60000, // 60 secondes
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000, // 10 secondes
  namedPlaceholders: true
};

// Création du pool de connexions
const pool = mysql.createPool(dbConfig);

// Fonction de connexion avec retry
const connectDB = async (retries = 5, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Tentative de connexion à MySQL (${i + 1}/${retries})...`);
      console.log(`Base de données: ${dbConfig.database}`);
      console.log(`Host: ${dbConfig.host}`);
      
      const connection = await pool.getConnection();
      console.log('Connexion MySQL établie avec succès!');
      connection.release();
      return true;
    } catch (error) {
      console.error(`Erreur de connexion à MySQL (tentative ${i + 1}/${retries}):`, error.message);
      
      if (i === retries - 1) {
        console.error('Nombre maximum de tentatives atteint. Impossible de se connecter à la base de données.');
        if (process.env.NODE_ENV === 'production') {
          console.error('En production, on continue malgré l\'erreur de connexion');
          return false;
        } else {
          throw error;
        }
      }
      
      console.log(`Nouvelle tentative dans ${delay/1000} secondes...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Gestion des erreurs de connexion
pool.on('error', (err) => {
  console.error('Erreur inattendue sur la connexion MySQL:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('Tentative de reconnexion...');
    connectDB();
  }
});

// Fonction pour exécuter une requête SQL
const query = async (sql, params) => {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Erreur d\'exécution de la requête SQL:', error.message);
    throw error;
  }
};

// Gestion de la fermeture propre de la connexion
process.on('SIGINT', async () => {
  try {
    await pool.end();
    console.log('Connexion à MySQL fermée suite à l\'arrêt de l\'application');
    process.exit(0);
  } catch (err) {
    console.error('Erreur lors de la fermeture de la connexion MySQL:', err.message);
    process.exit(1);
  }
});

module.exports = {
  connectDB,
  query,
  pool
};
