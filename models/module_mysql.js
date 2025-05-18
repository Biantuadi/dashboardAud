/**
 * Modèle pour les modules avec MySQL
 * Structure mise à jour pour correspondre au nouveau schéma de base de données
 */

const { query } = require('../config/database');

// Fonction pour récupérer tous les modules
const findAll = async () => {
  const sql = `
    SELECT m.*, p.prenom as createur_prenom, p.nom as createur_nom
    FROM module m 
    LEFT JOIN psychologue p ON m.cree_par = p.id
    ORDER BY m.date_creation DESC
  `;
  return await query(sql);
};

// Fonction pour récupérer un module par ID
const findById = async (id) => {
  const sql = `
    SELECT m.*, p.prenom as createur_prenom, p.nom as createur_nom
    FROM module m 
    LEFT JOIN psychologue p ON m.cree_par = p.id
    WHERE m.id = ?
  `;
  const modules = await query(sql, [id]);
  return modules[0];
};

// Fonction pour récupérer les modules publiés
const findPublished = async () => {
  const sql = `
    SELECT m.*, p.prenom as createur_prenom, p.nom as createur_nom
    FROM module m 
    LEFT JOIN psychologue p ON m.cree_par = p.id
    WHERE m.est_publie = 1
    ORDER BY m.date_creation DESC
  `;
  return await query(sql);
};

// Fonction pour récupérer les modules gratuits
const findFree = async () => {
  const sql = `
    SELECT m.*, p.prenom as createur_prenom, p.nom as createur_nom
    FROM module m 
    LEFT JOIN psychologue p ON m.cree_par = p.id
    WHERE m.est_gratuit = 1
    ORDER BY m.date_creation DESC
  `;
  return await query(sql);
};

// Fonction pour créer un module
const create = async (moduleData) => {
  const { titre, description, miniature, est_publie, est_gratuit, duree_estimee, cree_par } = moduleData;
  const sql = `
    INSERT INTO module 
    (titre, description, miniature, est_publie, est_gratuit, duree_estimee, cree_par) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const result = await query(sql, [
    titre,
    description,
    miniature || '/images/default-module.png',
    est_publie ? 1 : 0,
    est_gratuit ? 1 : 0,
    duree_estimee || 0,
    cree_par
  ]);
   
   return {
     id: result.insertId,
     ...moduleData
   };
};

// Fonction pour mettre à jour un module
const update = async (id, moduleData) => {
  const { titre, description, miniature, est_publie, est_gratuit, duree_estimee } = moduleData;
  const sql = `
    UPDATE module 
    SET titre = ?, description = ?, miniature = ?, 
        est_publie = ?, est_gratuit = ?, duree_estimee = ?
    WHERE id = ?
  `;
  await query(sql, [
    titre,
    description,
    miniature || '/images/default-module.png',
    est_publie ? 1 : 0,
    est_gratuit ? 1 : 0,
    duree_estimee || 0,
    id
  ]);
   
   return findById(id);
};

// Fonction pour supprimer un module
const remove = async (id) => {
  const sql = 'DELETE FROM module WHERE id = ?';
  return await query(sql, [id]);
};

// Fonctions pour récupérer le contenu d'un module
const getModuleContent = async (moduleId) => {
  const sql = `
    SELECT cb.*, b.type
    FROM contenu_bloc cb
    JOIN bloc b ON cb.bloc_id = b.id
    WHERE cb.module_id = ?
    ORDER BY cb.ordre ASC
  `;
  return await query(sql, [moduleId]);
};

// Fonction pour ajouter un bloc de contenu à un module
const addContentBlock = async (moduleId, blockData) => {
  const { bloc_id, contenu, url_ressource, ordre, metadata } = blockData;
  
  const sql = `
    INSERT INTO contenu_bloc 
    (module_id, bloc_id, contenu, url_ressource, ordre, metadata) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  
  const result = await query(sql, [
    moduleId, 
    bloc_id, 
    contenu, 
    url_ressource || null, 
    ordre, 
    metadata ? JSON.stringify(metadata) : null
  ]);
  
  return {
    id: result.insertId,
    module_id: moduleId,
    ...blockData
  };
};

// Fonction pour mettre à jour un bloc de contenu
const updateContentBlock = async (blockId, blockData) => {
  const { contenu, url_ressource, ordre, metadata } = blockData;
  
  const sql = `
    UPDATE contenu_bloc 
    SET contenu = ?, url_ressource = ?, ordre = ?, metadata = ?
    WHERE id = ?
  `;
  
  await query(sql, [
    contenu, 
    url_ressource || null, 
    ordre, 
    metadata ? JSON.stringify(metadata) : null, 
    blockId
  ]);
  
  return {
    id: blockId,
    ...blockData
  };
};

// Fonction pour supprimer un bloc de contenu
const removeContentBlock = async (blockId) => {
  const sql = 'DELETE FROM contenu_bloc WHERE id = ?';
  return await query(sql, [blockId]);
};

// Fonction pour récupérer tous les types de blocs disponibles
const getBlockTypes = async () => {
  const sql = 'SELECT * FROM bloc';
  return await query(sql);
};

module.exports = {
  findAll,
  findById,
  findPublished,
  findFree,
  create,
  update,
  remove,
  getModuleContent,
  addContentBlock,
  updateContentBlock,
  removeContentBlock,
  getBlockTypes
};
