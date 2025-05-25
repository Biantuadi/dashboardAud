/**
 * Configuration de la connexion à la base de données MySQL
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

// Correction du nom de la base en cas d’erreur de variable d’environnement
const dbName = (process.env.DB_NAME && process.env.DB_NAME.toLowerCase() !== 'beni_mds_e-commerce')
  ? 'audacieuses'
  : (process.env.DB_NAME || 'beni_mds_e-commerce');

// Configuration de la connexion MySQL
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'admin',
  database: dbName,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Afficher la config pour débogage
console.log(`Connexion MySQL sur base : ${dbConfig.database}`);

// Pool de connexions MySQL
const pool = mysql.createPool(dbConfig);

// Fonction pour établir la connexion à MySQL
const connectDB = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Connexion à MySQL établie avec succès');
    connection.release();
    return pool;
  } catch (err) {
    console.error('Erreur de connexion à MySQL:', err.message);
    // En cas d'erreur grave, ferme l'application
    process.exit(1);
  }
};

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
