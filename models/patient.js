/**
 * Modèle de données pour les patientes (utilisatrices)
 * Utilise la table 'utilisateur' dans MySQL
 */

const { query } = require('../config/database');

// Fonction pour récupérer tous les patients avec le nombre de modules suivis
const findAll = async () => {
  const sql = `
    SELECT u.*,                              
           u.image_profil AS photo,         -- alias image_profil to photo
           COUNT(mp.module_id) AS assignedModules,
           COALESCE(SUM(CASE WHEN mp.progression = 100 THEN 1 ELSE 0 END), 0) AS completedModules,
           GROUP_CONCAT(m.titre ORDER BY mp.date_assignation DESC SEPARATOR ', ') AS modules_suivis
    FROM utilisateur u
    LEFT JOIN module_patient mp ON mp.patient_id = u.id
    LEFT JOIN module m ON m.id = mp.module_id
    GROUP BY u.id
    ORDER BY u.date_inscription DESC
  `;
  return await query(sql);
};

// Fonction pour récupérer un patient par ID
const findById = async (id) => {
  const sql = `
    SELECT u.*,                              
           u.image_profil AS photo          -- alias image_profil to photo
    FROM utilisateur u WHERE u.id = ?
  `;
  const patients = await query(sql, [id]);
  return patients[0];
};

// Fonction pour récupérer un patient par email
const findByEmail = async (email) => {
  const sql = `
    SELECT u.*,                              
           u.image_profil AS photo          -- alias image_profil to photo
    FROM utilisateur u WHERE u.email = ?
  `;
  const patients = await query(sql, [email]);
  return patients[0];
};

// Fonction pour créer un nouveau patient
const create = async (patientData) => {
  const { nom, prenom, email, telephone, mot_de_passe, emploi_actuel, emploi_vise, competences, experience, notes, photo } = patientData;
  const sql = `
    INSERT INTO utilisateur 
    (nom, prenom, email, telephone, mot_de_passe, emploi_actuel, emploi_vise, competences, experience, notes, image_profil)  -- use image_profil column
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const result = await query(sql, [
    nom,
    prenom,
    email,
    telephone,
    mot_de_passe,
    emploi_actuel || null,
    emploi_vise || null,
    competences || null,
    experience || null,
    notes || null,
    photo || '/images/photo-defaut'
  ]);
  return { id: result.insertId, ...patientData };
};

// Fonction pour mettre à jour un patient
const update = async (id, patientData) => {
  const { nom, prenom, email, telephone, emploi_actuel, emploi_vise, competences, experience, notes, photo } = patientData;
  const sql = `
    UPDATE utilisateur 
    SET nom = ?, prenom = ?, email = ?, telephone = ?, 
        emploi_actuel = ?, emploi_vise = ?, competences = ?, 
        experience = ?, notes = ?, image_profil = ?    -- use image_profil column
    WHERE id = ?
  `;
  await query(sql, [
    nom,
    prenom,
    email,
    telephone,
    emploi_actuel || null,
    emploi_vise || null,
    competences || null,
    experience || null,
    notes || null,
    photo || '/images/photo-defaut',
    id
  ]);
  return findById(id);
};

// Fonction pour supprimer un patient
const remove = async (id) => {
  const sql = 'DELETE FROM utilisateur WHERE id = ?';
  return await query(sql, [id]);
};

// Fonctions utilitaires pour compatibilité avec l'ancienne API
const getFullName = (patient) => {
  return `${patient.prenom} ${patient.nom}`;
};

// Fonction pour récupérer les rendez-vous à venir d'un patient
const getUpcomingAppointments = async (patientId) => {
  const sql = `
    SELECT rv.*, p.nom as psychologue_nom, p.prenom as psychologue_prenom
    FROM rendez_vous rv
    JOIN psychologue p ON rv.psychologue_id = p.id
    WHERE rv.patient_id = ? 
    AND rv.date_heure > NOW()
    AND rv.statut IN ('planifié', 'confirmé')
    ORDER BY rv.date_heure ASC
  `;
  return await query(sql, [patientId]);
};

module.exports = {
  findAll,
  findById,
  findByEmail,
  create,
  update,
  remove,
  getFullName,
  getUpcomingAppointments
};
