/**
 * Contrôleur pour les modules
 */

// Utilisation des données mockées au lieu de MongoDB
const { 
  getAllModules, 
  getModuleById,
  getAllPatients
} = require('../config/mock-data');

// Afficher la liste des modules
exports.getModules = async (req, res) => {
  try {
    const modules = getAllModules();
    
    res.render('modules/list', {
      title: 'Liste des modules',
      active: 'modules',
      modules
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des modules:', error);
    res.status(500).render('error', {
      title: 'Erreur',
      message: 'Une erreur est survenue lors de la récupération des modules',
      error
    });
  }
};

// Afficher le formulaire d'ajout de module
exports.getAddModuleForm = (req, res) => {
  res.render('modules/add', {
    title: 'Ajouter un module',
    active: 'modules',
    module: {}
  });
};

// Ajouter un nouveau module (simulé)
exports.addModule = async (req, res) => {
  try {
    // Dans une vraie implémentation, on sauvegarderait les données
    // Ici on redirige simplement vers la liste des modules
    res.redirect('/modules');
  } catch (error) {
    console.error('Erreur lors de la création du module:', error);
    res.status(500).render('error', {
      title: 'Erreur',
      message: 'Une erreur est survenue lors de la création du module',
      error
    });
  }
};

// Afficher les détails d'un module
exports.getModuleDetails = async (req, res) => {
  try {
    const module = getModuleById(req.params.id);
    
    if (!module) {
      return res.status(404).render('error', {
        title: 'Module non trouvé',
        message: 'Le module demandé n\'existe pas',
        error: { status: 404 }
      });
    }
    
    // Récupérer les patients assignés à ce module
    const allPatients = getAllPatients();
    const patients = allPatients.filter(patient => 
      patient.assignedModules.some(m => m.module === module.id)
    );
    
    res.render('modules/details', {
      title: 'Détails du module',
      active: 'modules',
      module,
      patients
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des détails du module:', error);
    res.status(500).render('error', {
      title: 'Erreur',
      message: 'Une erreur est survenue lors de la récupération des détails du module',
      error
    });
  }
};

// Afficher le formulaire de modification d'un module
exports.getEditModuleForm = async (req, res) => {
  try {
    const module = getModuleById(req.params.id);
    
    if (!module) {
      return res.status(404).render('error', {
        title: 'Module non trouvé',
        message: 'Le module demandé n\'existe pas',
        error: { status: 404 }
      });
    }
    
    res.render('modules/edit', {
      title: 'Modifier le module',
      active: 'modules',
      module
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du module à modifier:', error);
    res.status(500).render('error', {
      title: 'Erreur',
      message: 'Une erreur est survenue lors de la récupération du module à modifier',
      error
    });
  }
};

// Mettre à jour un module (simulé)
exports.updateModule = async (req, res) => {
  try {
    // Dans une vraie implémentation, on mettrait à jour les données
    // Ici on redirige simplement vers les détails du module
    res.redirect(`/modules/${req.params.id}`);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du module:', error);
    res.status(500).render('error', {
      title: 'Erreur',
      message: 'Une erreur est survenue lors de la mise à jour du module',
      error
    });
  }
};

// Supprimer un module (simulé)
exports.deleteModule = async (req, res) => {
  try {
    // Dans une vraie implémentation, on supprimerait le module
    // Ici on redirige simplement vers la liste des modules
    res.redirect('/modules');
  } catch (error) {
    console.error('Erreur lors de la suppression du module:', error);
    res.status(500).render('error', {
      title: 'Erreur',
      message: 'Une erreur est survenue lors de la suppression du module',
      error
    });
  }
};
