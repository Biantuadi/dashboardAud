/**
 * Modèle pour les psychologues avec MySQL
 */

const { query } = require('../config/database');
const bcrypt = require('bcrypt');

// Fonction pour trouver un psychologue par email
const findByEmail = async (email) => {
  const sql = 'SELECT * FROM psychologue WHERE email = ?';
  const psychologues = await query(sql, [email]);
  return psychologues[0]; // Retourne le premier résultat ou undefined
};

// Fonction pour vérifier les identifiants
const verifyCredentials = async (email, password) => {
  console.log(`Tentative de connexion avec email: ${email}`);
  const psychologue = await findByEmail(email);
  
  if (!psychologue) {
    console.log('Aucun psychologue trouvé avec cet email');
    return null;
  }
  
  console.log('Psychologue trouvé:', psychologue);
  console.log(`Comparaison des mots de passe: fourni="${password}", stocké="${psychologue.mot_de_passe}"`);
  
  // Comparer le mot de passe en texte brut (à remplacer par bcrypt si les mots de passe sont hashés)
  if (psychologue.mot_de_passe === password) {
    console.log('Authentification réussie!');
    return psychologue;
  }
  
  console.log('Mot de passe incorrect');
  return null;
};

// Fonction pour récupérer tous les psychologues
const findAll = async () => {
  const sql = 'SELECT * FROM psychologue';
  return await query(sql);
};

// Fonction pour récupérer un psychologue par ID
const findById = async (id) => {
  const sql = 'SELECT * FROM psychologue WHERE id = ?';
  const psychologues = await query(sql, [id]);
  return psychologues[0];
};

// Fonction pour créer un psychologue
const create = async (psychologueData) => {
  const { nom, prenom, email, mot_de_passe, telephone } = psychologueData;
  
  const sql = 'INSERT INTO psychologue (nom, prenom, email, mot_de_passe, telephone) VALUES (?, ?, ?, ?, ?)';
  const result = await query(sql, [nom, prenom, email, mot_de_passe, telephone]);
  
  return {
    id: result.insertId,
    ...psychologueData
  };
};

// Fonction pour mettre à jour un psychologue
const update = async (id, psychologueData) => {
  const { nom, prenom, email, telephone } = psychologueData;
  
  const sql = 'UPDATE psychologue SET nom = ?, prenom = ?, email = ?, telephone = ? WHERE id = ?';
  await query(sql, [nom, prenom, email, telephone, id]);
  
  return findById(id);
};

// Fonction pour supprimer un psychologue
const remove = async (id) => {
  const sql = 'DELETE FROM psychologue WHERE id = ?';
  return await query(sql, [id]);
};

module.exports = {
  findByEmail,
  verifyCredentials,
  findAll,
  findById,
  create,
  update,
  remove
};
