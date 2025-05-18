/**
 * Contrôleur pour les modules
 */

// Utilisation du modèle module avec MySQL
const Module = require('../models/module_mysql');
const Patient = require('../models/patient');
const { query } = require('../config/database');
const ModuleAssignment = require('../models/moduleAssignment');

// Fonction utilitaire pour récupérer toutes les catégories
const getAllCategories = async () => {
  const sql = 'SELECT * FROM categorie ORDER BY nom';
  return await query(sql);
};

// Afficher la liste des modules
exports.getModules = async (req, res) => {
  try {
    const modules = await Module.findAll();
    
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
exports.getAddModuleForm = async (req, res) => {
  try {
    // Récupérer toutes les catégories
    const categories = await getAllCategories();
    
    // Récupérer tous les types de blocs
    const blockTypes = await Module.getBlockTypes();
    
    res.render('modules/add', {
      title: 'Ajouter un module',
      active: 'modules',
      module: {},
      categories,
      blockTypes
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des données pour le formulaire:', error);
    res.status(500).render('error', {
      title: 'Erreur',
      message: 'Une erreur est survenue lors de la récupération des données pour le formulaire',
      error
    });
  }
};

// Ajouter un nouveau module 
exports.addModule = async (req, res) => {
  try {
    const moduleData = {
      titre: req.body.title,
      description: req.body.description,
      categorie_id: parseInt(req.body.category_id),
      miniature: req.body.thumbnail || '/images/default-module.png',
      est_publie: req.body.isPublished === 'on',
      est_gratuit: req.body.isFree === 'on',
      duree_estimee: parseInt(req.body.estimatedDuration || 0),
      cree_par: req.session.user.id
    };
    
    const newModule = await Module.create(moduleData);
    
    // Si des contenus sont fournis, les ajouter
    if (req.body.content && Array.isArray(req.body.content)) {
      for (let i = 0; i < req.body.content.length; i++) {
        const content = req.body.content[i];
        await Module.addContentBlock(newModule.id, {
          bloc_id: content.type,
          contenu: content.text,
          url_ressource: content.url || null,
          ordre: i + 1
        });
      }
    }
    
    // Rediriger vers la liste des modules
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
    const module = await Module.findById(req.params.id);
    
    if (!module) {
      return res.status(404).render('error', {
        title: 'Module non trouvé',
        message: 'Le module demandé n\'existe pas',
        error: { status: 404 }
      });
    }
    
    // Récupérer le contenu du module
    const moduleContent = await Module.getModuleContent(module.id);
    
    // Récupérer les patients assignés à ce module
    const assignedPatients = await ModuleAssignment.getPatientsAssignedToModule(module.id);
    
    // Récupérer les statistiques du module
    const moduleStats = await ModuleAssignment.getModuleStats(module.id);
    
    res.render('modules/details', {
      title: 'Détails du module',
      active: 'modules',
      module,
      moduleContent,
      patients: assignedPatients,
      stats: moduleStats
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
    const module = await Module.findById(req.params.id);
    
    if (!module) {
      return res.status(404).render('error', {
        title: 'Module non trouvé',
        message: 'Le module demandé n\'existe pas',
        error: { status: 404 }
      });
    }
    
    // Récupérer le contenu du module
    const moduleContent = await Module.getModuleContent(module.id);
    
    // Récupérer toutes les catégories
    const categories = await getAllCategories();
    
    res.render('modules/edit', {
      title: 'Modifier le module',
      active: 'modules',
      module,
      moduleContent,
      categories
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

// Mettre à jour un module
exports.updateModule = async (req, res) => {
  try {
    const { id } = req.params;
    
    const moduleData = {
      titre: req.body.title,
      description: req.body.description,
      categorie_id: parseInt(req.body.category_id),
      miniature: req.body.thumbnail || '/images/default-module.png',
      est_publie: req.body.isPublished === 'on',
      est_gratuit: req.body.isFree === 'on',
      duree_estimee: parseInt(req.body.estimatedDuration || 0)
    };
    
    // Mettre à jour les informations du module
    await Module.update(id, moduleData);
    
    // Si la mise à jour du contenu est demandée
    if (req.body.updateContent === 'true') {
      // Supprimer tous les blocs existants et les recréer
      const existingBlocks = await Module.getModuleContent(id);
      for (const block of existingBlocks) {
        await Module.removeContentBlock(block.id);
      }
      
      // Ajouter les nouveaux blocs
      if (req.body.content && Array.isArray(req.body.content)) {
        for (let i = 0; i < req.body.content.length; i++) {
          const content = req.body.content[i];
          await Module.addContentBlock(id, {
            bloc_id: content.type,
            contenu: content.text,
            url_ressource: content.url || null,
            ordre: i + 1
          });
        }
      }
    }
    
    res.redirect(`/modules/${id}`);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du module:', error);
    res.status(500).render('error', {
      title: 'Erreur',
      message: 'Une erreur est survenue lors de la mise à jour du module',
      error
    });
  }
};

// Supprimer un module
exports.deleteModule = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Supprimer le module de la base de données
    await Module.remove(id);
    
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
