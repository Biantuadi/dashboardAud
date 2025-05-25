/**
 * Contrôleur pour les patientes
 */

// Utilisation du modèle patient avec MySQL
const Patient = require('../models/patient');

// Utilisation du module pour les assignations de modules
const ModuleAssignment = require('../models/moduleAssignment');

// Utilisation du modèle module
const Module = require('../models/module_mysql');

// Accès direct à la base de données pour certaines opérations
const { query } = require('../config/database');

// Afficher la liste des patientes
exports.getPatients = async (req, res) => {
  try {
    const patients = await Patient.findAll();
    
    res.render('patients/list', {
      title: 'Liste des patientes',
      active: 'patients',
      patients
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des patientes:', error);
    res.status(500).render('error', {
      title: 'Erreur',
      message: 'Une erreur est survenue lors de la récupération des patientes',
      error
    });
  }
};

// Afficher le formulaire d'ajout de patiente
exports.getAddPatientForm = async (req, res) => {
  const allModules = await Module.findAll();
  res.render('patients/add', {
      title: 'Ajouter une patiente',
      active: 'patients',
      patient: {},
      allModules
  });
};

// Afficher le formulaire de modification d'une patiente
exports.getEditPatientForm = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    
    if (!patient) {
      return res.status(404).render('error', {
        title: 'Patiente non trouvée',
        message: 'La patiente demandée n\'existe pas',
        error: { status: 404 }
      });
    }
    const allModules = await Module.findAll();
    const assigned = await ModuleAssignment.getAssignedModules(patient.id);
    const assignedModuleIds = assigned.map(m => m.module_id);
    res.render('patients/edit', {
      title: 'Modifier la patiente',
      active: 'patients',
      patient,
      allModules,
      assignedModuleIds
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la patiente à modifier:', error);
    res.status(500).render('error', {
      title: 'Erreur',
      message: 'Une erreur est survenue lors de la récupération de la patiente à modifier',
      error
    });
  }
};

// Ajouter une nouvelle patiente
exports.addPatient = async (req, res) => {
  try {
    const { 
      nom, prenom, email, telephone, mot_de_passe, 
      emploi_actuel, emploi_vise, competences, experience, notes 
    } = req.body;
    
    // Utiliser l'image en base64
    const photo = req.file ? req.file.base64 : '/images/photo-defaut';
    
    // Créer la nouvelle patiente dans la base de données
    const newPatient = await Patient.create({
      nom,
      prenom,
      email,
      telephone,
      mot_de_passe,
      emploi_actuel,
      emploi_vise,
      competences,
      experience,
      notes,
      photo
    });
    // Gérer l'assignation des modules sélectionnés
    if (req.body.modules) {
      const moduleIds = Array.isArray(req.body.modules) ? req.body.modules : [req.body.modules];
      for (const moduleId of moduleIds) {
        await ModuleAssignment.assignModuleToPatient(moduleId, newPatient.id);
      }
    }
    res.redirect('/patients');
  } catch (error) {
    console.error('Erreur lors de la création de la patiente:', error);
    res.status(500).render('error', {
      title: 'Erreur',
      message: 'Une erreur est survenue lors de la création de la patiente',
      error
    });
  }
};

// Afficher les détails d'une patiente
exports.getPatientDetails = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    
    if (!patient) {
      return res.status(404).render('error', {
        title: 'Patiente non trouvée',
        message: 'La patiente demandée n\'existe pas',
        error: { status: 404 }
      });
    }
    
    // Récupérer les modules assignés à cette patiente
    const assignedModules = await ModuleAssignment.getAssignedModules(patient.id);
    
    // Récupérer tous les modules pour le select d'assignation
    const allModules = await Module.findAll();
    
    // Récupérer les rendez-vous à venir
    const upcomingAppointments = await Patient.getUpcomingAppointments(patient.id);
    
    res.render('patients/details', {
      title: 'Détails de la patiente',
      active: 'patients',
      patient,
      assignedModules,
      allModules,
      appointments: upcomingAppointments
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des détails de la patiente:', error);
    res.status(500).render('error', {
      title: 'Erreur',
      message: 'Une erreur est survenue lors de la récupération des détails de la patiente',
      error
    });
  }
};

// Mettre à jour une patiente
exports.updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    // Récupérer l'ancienne photo pour fallback
    const existing = await Patient.findById(id);
    const { 
      nom, prenom, email, telephone, 
      emploi_actuel, emploi_vise, competences, experience, notes 
    } = req.body;
    
    // Utiliser l'image en base64
    const photo = req.file ? req.file.base64 : existing.photo;
    
    // Mettre à jour la patiente dans la base de données
    await Patient.update(id, {
      nom,
      prenom,
      email,
      telephone,
      emploi_actuel,
      emploi_vise,
      competences,
      experience,
      notes,
      photo
    });
    // Mettre à jour les assignations de modules
    // Supprimer les anciennes
    await query('DELETE FROM module_patient WHERE patient_id = ?', [id]);
    // Réassigner
    if (req.body.modules) {
      const moduleIds = Array.isArray(req.body.modules) ? req.body.modules : [req.body.modules];
      for (const moduleId of moduleIds) {
        await ModuleAssignment.assignModuleToPatient(moduleId, id);
      }
    }
    res.redirect(`/patients/${id}`);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la patiente:', error);
    res.status(500).render('error', {
      title: 'Erreur',
      message: 'Une erreur est survenue lors de la mise à jour de la patiente',
      error
    });
  }
};

// Assigner un module à une patiente
exports.assignModule = async (req, res) => {
  try {
    const { id } = req.params;
    const { module_id } = req.body;
    
    if (!module_id) {
      return res.status(400).json({ 
        success: false, 
        message: 'ID de module manquant' 
      });
    }
    
    // Assigner le module à la patiente
    const result = await ModuleAssignment.assignModuleToPatient(module_id, id);
    
    if (req.xhr) {
      // Si c'est une requête AJAX, renvoyer une réponse JSON
      return res.json(result);
    }
    
    // Sinon, rediriger vers la page des détails de la patiente
    res.redirect(`/patients/${id}`);
  } catch (error) {
    console.error('Erreur lors de l\'assignation du module:', error);
    
    if (req.xhr) {
      return res.status(500).json({ 
        success: false, 
        message: 'Une erreur est survenue lors de l\'assignation du module' 
      });
    }
    
    res.status(500).render('error', {
      title: 'Erreur',
      message: 'Une erreur est survenue lors de l\'assignation du module',
      error
    });
  }
};

// Supprimer une patiente
exports.deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Supprimer la patiente de la base de données
    await Patient.remove(id);
    
    res.redirect('/patients');
  } catch (error) {
    console.error('Erreur lors de la suppression de la patiente:', error);
    res.status(500).render('error', {
      title: 'Erreur',
      message: 'Une erreur est survenue lors de la suppression de la patiente',
      error
    });
  }
};

// Créer un nouveau rendez-vous
exports.createAppointment = async (req, res) => {
  try {
    const { id } = req.params; // ID de la patiente
    const { psychologue_id, date_heure, duree, type, notes } = req.body;
    
    // Vérifier que les données requises sont présentes
    if (!psychologue_id || !date_heure) {
      return res.status(400).json({
        success: false,
        message: 'Psychologue et date/heure sont requis'
      });
    }
    
    // Insérer le rendez-vous dans la base de données
    const sql = `
      INSERT INTO rendez_vous 
      (patient_id, psychologue_id, date_heure, duree, type, notes, statut) 
      VALUES (?, ?, ?, ?, ?, ?, 'planifié')
    `;
    
    await query(sql, [
      id, 
      psychologue_id, 
      date_heure, 
      duree || 60, 
      type || 'présentiel', 
      notes || null
    ]);
    
    if (req.xhr) {
      return res.json({
        success: true,
        message: 'Rendez-vous créé avec succès'
      });
    }
    
    res.redirect(`/patients/${id}`);
  } catch (error) {
    console.error('Erreur lors de la création du rendez-vous:', error);
    
    if (req.xhr) {
      return res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la création du rendez-vous'
      });
    }
    
    res.status(500).render('error', {
      title: 'Erreur',
      message: 'Une erreur est survenue lors de la création du rendez-vous',
      error
    });
  }
};

// Mettre à jour le statut d'un rendez-vous
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id, appointmentId } = req.params;
    const { status } = req.body;
    
    // Vérifier que le statut est valide
    const validStatuses = ['planifié', 'confirmé', 'annulé', 'terminé'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Statut invalide'
      });
    }
    
    // Mettre à jour le statut du rendez-vous
    const sql = 'UPDATE rendez_vous SET statut = ? WHERE id = ? AND patient_id = ?';
    await query(sql, [status, appointmentId, id]);
    
    if (req.xhr) {
      return res.json({
        success: true,
        message: 'Statut du rendez-vous mis à jour avec succès'
      });
    }
    
    res.redirect(`/patients/${id}`);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut du rendez-vous:', error);
    
    if (req.xhr) {
      return res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la mise à jour du statut du rendez-vous'
      });
    }
    
    res.status(500).render('error', {
      title: 'Erreur',
      message: 'Une erreur est survenue lors de la mise à jour du statut du rendez-vous',
      error
    });
  }
};
