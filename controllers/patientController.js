/**
 * Contrôleur pour les patientes
 */

// Utilisation des données mockées au lieu de MongoDB
const { 
  getAllPatients, 
  getPatientById,
  getAllModules,
  getModuleById
} = require('../config/mock-data');

// Afficher la liste des patientes
exports.getPatients = async (req, res) => {
  try {
    const patients = getAllPatients();
    
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
exports.getAddPatientForm = (req, res) => {
  res.render('patients/add', {
    title: 'Ajouter une patiente',
    active: 'patients',
    patient: {}
  });
};

// Ajouter une nouvelle patiente (simulé)
exports.addPatient = async (req, res) => {
  try {
    // Dans une vraie implémentation, on sauvegarderait les données
    // Ici on redirige simplement vers la liste des patientes
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
    const patient = getPatientById(req.params.id);
    
    if (!patient) {
      return res.status(404).render('error', {
        title: 'Patiente non trouvée',
        message: 'La patiente demandée n\'existe pas',
        error: { status: 404 }
      });
    }
    
    // Enrichir les données des modules assignés
    const patientWithModules = {
      ...patient,
      assignedModules: patient.assignedModules.map(am => {
        return {
          ...am,
          moduleDetails: getModuleById(am.module)
        };
      })
    };
    
    // Récupérer tous les modules pour l'assignation
    const allModules = getAllModules().filter(m => m.isPublished);
    
    res.render('patients/details', {
      title: 'Détails de la patiente',
      active: 'patients',
      patient: patientWithModules,
      allModules
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

// Afficher le formulaire de modification d'une patiente
exports.getEditPatientForm = async (req, res) => {
  try {
    const patient = getPatientById(req.params.id);
    
    if (!patient) {
      return res.status(404).render('error', {
        title: 'Patiente non trouvée',
        message: 'La patiente demandée n\'existe pas',
        error: { status: 404 }
      });
    }
    
    res.render('patients/edit', {
      title: 'Modifier la patiente',
      active: 'patients',
      patient
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

// Mettre à jour une patiente (simulé)
exports.updatePatient = async (req, res) => {
  try {
    // Dans une vraie implémentation, on mettrait à jour les données
    // Ici on redirige simplement vers les détails de la patiente
    res.redirect(`/patients/${req.params.id}`);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la patiente:', error);
    res.status(500).render('error', {
      title: 'Erreur',
      message: 'Une erreur est survenue lors de la mise à jour de la patiente',
      error
    });
  }
};

// Assigner un module à une patiente (simulé)
exports.assignModule = async (req, res) => {
  try {
    // Dans une vraie implémentation, on assignerait le module
    // Ici on redirige simplement vers les détails de la patiente
    res.redirect(`/patients/${req.params.id}`);
  } catch (error) {
    console.error('Erreur lors de l\'assignation du module:', error);
    res.status(500).render('error', {
      title: 'Erreur',
      message: 'Une erreur est survenue lors de l\'assignation du module',
      error
    });
  }
};

// Supprimer une patiente (simulé)
exports.deletePatient = async (req, res) => {
  try {
    // Dans une vraie implémentation, on supprimerait la patiente
    // Ici on redirige simplement vers la liste des patientes
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
