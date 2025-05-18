/**
 * Utilitaire pour les modules assignés aux patients
 * Version mise à jour pour le nouveau schéma de base de données
 */

const { query } = require('../config/database');

// Fonction pour récupérer les modules assignés à un patient
const getAssignedModules = async (patientId) => {
  const sql = `
    SELECT mp.*, m.titre, m.description, c.nom as categorie_nom, 
           m.miniature, m.est_publie, m.est_gratuit, m.duree_estimee
    FROM module_patient mp 
    JOIN module m ON mp.module_id = m.id 
    LEFT JOIN categorie c ON m.categorie_id = c.id
    WHERE mp.patient_id = ?
    ORDER BY mp.date_assignation DESC
  `;
  return await query(sql, [patientId]);
};

// Fonction pour assigner un module à un patient
const assignModuleToPatient = async (moduleId, patientId) => {
  // Vérifier si le module est déjà assigné
  const checkSql = 'SELECT id FROM module_patient WHERE module_id = ? AND patient_id = ?';
  const existing = await query(checkSql, [moduleId, patientId]);
  
  if (existing && existing.length > 0) {
    return { success: false, message: 'Ce module est déjà assigné à cette patiente' };
  }
  
  // Assigner le module
  const sql = 'INSERT INTO module_patient (module_id, patient_id, date_assignation, progression) VALUES (?, ?, NOW(), 0)';
  await query(sql, [moduleId, patientId]);
  
  return { success: true, message: 'Module assigné avec succès' };
};

// Fonction pour mettre à jour la progression d'un patient sur un module
const updateModuleProgress = async (moduleId, patientId, progression) => {
  const sql = `
    UPDATE module_patient 
    SET progression = ?, derniere_activite = NOW() 
    WHERE module_id = ? AND patient_id = ?
  `;
  await query(sql, [progression, moduleId, patientId]);
  
  return { success: true, message: 'Progression mise à jour avec succès' };
};

// Fonction pour supprimer l'assignation d'un module
const unassignModule = async (moduleId, patientId) => {
  const sql = 'DELETE FROM module_patient WHERE module_id = ? AND patient_id = ?';
  await query(sql, [moduleId, patientId]);
  
  return { success: true, message: 'Module désassigné avec succès' };
};

// Fonction pour récupérer les patients assignés à un module
const getPatientsAssignedToModule = async (moduleId) => {
  const sql = `
    SELECT mp.*, u.nom, u.prenom, u.email, u.telephone, u.date_inscription
    FROM module_patient mp
    JOIN utilisateur u ON mp.patient_id = u.id
    WHERE mp.module_id = ?
    ORDER BY mp.progression DESC
  `;
  return await query(sql, [moduleId]);
};

// Fonction pour récupérer les statistiques d'un module
const getModuleStats = async (moduleId) => {
  const sql = `
    SELECT 
      COUNT(mp.id) as total_assigned,
      AVG(mp.progression) as avg_progression,
      SUM(CASE WHEN mp.progression = 100 THEN 1 ELSE 0 END) as completed_count
    FROM module_patient mp
    WHERE mp.module_id = ?
  `;
  const stats = await query(sql, [moduleId]);
  return stats[0];
};

module.exports = {
  getAssignedModules,
  assignModuleToPatient,
  updateModuleProgress,
  unassignModule,
  getPatientsAssignedToModule,
  getModuleStats
};
